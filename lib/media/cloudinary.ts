import 'server-only'

import { v2 as cloudinary } from 'cloudinary'
import { env, requireService } from '@/lib/env'
import { AppError } from '@/lib/errors'

let configured = false
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
const ALLOWED_FORMATS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'])

function client() {
  requireService('media')
  if (!configured) {
    cloudinary.config({ cloud_name: env.CLOUDINARY_CLOUD_NAME, api_key: env.CLOUDINARY_API_KEY, api_secret: env.CLOUDINARY_API_SECRET, secure: true })
    configured = true
  }
  return cloudinary
}

export const MEDIA_FOLDER = 'asfakul-siam'

export function signUpload(folder = MEDIA_FOLDER) {
  const c = client()
  const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, '').replace(/^\/+|\/+$/g, '') || MEDIA_FOLDER
  const timestamp = Math.round(Date.now() / 1000)
  const params = { folder: safeFolder, timestamp }
  return { cloudName: env.CLOUDINARY_CLOUD_NAME!, apiKey: env.CLOUDINARY_API_KEY!, timestamp, folder: safeFolder, signature: c.utils.api_sign_request(params, env.CLOUDINARY_API_SECRET!) }
}

export function validateUpload(file: { size: number; type: string; name?: string }, bytes?: Uint8Array) {
  if (!Number.isInteger(file.size) || file.size <= 0 || file.size > MAX_UPLOAD_BYTES) throw new AppError('INVALID_INPUT', 'Image must be between 1 byte and 10 MB.')
  const format = file.type.split('/')[1]?.toLowerCase()
  if (file.type.split('/')[0] !== 'image' || !format || !ALLOWED_FORMATS.has(format)) throw new AppError('INVALID_INPUT', 'Unsupported image format.')
  if (!bytes || bytes.byteLength < 12) throw new AppError('INVALID_INPUT', 'Image content could not be verified.')
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47
  const isGif = bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38
  const isWebp = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  const verified = (format === 'jpg' || format === 'jpeg') ? isJpeg : format === 'png' ? isPng : format === 'gif' ? isGif : format === 'webp' ? isWebp : false
  if (!verified) throw new AppError('INVALID_INPUT', 'Image content does not match its declared format.')
  return format
}

export function imageTransform(publicId: string, options: { width?: number; height?: number; quality?: string } = {}) {
  const cloudName = client() && env.CLOUDINARY_CLOUD_NAME
  if (!publicId || !/^[a-zA-Z0-9_\-/]+$/.test(publicId)) throw new AppError('INVALID_INPUT', 'Invalid media identifier.')
  const transformation = [options.width || options.height ? `c_fill,w_${options.width ?? 'auto'},h_${options.height ?? 'auto'}` : '', options.quality ? `q_${options.quality}` : 'q_auto', 'f_auto'].filter(Boolean).join(',')
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/${publicId}`
}

export async function destroyAsset(publicId: string) {
  if (!publicId.trim()) throw new AppError('INVALID_INPUT', 'A public id is required.')
  try {
    const result = await client().uploader.destroy(publicId, { invalidate: true, resource_type: 'image' })
    if (result.result !== 'ok' && result.result !== 'not found') throw new AppError('DEPENDENCY_UNAVAILABLE', 'Media deletion was not confirmed.')
    return result.result
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError('DEPENDENCY_UNAVAILABLE', 'Media deletion failed.', error)
  }
}

import type { MediaRef } from '@/lib/cms/types'

const WIDTHS = [480, 768, 1080, 1440, 1920, 2560]

function isCloudinary(url: string) {
  return url.includes('res.cloudinary.com') && url.includes('/upload/')
}

export function transformUrl(url: string, transform: string) {
  if (!isCloudinary(url)) return url
  return url.replace('/upload/', `/upload/${transform}/`)
}

export interface ImageSourceOptions {
  aspect?: string
  gravity?: 'auto' | 'face' | 'center'
  maxWidth?: number
}

export function imageSources(media: MediaRef, { aspect, gravity = 'auto', maxWidth = 2560 }: ImageSourceOptions = {}) {
  const base = ['f_auto', 'q_auto']
  if (aspect) base.push(`ar_${aspect}`, 'c_fill', `g_${gravity}`)
  else base.push('c_limit')
  const widths = WIDTHS.filter((w) => w <= maxWidth && (!media.width || w <= media.width * 1.1))
  const usable = widths.length ? widths : [Math.min(media.width ?? 1080, maxWidth)]
  const src = transformUrl(media.url, [...base, `w_${usable[Math.min(2, usable.length - 1)]}`].join(','))
  const srcSet = isCloudinary(media.url)
    ? usable.map((w) => `${transformUrl(media.url, [...base, `w_${w}`].join(','))} ${w}w`).join(', ')
    : undefined
  return { src, srcSet }
}

export function thumbnail(media: MediaRef, size = 160) {
  return transformUrl(media.url, `f_auto,q_auto,c_fill,g_auto,w_${size},h_${size}`)
}

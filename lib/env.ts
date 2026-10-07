import 'server-only'

import { z } from 'zod'
import { AppError } from '@/lib/errors'

const optionalTrimmed = z.string().trim().min(1).optional()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  MONGODB_URI: optionalTrimmed,
  MONGODB_DB: optionalTrimmed,
  AUTH_SECRET: optionalTrimmed,
  ADMIN_EMAIL: z.string().trim().email().optional(),
  ADMIN_PASSWORD_HASH: z.string().trim().refine(
    (value) => /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(value),
    'ADMIN_PASSWORD_HASH must be a valid bcrypt hash',
  ).optional(),
  NEXTAUTH_URL: optionalTrimmed,
  NEXT_PUBLIC_SITE_URL: optionalTrimmed,
  GEMINI_API_KEY: optionalTrimmed,
  GITHUB_TOKEN: optionalTrimmed,
  CLOUDINARY_CLOUD_NAME: optionalTrimmed,
  CLOUDINARY_API_KEY: optionalTrimmed,
  CLOUDINARY_API_SECRET: optionalTrimmed,
  RESEND_API_KEY: optionalTrimmed,
  RESEND_FROM: optionalTrimmed,
})

const parsed = envSchema.safeParse(process.env)
if (!parsed.success) throw new AppError('CONFIGURATION_ERROR', 'Invalid environment configuration.', parsed.error.flatten())

const value = parsed.data
const requiredInProduction = ['MONGODB_URI', 'MONGODB_DB', 'AUTH_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD_HASH', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'RESEND_API_KEY', 'RESEND_FROM'] as const
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'
if (value.NODE_ENV === 'production' && !isBuildPhase) {
  const missing = requiredInProduction.filter((key) => !value[key])
  if (missing.length) throw new AppError('CONFIGURATION_ERROR', `Missing production environment variables: ${missing.join(', ')}`)
}

export const env = value
export const services = {
  get database() { return Boolean(env.MONGODB_URI && env.MONGODB_DB) },
  get auth() { return Boolean(env.AUTH_SECRET && env.ADMIN_EMAIL && env.ADMIN_PASSWORD_HASH) },
  get media() { return Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) },
  get email() { return Boolean(env.RESEND_API_KEY && env.RESEND_FROM) },
}
export function serviceStatus() { return { database: services.database, auth: services.auth, media: services.media, email: services.email } }
export type ServiceStatus = ReturnType<typeof serviceStatus>

export function requireService(service: keyof ServiceStatus) {
  if (!services[service]) throw new AppError('DEPENDENCY_UNAVAILABLE', `${service} service is not configured.`)
}

export const previewFallbacks = {
  database: 'CMS data is unavailable in preview.',
  media: 'Media service is unavailable in preview.',
  email: 'Email service is unavailable in preview.',
} as const

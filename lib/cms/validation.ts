import { z } from 'zod'
import type { CollectionDef, FieldDef } from './registry'

const mediaRef = z.object({
  publicId: z.string().min(1).max(300),
  url: z.string().url().max(1000),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  alt: z.string().max(300).optional(),
})

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v === '' ? undefined : v))

function fieldSchema(field: FieldDef): z.ZodTypeAny {
  switch (field.type) {
    case 'text': {
      if (field.name === 'slug') {
        const slug = z
          .string()
          .trim()
          .toLowerCase()
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens')
          .max(120)
        return field.required ? slug : slug.optional()
      }
      return field.required ? z.string().trim().min(1, `${field.label} is required`).max(300) : optionalText(300)
    }
    case 'textarea':
      return field.required ? z.string().trim().min(1, `${field.label} is required`).max(4000) : optionalText(4000)
    case 'longtext':
      return field.required ? z.string().trim().min(1).max(40000) : optionalText(40000)
    case 'url': {
      const url = z.string().trim().url('Enter a valid URL').max(1000)
      return field.required ? url : z.union([url, z.literal('')]).optional().transform((v) => (v ? v : undefined))
    }
    case 'email': {
      const email = z.string().trim().email('Enter a valid email').max(320)
      return field.required ? email : z.union([email, z.literal('')]).optional().transform((v) => (v ? v : undefined))
    }
    case 'color':
      return z
        .union([z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Use a hex colour like #FF4A1C'), z.literal('')])
        .optional()
        .transform((v) => (v ? v : undefined))
    case 'number': {
      let n = z.coerce.number()
      if (field.min !== undefined) n = n.min(field.min)
      if (field.max !== undefined) n = n.max(field.max)
      return field.required ? n : z.union([n, z.literal(''), z.null()]).optional().transform((v) => (typeof v === 'number' ? v : undefined))
    }
    case 'boolean':
      return z.boolean().default(Boolean(field.defaultValue))
    case 'select': {
      const values = (field.options ?? []).map((o) => o.value) as [string, ...string[]]
      const e = z.enum(values)
      return field.required ? e : e.optional()
    }
    case 'multiselect': {
      const values = (field.options ?? []).map((o) => o.value) as [string, ...string[]]
      return z.array(z.enum(values)).max(values.length).default([])
    }
    case 'tags': {
      const arr = z.array(z.string().trim().min(1).max(120)).max(60)
      return field.required ? arr.min(1, `Add at least one ${field.label.toLowerCase()}`) : arr.default([])
    }
    case 'image':
      return field.required ? mediaRef : mediaRef.nullable().optional()
    case 'gallery':
      return z.array(mediaRef).max(40).default([])
  }
}

export function buildSchema(def: CollectionDef) {
  const shape: Record<string, z.ZodTypeAny> = {}
  for (const field of def.fields) shape[field.name] = fieldSchema(field)
  return z.object(shape)
}

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Tell me your name').max(120),
  email: z.string().trim().email('That email looks off').max(320),
  projectType: z.string().trim().max(120).optional().transform((v) => (v ? v : undefined)),
  message: z.string().trim().min(10, 'A little more detail, please').max(5000),
  company: z.string().max(0).optional(),
  idempotencyKey: z.string().trim().min(16).max(128).optional(),
})

export const mediaRecordSchema = z.object({
  publicId: z.string().min(1).max(300),
  url: z.string().url().max(1000),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  format: z.string().max(20).optional(),
  bytes: z.number().int().nonnegative().optional(),
  folder: z.string().max(200).optional(),
  alt: z.string().max(300).optional(),
})

import { cn } from '@/lib/utils'
import { imageSources, type ImageSourceOptions } from '@/lib/media/image'
import type { MediaRef } from '@/lib/cms/types'

export function CmsImage({
  media,
  alt,
  sizes = '100vw',
  className,
  priority = false,
  ...options
}: {
  media: MediaRef
  alt?: string
  sizes?: string
  className?: string
  priority?: boolean
} & ImageSourceOptions) {
  const { src, srcSet } = imageSources(media, options)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt ?? media.alt ?? ''}
      width={media.width}
      height={media.height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={cn('mood-image h-full w-full object-cover', className)}
    />
  )
}

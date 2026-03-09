import Image from 'next/image'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { urlForImage } from '@/sanity/lib/image'

interface SanityImageProps {
  source: SanityImageSource
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  sizes?: string
  priority?: boolean
}

export default function SanityImage({
  source,
  alt,
  width,
  height,
  fill = false,
  className,
  sizes,
  priority = false,
}: SanityImageProps) {
  if (!source) return null

  const builder = urlForImage(source)

  if (fill) {
    return (
      <Image
        src={builder.url()}
        alt={alt}
        fill
        className={className}
        sizes={sizes || '100vw'}
        priority={priority}
      />
    )
  }

  const w = width || 800
  const h = height || Math.round(w * 0.667)

  return (
    <Image
      src={builder.width(w).height(h).url()}
      alt={alt}
      width={w}
      height={h}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  )
}

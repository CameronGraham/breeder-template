import Image from 'next/image'
import Link from 'next/link'
import { urlForImage } from '@/sanity/lib/image'
import type { SanityImage } from '@/types'

interface HeroBlockProps {
  image?: SanityImage
  title?: string
  subtitle?: string
  buttonLabel?: string
  buttonUrl?: string
}

export default function HeroBlock({ image, title, subtitle, buttonLabel, buttonUrl }: HeroBlockProps) {
  return (
    <div className="relative h-[70vh] min-h-[400px] max-h-[800px] flex items-end overflow-hidden bg-primary-900">
      {image && (
        <Image
          src={urlForImage(image).width(1600).height(900).url()}
          alt={title || 'Hero image'}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto w-full">
        {title && (
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg max-w-3xl">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl leading-relaxed drop-shadow">
            {subtitle}
          </p>
        )}
        {buttonLabel && buttonUrl && (
          <Link
            href={buttonUrl}
            className="inline-block bg-primary-500 hover:bg-primary-400 text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-200 text-lg shadow-lg"
          >
            {buttonLabel}
          </Link>
        )}
      </div>
    </div>
  )
}

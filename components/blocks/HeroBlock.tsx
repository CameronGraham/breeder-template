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
    <div className="relative h-[75vh] min-h-[480px] max-h-[900px] flex items-end overflow-hidden bg-[#1a1714]">
      {image && (
        <Image
          src={urlForImage(image).width(1800).height(1000).url()}
          alt={title || 'Hero image'}
          fill
          className="object-cover object-center opacity-70"
          priority
          sizes="100vw"
        />
      )}
      {/* Layered gradient: subtle vignette + bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

      <div className="relative z-10 px-6 sm:px-8 lg:px-16 pb-16 md:pb-24 max-w-7xl mx-auto w-full">
        {/* Gold rule accent */}
        <div className="h-px w-16 bg-[#c4a05a] mb-6" />

        {title && (
          <h1 className="font-heading font-normal text-5xl md:text-7xl lg:text-8xl text-white mb-5 max-w-4xl leading-tight tracking-wide">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="font-body text-lg md:text-xl text-white/75 mb-10 max-w-xl leading-relaxed">
            {subtitle}
          </p>
        )}
        {buttonLabel && buttonUrl && (
          <Link
            href={buttonUrl}
            className="inline-flex items-center gap-3 font-body text-sm tracking-[0.15em] uppercase border border-white/50 text-white hover:bg-white hover:text-[#1a1714] px-8 py-4 transition-all duration-300"
          >
            {buttonLabel}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  )
}

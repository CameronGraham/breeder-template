import Image from 'next/image'
import type { SanityImage } from '@/types'
import { urlForImage } from '@/sanity/lib/image'

interface PageHeroProps {
  image?: SanityImage
  title: string
  subtitle?: string
  overlay?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function PageHero({
  image,
  title,
  subtitle,
  overlay = true,
  size = 'md',
}: PageHeroProps) {
  const heightClass = {
    sm: 'h-48 md:h-64',
    md: 'h-64 md:h-80 lg:h-96',
    lg: 'h-80 md:h-[32rem] lg:h-[40rem]',
  }[size]

  if (!image) {
    return (
      <div className={`relative ${heightClass} bg-[#1a1714] flex items-end overflow-hidden`}>
        {/* Subtle texture */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 25% 50%, #c4a05a 0%, transparent 60%), radial-gradient(circle at 75% 20%, #3a9a3a 0%, transparent 50%)',
        }} />
        <div className="relative z-10 px-6 sm:px-8 lg:px-12 pb-10 md:pb-14 max-w-7xl mx-auto w-full">
          <div className="h-px w-12 bg-[#c4a05a] mb-5" />
          <h1 className="font-heading font-normal text-4xl md:text-6xl tracking-wide text-[#f0e8d8] mb-3 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="font-body text-base md:text-lg text-[#9e8e7e] max-w-xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${heightClass} overflow-hidden`}>
      <Image
        src={urlForImage(image).width(1600).height(700).url()}
        alt={title}
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      )}
      <div className="absolute inset-0 flex items-end">
        <div className="px-6 sm:px-8 lg:px-12 pb-10 md:pb-14 max-w-7xl mx-auto w-full">
          <div className="h-px w-12 bg-[#c4a05a] mb-5" />
          <h1 className="font-heading font-normal text-4xl md:text-6xl tracking-wide text-white mb-3 leading-tight drop-shadow-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="font-body text-base md:text-lg text-white/80 max-w-xl leading-relaxed drop-shadow">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

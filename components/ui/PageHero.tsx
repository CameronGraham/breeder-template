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
      <div className={`relative ${heightClass} bg-primary-800 flex items-center justify-center`}>
        <div className="text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto leading-relaxed">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
      )}
      <div className="absolute inset-0 flex items-end pb-10 md:pb-16">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed drop-shadow">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

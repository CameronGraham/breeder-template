'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/image'
import type { GalleryImage } from '@/types'

interface GalleryProps {
  images: GalleryImage[]
  columns?: 2 | 3 | 4
}

export default function Gallery({ images, columns = 3 }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null
      return (prev + 1) % images.length
    })
  }, [images.length])

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null
      return (prev - 1 + images.length) % images.length
    })
  }, [images.length])

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'Escape') closeLightbox()
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxIndex, goNext, goPrev, closeLightbox])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [lightboxIndex])

  if (!images || images.length === 0) return null

  const colClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  }[columns]

  const currentImage = lightboxIndex !== null ? images[lightboxIndex] : null

  return (
    <>
      <div className={`grid ${colClass} gap-3 md:gap-4`}>
        {images.map((img, index) => (
          <button
            key={img._key || index}
            className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            onClick={() => openLightbox(index)}
            aria-label={img.caption || img.altText || `View image ${index + 1}`}
          >
            <Image
              src={urlForImage(img.image).width(500).height(500).url()}
              alt={img.altText || img.caption || `Gallery image ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {img.caption && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
                <p className="text-white text-sm px-3 pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                  {img.caption}
                </p>
              </div>
            )}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-xl transition-colors duration-300 pointer-events-none" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && currentImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev button */}
          {images.length > 1 && (
            <button
              className="absolute left-3 md:left-6 z-10 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              aria-label="Previous image"
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full mx-16 md:mx-24 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={urlForImage(currentImage.image).width(1200).height(900).url()}
              alt={currentImage.altText || currentImage.caption || `Gallery image ${lightboxIndex + 1}`}
              width={1200}
              height={900}
              className="max-h-[85vh] w-auto h-auto object-contain rounded-lg"
              sizes="(max-width: 1280px) 90vw, 1200px"
              priority
            />
            {currentImage.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm text-center py-2 px-4 rounded-b-lg">
                {currentImage.caption}
              </div>
            )}
          </div>

          {/* Next button */}
          {images.length > 1 && (
            <button
              className="absolute right-3 md:right-6 z-10 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
              onClick={(e) => { e.stopPropagation(); goNext() }}
              aria-label="Next image"
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i) }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === lightboxIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}

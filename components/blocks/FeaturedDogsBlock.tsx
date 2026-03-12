import Link from 'next/link'
import DogCard from '@/components/dog/DogCard'
import type { FeaturedDogsBlock as FeaturedDogsBlockType } from '@/types'

interface FeaturedDogsBlockProps {
  block: FeaturedDogsBlockType
}

export default function FeaturedDogsBlock({ block }: FeaturedDogsBlockProps) {
  if (!block.dogs || block.dogs.length === 0) return null

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f5f0e8]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="eyebrow">Our Breeding Programme</span>
            <h2 className="font-heading font-normal text-4xl md:text-5xl tracking-wide text-[#1a1714]">
              {block.heading || 'Our Dogs'}
            </h2>
          </div>
          <Link
            href="/dogs"
            className="hidden sm:inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase text-[#7a6c5c] hover:text-[#c4a05a] transition-colors pb-1 border-b border-[#c8bfb0] hover:border-[#c4a05a]"
          >
            View All
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {block.dogs.map((dog) => (
            <DogCard key={dog._id} dog={dog} />
          ))}
        </div>
        <div className="mt-8 sm:hidden">
          <Link
            href="/dogs"
            className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase text-[#7a6c5c] hover:text-[#c4a05a] transition-colors pb-1 border-b border-[#c8bfb0] hover:border-[#c4a05a]"
          >
            View All Dogs
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

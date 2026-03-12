import Link from 'next/link'
import LitterCard from '@/components/litter/LitterCard'
import type { FeaturedLittersBlock as FeaturedLittersBlockType } from '@/types'

interface FeaturedLittersBlockProps {
  block: FeaturedLittersBlockType
}

export default function FeaturedLittersBlock({ block }: FeaturedLittersBlockProps) {
  if (!block.litters || block.litters.length === 0) return null

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="eyebrow">Breeding Programme</span>
            <h2 className="font-heading font-normal text-4xl md:text-5xl tracking-wide text-[#1a1714]">
              {block.heading || 'Recent Litters'}
            </h2>
          </div>
          <Link
            href="/litters"
            className="hidden sm:inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase text-[#7a6c5c] hover:text-[#c4a05a] transition-colors pb-1 border-b border-[#c8bfb0] hover:border-[#c4a05a]"
          >
            View All
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {block.litters.map((litter) => (
            <LitterCard key={litter._id} litter={litter} />
          ))}
        </div>
        <div className="mt-8 sm:hidden">
          <Link
            href="/litters"
            className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase text-[#7a6c5c] hover:text-[#c4a05a] transition-colors pb-1 border-b border-[#c8bfb0] hover:border-[#c4a05a]"
          >
            View All Litters
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

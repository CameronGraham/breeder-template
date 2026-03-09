import Link from 'next/link'
import LitterCard from '@/components/litter/LitterCard'
import type { FeaturedLittersBlock as FeaturedLittersBlockType } from '@/types'

interface FeaturedLittersBlockProps {
  block: FeaturedLittersBlockType
}

export default function FeaturedLittersBlock({ block }: FeaturedLittersBlockProps) {
  if (!block.litters || block.litters.length === 0) return null

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-gray-900">
            {block.heading || 'Recent Litters'}
          </h2>
          <Link
            href="/litters"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1 transition-colors"
          >
            View All
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {block.litters.map((litter) => (
            <LitterCard key={litter._id} litter={litter} />
          ))}
        </div>
      </div>
    </section>
  )
}

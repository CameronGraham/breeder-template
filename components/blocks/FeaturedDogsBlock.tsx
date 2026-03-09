import Link from 'next/link'
import DogCard from '@/components/dog/DogCard'
import type { FeaturedDogsBlock as FeaturedDogsBlockType } from '@/types'

interface FeaturedDogsBlockProps {
  block: FeaturedDogsBlockType
}

export default function FeaturedDogsBlock({ block }: FeaturedDogsBlockProps) {
  if (!block.dogs || block.dogs.length === 0) return null

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-gray-900">
            {block.heading || 'Our Dogs'}
          </h2>
          <Link
            href="/dogs"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1 transition-colors"
          >
            View All
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {block.dogs.map((dog) => (
            <DogCard key={dog._id} dog={dog} />
          ))}
        </div>
      </div>
    </section>
  )
}

import { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { allLittersQuery } from '@/sanity/lib/queries'
import LitterCard from '@/components/litter/LitterCard'
import type { LitterSummary } from '@/types'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Litters',
  description: 'View our current, upcoming and past litters.',
}

export default async function LittersPage() {
  const litters = await client.fetch<LitterSummary[]>(allLittersQuery).catch(() => [])

  if (litters.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="font-heading text-4xl font-bold text-gray-800 mb-4">Litters</h1>
        <p className="text-gray-500 text-lg mb-6">
          No litters have been added yet. Check back soon, or get in touch to register your interest.
        </p>
        <a
          href="/contact"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Register Your Interest
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12 text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Litters
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Current, upcoming and past litters from our breeding programme.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
        {litters.map((litter) => (
          <LitterCard key={litter._id} litter={litter} />
        ))}
      </div>

      <div className="bg-primary-50 rounded-xl p-8 text-center">
        <h3 className="font-heading text-2xl font-semibold text-primary-800 mb-3">
          Interested in a Puppy?
        </h3>
        <p className="text-primary-700 mb-6">
          We recommend getting in touch early to be added to our waiting list.
          We&apos;ll keep you updated on planned litters.
        </p>
        <a
          href="/contact"
          className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
        >
          Join the Waiting List
        </a>
      </div>
    </div>
  )
}

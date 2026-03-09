import { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { allDogsQuery } from '@/sanity/lib/queries'
import DogCard from '@/components/dog/DogCard'
import type { DogSummary } from '@/types'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Our Dogs',
  description: 'Meet the dogs and bitches that form our breeding programme.',
}

export default async function DogsPage() {
  const dogs = await client.fetch<DogSummary[]>(allDogsQuery).catch(() => [])

  const males = dogs.filter((d) => d.sex === 'dog')
  const females = dogs.filter((d) => d.sex === 'bitch')
  const unsexed = dogs.filter((d) => !d.sex)

  if (dogs.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="font-heading text-4xl font-bold text-gray-800 mb-4">Our Dogs</h1>
        <p className="text-gray-500 text-lg">
          No dogs have been added yet. Visit the studio to add your first dog profile.
        </p>
        <a
          href="/studio"
          className="mt-6 inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Open Studio
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12 text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Our Dogs
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Meet the dogs and bitches that form the heart of our breeding programme.
        </p>
      </header>

      {males.length > 0 && (
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-semibold text-gray-800 mb-8 pb-3 border-b border-gray-200">
            Dogs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {males.map((dog) => (
              <DogCard key={dog._id} dog={dog} />
            ))}
          </div>
        </section>
      )}

      {females.length > 0 && (
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-semibold text-gray-800 mb-8 pb-3 border-b border-gray-200">
            Bitches
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {females.map((dog) => (
              <DogCard key={dog._id} dog={dog} />
            ))}
          </div>
        </section>
      )}

      {unsexed.length > 0 && (
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-semibold text-gray-800 mb-8 pb-3 border-b border-gray-200">
            Dogs & Bitches
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {unsexed.map((dog) => (
              <DogCard key={dog._id} dog={dog} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

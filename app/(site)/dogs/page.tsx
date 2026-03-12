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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="h-px w-10 bg-[#c4a05a] mx-auto mb-6" />
        <h1 className="font-heading font-normal text-5xl tracking-wide text-[#1a1714] mb-5">Our Dogs</h1>
        <p className="font-body text-[#7a6c5c] text-lg mb-8">
          No dogs have been added yet. Visit the studio to add your first dog profile.
        </p>
        <a
          href="/studio"
          className="inline-flex items-center gap-2 font-body text-sm tracking-[0.12em] uppercase border border-[#1a1714] text-[#1a1714] px-8 py-3 hover:bg-[#1a1714] hover:text-[#f0e8d8] transition-all duration-200"
        >
          Open Studio
        </a>
      </div>
    )
  }

  return (
    <div>
      {/* Page header */}
      <div className="bg-[#1a1714] px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-20 md:pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="h-px w-12 bg-[#c4a05a] mb-6" />
          <h1 className="font-heading font-normal text-5xl md:text-7xl tracking-wide text-[#f0e8d8] leading-tight">
            Our Dogs
          </h1>
          <p className="font-body text-[#9e8e7e] text-base mt-4 max-w-lg">
            Meet the dogs and bitches that form the heart of our breeding programme.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {males.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-heading font-normal text-3xl tracking-wide text-[#1a1714]">Dogs</h2>
              <div className="flex-1 h-px bg-[#e8dfd2]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {males.map((dog) => (
                <DogCard key={dog._id} dog={dog} />
              ))}
            </div>
          </section>
        )}

        {females.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-heading font-normal text-3xl tracking-wide text-[#1a1714]">Bitches</h2>
              <div className="flex-1 h-px bg-[#e8dfd2]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {females.map((dog) => (
                <DogCard key={dog._id} dog={dog} />
              ))}
            </div>
          </section>
        )}

        {unsexed.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-heading font-normal text-3xl tracking-wide text-[#1a1714]">Dogs &amp; Bitches</h2>
              <div className="flex-1 h-px bg-[#e8dfd2]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {unsexed.map((dog) => (
                <DogCard key={dog._id} dog={dog} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

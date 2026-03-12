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

  const currentLitters = litters.filter((l) => !l.actualDate)
  const pastLitters = litters.filter((l) => !!l.actualDate)

  if (litters.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="h-px w-10 bg-[#c4a05a] mx-auto mb-6" />
        <h1 className="font-heading font-normal text-5xl tracking-wide text-[#1a1714] mb-5">Litters</h1>
        <p className="font-body text-[#7a6c5c] text-lg mb-8">
          No litters have been added yet. Check back soon, or get in touch to register your interest.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 font-body text-sm tracking-[0.12em] uppercase border border-[#1a1714] text-[#1a1714] px-8 py-3 hover:bg-[#1a1714] hover:text-[#f0e8d8] transition-all duration-200"
        >
          Register Your Interest
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
            Litters
          </h1>
          <p className="font-body text-[#9e8e7e] text-base mt-4 max-w-lg">
            Current, upcoming and past litters from our breeding programme.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {currentLitters.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-heading font-normal text-3xl tracking-wide text-[#1a1714] whitespace-nowrap">Current &amp; Upcoming</h2>
              <div className="flex-1 h-px bg-[#e8dfd2]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {currentLitters.map((litter) => (
                <LitterCard key={litter._id} litter={litter} />
              ))}
            </div>
          </section>
        )}

        {pastLitters.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-heading font-normal text-3xl tracking-wide text-[#1a1714] whitespace-nowrap">Past Litters</h2>
              <div className="flex-1 h-px bg-[#e8dfd2]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {pastLitters.map((litter) => (
                <LitterCard key={litter._id} litter={litter} />
              ))}
            </div>
          </section>
        )}

        {/* CTA — dark ink banner */}
        <div className="bg-[#1a1714] px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="eyebrow text-[#6b5c4c] mb-1">Join the waiting list</p>
            <h3 className="font-heading font-normal text-2xl md:text-3xl text-[#f0e8d8] tracking-wide">
              Interested in a Puppy?
            </h3>
            <p className="font-body text-sm text-[#9e8e7e] mt-2">
              We recommend getting in touch early. We&apos;ll keep you updated on planned litters.
            </p>
          </div>
          <a
            href="/contact"
            className="flex-shrink-0 inline-flex items-center gap-2 font-body text-sm tracking-[0.12em] uppercase border border-[#c4a05a] text-[#c4a05a] hover:bg-[#c4a05a] hover:text-[#1a1714] px-8 py-3 transition-all duration-200"
          >
            Get in Touch
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

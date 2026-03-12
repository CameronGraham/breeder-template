import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/sanity/lib/client'
import { litterBySlugQuery, allLitterSlugsQuery } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/image'
import PortableTextRenderer from '@/components/ui/PortableTextRenderer'
import HealthTestTable from '@/components/dog/HealthTestTable'
import PedigreeTree from '@/components/dog/PedigreeTree'
import Gallery from '@/components/ui/Gallery'
import LitterTimeline from '@/components/litter/LitterTimeline'
import StatusBadge from '@/components/litter/StatusBadge'
import type { Litter } from '@/types'

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(allLitterSlugsQuery).catch(() => [])
  return slugs.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const litter = await client.fetch<Litter>(litterBySlugQuery, { slug }).catch(() => null)
  if (!litter) return { title: 'Litter Not Found' }
  return {
    title: litter.title,
    description: `Details about the ${litter.title} litter.`,
  }
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function LitterPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const litter = await client.fetch<Litter>(litterBySlugQuery, { slug }).catch(() => null)

  if (!litter) {
    notFound()
  }

  const sireName = litter.sire
    ? (litter.sire.displayName || litter.sire.name)
    : litter.sireName

  const damName = litter.dam
    ? (litter.dam.displayName || litter.dam.name)
    : litter.damName

  const sireHealthTests = litter.sire?.healthTests || litter.sireHealthTests
  const damHealthTests = litter.dam?.healthTests || litter.damHealthTests
  const sirePhoto = litter.sirePhoto || litter.sire?.mainPhoto
  const damPhoto = litter.damPhoto || litter.dam?.mainPhoto

  return (
    <article>
      {/* Header */}
      <div className="bg-[#1a1714] px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-20 md:pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="h-px w-12 bg-[#c4a05a] mb-5" />
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <StatusBadge status={litter.status} />
          </div>
          <h1 className="font-heading font-normal text-4xl md:text-6xl tracking-wide text-[#f0e8d8] leading-tight mb-4">
            {litter.title}
          </h1>
          <div className="flex flex-wrap gap-6 font-body text-sm text-[#9e8e7e]">
            {litter.expectedDate && !litter.actualDate && (
              <span>Expected: <strong className="text-[#f0e8d8] font-medium">{formatDate(litter.expectedDate)}</strong></span>
            )}
            {litter.actualDate && (
              <span>Born: <strong className="text-[#f0e8d8] font-medium">{formatDate(litter.actualDate)}</strong></span>
            )}
            {litter.numberOfPuppies != null && (
              <span>
                <strong className="text-[#f0e8d8] font-medium">{litter.numberOfPuppies}</strong> puppies
                {litter.numberOfDogs != null && litter.numberOfBitches != null && (
                  <span className="text-[#6b5c4c]"> ({litter.numberOfDogs} dog{litter.numberOfDogs !== 1 ? 's' : ''}, {litter.numberOfBitches} bitch{litter.numberOfBitches !== 1 ? 'es' : ''})</span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* Sire & Dam */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-heading font-normal text-2xl md:text-3xl tracking-wide text-[#1a1714] whitespace-nowrap">Sire &amp; Dam</h2>
            <div className="flex-1 h-px bg-[#e8dfd2]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sire */}
            <div className="border border-[#e8dfd2] rounded-lg overflow-hidden">
              {sirePhoto && (
                <div className="relative h-48">
                  <Image
                    src={urlForImage(sirePhoto).width(600).height(300).url()}
                    alt={sireName || 'Sire'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="p-5">
                <p className="font-body text-xs uppercase tracking-[0.2em] text-[#9e8e7e] mb-2">Sire</p>
                {litter.sire ? (
                  <Link
                    href={`/dogs/${litter.sire.slug.current}`}
                    className="font-heading text-xl font-normal text-primary-700 hover:text-primary-800 transition-colors tracking-wide"
                  >
                    {sireName}
                  </Link>
                ) : (
                  <p className="font-heading text-xl font-normal text-[#1a1714] tracking-wide">{sireName || 'TBC'}</p>
                )}
                <dl className="space-y-2 text-sm mt-4">
                  {(litter.sire?.breed || litter.sireBreed) && (
                    <div className="flex justify-between">
                      <dt className="font-body text-xs uppercase tracking-wide text-[#9e8e7e]">Breed</dt>
                      <dd className="font-body text-sm font-medium text-[#1a1714] text-right">{litter.sire?.breed || litter.sireBreed}</dd>
                    </div>
                  )}
                  {(litter.sire?.colour || litter.sireColour) && (
                    <div className="flex justify-between">
                      <dt className="font-body text-xs uppercase tracking-wide text-[#9e8e7e]">Colour</dt>
                      <dd className="font-body text-sm font-medium text-[#1a1714] text-right">{litter.sire?.colour || litter.sireColour}</dd>
                    </div>
                  )}
                  {(litter.sire?.dateOfBirth || litter.sireDateOfBirth) && (
                    <div className="flex justify-between">
                      <dt className="font-body text-xs uppercase tracking-wide text-[#9e8e7e]">Born</dt>
                      <dd className="font-body text-sm font-medium text-[#1a1714]">{formatDate(litter.sire?.dateOfBirth || litter.sireDateOfBirth)}</dd>
                    </div>
                  )}
                  {(litter.sire?.registrationNumbers || litter.sireRegistrationNumbers)?.map((reg) => (
                    <div key={reg.label} className="flex justify-between">
                      <dt className="font-body text-xs uppercase tracking-wide text-[#9e8e7e]">{reg.label}</dt>
                      <dd className="font-body text-sm font-medium text-[#1a1714] text-right">{reg.value}</dd>
                    </div>
                  ))}
                </dl>
                {sireHealthTests && sireHealthTests.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#f0ece4]">
                    <p className="font-body text-xs uppercase tracking-[0.15em] text-[#9e8e7e] mb-3">Health Tests</p>
                    <HealthTestTable tests={sireHealthTests} dogName={sireName || 'Sire'} compact />
                  </div>
                )}
              </div>
            </div>

            {/* Dam */}
            <div className="border border-[#e8dfd2] rounded-lg overflow-hidden">
              {damPhoto && (
                <div className="relative h-48">
                  <Image
                    src={urlForImage(damPhoto).width(600).height(300).url()}
                    alt={damName || 'Dam'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="p-5">
                <p className="font-body text-xs uppercase tracking-[0.2em] text-[#9e8e7e] mb-2">Dam</p>
                {litter.dam ? (
                  <Link
                    href={`/dogs/${litter.dam.slug.current}`}
                    className="font-heading text-xl font-normal text-primary-700 hover:text-primary-800 transition-colors tracking-wide"
                  >
                    {damName}
                  </Link>
                ) : (
                  <p className="font-heading text-xl font-normal text-[#1a1714] tracking-wide">{damName || 'TBC'}</p>
                )}
                <dl className="space-y-2 text-sm mt-4">
                  {(litter.dam?.breed || litter.damBreed) && (
                    <div className="flex justify-between">
                      <dt className="font-body text-xs uppercase tracking-wide text-[#9e8e7e]">Breed</dt>
                      <dd className="font-body text-sm font-medium text-[#1a1714] text-right">{litter.dam?.breed || litter.damBreed}</dd>
                    </div>
                  )}
                  {(litter.dam?.colour || litter.damColour) && (
                    <div className="flex justify-between">
                      <dt className="font-body text-xs uppercase tracking-wide text-[#9e8e7e]">Colour</dt>
                      <dd className="font-body text-sm font-medium text-[#1a1714] text-right">{litter.dam?.colour || litter.damColour}</dd>
                    </div>
                  )}
                  {(litter.dam?.dateOfBirth || litter.damDateOfBirth) && (
                    <div className="flex justify-between">
                      <dt className="font-body text-xs uppercase tracking-wide text-[#9e8e7e]">Born</dt>
                      <dd className="font-body text-sm font-medium text-[#1a1714]">{formatDate(litter.dam?.dateOfBirth || litter.damDateOfBirth)}</dd>
                    </div>
                  )}
                  {(litter.dam?.registrationNumbers || litter.damRegistrationNumbers)?.map((reg) => (
                    <div key={reg.label} className="flex justify-between">
                      <dt className="font-body text-xs uppercase tracking-wide text-[#9e8e7e]">{reg.label}</dt>
                      <dd className="font-body text-sm font-medium text-[#1a1714] text-right">{reg.value}</dd>
                    </div>
                  ))}
                </dl>
                {damHealthTests && damHealthTests.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#f0ece4]">
                    <p className="font-body text-xs uppercase tracking-[0.15em] text-[#9e8e7e] mb-3">Health Tests</p>
                    <HealthTestTable tests={damHealthTests} dogName={damName || 'Dam'} compact />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Description */}
        {litter.description && litter.description.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-heading font-normal text-2xl md:text-3xl tracking-wide text-[#1a1714] whitespace-nowrap">About This Litter</h2>
              <div className="flex-1 h-px bg-[#e8dfd2]" />
            </div>
            <div className="prose-breeder">
              <PortableTextRenderer value={litter.description} />
            </div>
          </section>
        )}

        {/* Puppies */}
        {litter.puppies && litter.puppies.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-heading font-normal text-2xl md:text-3xl tracking-wide text-[#1a1714] whitespace-nowrap">The Puppies</h2>
              <div className="flex-1 h-px bg-[#e8dfd2]" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {litter.puppies.map((puppy) => {
                const puppyStatusConfig: Record<string, { label: string; className: string }> = {
                  available: { label: 'Available', className: 'text-emerald-700 border-emerald-300 bg-emerald-50' },
                  reserved: { label: 'Reserved', className: 'text-amber-700 border-amber-300 bg-amber-50' },
                  placed: { label: 'Placed', className: 'text-sky-700 border-sky-200 bg-sky-50' },
                  kept: { label: 'Kept', className: 'text-violet-700 border-violet-200 bg-violet-50' },
                }
                const statusInfo = puppy.status && puppy.status !== 'none' ? puppyStatusConfig[puppy.status] : null
                const sexLabel = puppy.sex === 'bitch' ? 'Bitch' : puppy.sex === 'dog' ? 'Dog' : null
                const card = (
                  <div className="bg-white border border-[#e8dfd2] group-hover:border-[#c4a05a] rounded-lg overflow-hidden transition-colors duration-200">
                    {puppy.photo ? (
                      <div className="relative h-36">
                        <Image
                          src={urlForImage(puppy.photo).width(300).height(200).url()}
                          alt={puppy.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        />
                      </div>
                    ) : (
                      <div className="h-36 bg-[#f5f0e8] flex items-center justify-center">
                        <svg className="w-8 h-8 text-[#c8bfb0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    )}
                    <div className="p-3">
                      <p className="font-heading text-base font-normal text-[#1a1714] leading-tight">{puppy.name}</p>
                      {(sexLabel || puppy.colour) && (
                        <p className="font-body text-xs text-[#9e8e7e] mt-0.5 uppercase tracking-wide">
                          {[sexLabel, puppy.colour].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      {statusInfo && (
                        <span className={`inline-block mt-2 font-body text-xs font-medium uppercase tracking-wide px-2 py-0.5 border rounded ${statusInfo.className}`}>
                          {statusInfo.label}
                        </span>
                      )}
                      {puppy.notes && (
                        <p className="font-body text-xs text-[#7a6c5c] mt-1.5 leading-snug">{puppy.notes}</p>
                      )}
                    </div>
                  </div>
                )
                return puppy.dogProfile ? (
                  <Link key={puppy._key} href={`/dogs/${puppy.dogProfile.slug.current}`} className="group">
                    {card}
                  </Link>
                ) : (
                  <div key={puppy._key}>{card}</div>
                )
              })}
            </div>
          </section>
        )}

        {/* Expected Pedigree */}
        {litter.puppyPedigree && (
          <section>
            <PedigreeTree pedigree={litter.puppyPedigree} title="Expected Puppy Pedigree" />
          </section>
        )}

        {/* Gallery */}
        {litter.gallery && litter.gallery.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-heading font-normal text-2xl md:text-3xl tracking-wide text-[#1a1714] whitespace-nowrap">Gallery</h2>
              <div className="flex-1 h-px bg-[#e8dfd2]" />
            </div>
            <Gallery images={litter.gallery} columns={3} />
          </section>
        )}

        {/* Timeline */}
        {litter.timeline && litter.timeline.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-heading font-normal text-2xl md:text-3xl tracking-wide text-[#1a1714] whitespace-nowrap">Litter Diary</h2>
              <div className="flex-1 h-px bg-[#e8dfd2]" />
            </div>
            <LitterTimeline updates={litter.timeline} />
          </section>
        )}

        {/* CTA */}
        <div className="bg-[#1a1714] px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="eyebrow text-[#6b5c4c] mb-1">Enquire today</p>
            <h3 className="font-heading font-normal text-2xl md:text-3xl text-[#f0e8d8] tracking-wide">
              Interested in a Puppy?
            </h3>
            <p className="font-body text-sm text-[#9e8e7e] mt-2">
              Get in touch to find out more about availability and our puppy waiting list.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 inline-flex items-center gap-2 font-body text-sm tracking-[0.12em] uppercase border border-[#c4a05a] text-[#c4a05a] hover:bg-[#c4a05a] hover:text-[#1a1714] px-8 py-3 transition-all duration-200"
          >
            Enquire Now
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}

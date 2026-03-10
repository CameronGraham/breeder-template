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
  const sirePhoto = litter.sire?.mainPhoto || litter.sirePhoto
  const damPhoto = litter.dam?.mainPhoto || litter.damPhoto

  return (
    <article>
      {/* Header */}
      <div className="bg-primary-800 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <StatusBadge status={litter.status} />
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">{litter.title}</h1>
          <div className="flex flex-wrap gap-6 text-primary-200 text-sm">
            {litter.expectedDate && !litter.actualDate && (
              <span>Expected: <strong className="text-white">{formatDate(litter.expectedDate)}</strong></span>
            )}
            {litter.actualDate && (
              <span>Born: <strong className="text-white">{formatDate(litter.actualDate)}</strong></span>
            )}
            {litter.numberOfPuppies != null && (
              <span>
                <strong className="text-white">{litter.numberOfPuppies}</strong> puppies
                {litter.numberOfDogs != null && litter.numberOfBitches != null && (
                  <span> ({litter.numberOfDogs} dog{litter.numberOfDogs !== 1 ? 's' : ''}, {litter.numberOfBitches} bitch{litter.numberOfBitches !== 1 ? 'es' : ''})</span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* Sire & Dam */}
        <section>
          <h2 className="font-heading text-2xl font-semibold text-gray-800 mb-8">
            Sire &amp; Dam
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sire */}
            <div className="bg-gray-50 rounded-xl overflow-hidden">
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
              <div className="p-6">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Sire</p>
                {litter.sire ? (
                  <Link
                    href={`/dogs/${litter.sire.slug.current}`}
                    className="font-heading text-xl font-semibold text-primary-700 hover:text-primary-800 transition-colors"
                  >
                    {sireName}
                  </Link>
                ) : (
                  <p className="font-heading text-xl font-semibold text-gray-800">{sireName || 'TBC'}</p>
                )}
                {litter.sireRegistrationNumbers && litter.sireRegistrationNumbers.length > 0 && !litter.sire && (
                  <dl className="space-y-1 text-sm mt-2">
                    {litter.sireRegistrationNumbers.map((reg) => (
                      <div key={reg.label} className="flex justify-between">
                        <dt className="text-gray-500">{reg.label}</dt>
                        <dd className="font-medium text-gray-800 text-right">{reg.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {sireHealthTests && sireHealthTests.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">Health Tests</h4>
                    <HealthTestTable tests={sireHealthTests} dogName={sireName || 'Sire'} compact />
                  </div>
                )}
              </div>
            </div>

            {/* Dam */}
            <div className="bg-gray-50 rounded-xl overflow-hidden">
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
              <div className="p-6">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Dam</p>
                {litter.dam ? (
                  <Link
                    href={`/dogs/${litter.dam.slug.current}`}
                    className="font-heading text-xl font-semibold text-primary-700 hover:text-primary-800 transition-colors"
                  >
                    {damName}
                  </Link>
                ) : (
                  <p className="font-heading text-xl font-semibold text-gray-800">{damName || 'TBC'}</p>
                )}
                {litter.damRegistrationNumbers && litter.damRegistrationNumbers.length > 0 && !litter.dam && (
                  <dl className="space-y-1 text-sm mt-2">
                    {litter.damRegistrationNumbers.map((reg) => (
                      <div key={reg.label} className="flex justify-between">
                        <dt className="text-gray-500">{reg.label}</dt>
                        <dd className="font-medium text-gray-800 text-right">{reg.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {damHealthTests && damHealthTests.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">Health Tests</h4>
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
            <h2 className="font-heading text-2xl font-semibold text-gray-800 mb-4">
              About This Litter
            </h2>
            <div className="prose-breeder">
              <PortableTextRenderer value={litter.description} />
            </div>
          </section>
        )}

        {/* Puppies */}
        {litter.puppies && litter.puppies.length > 0 && (
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-800 mb-6">The Puppies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {litter.puppies.map((puppy) => {
                const statusConfig: Record<string, { label: string; className: string }> = {
                  available: { label: 'Available', className: 'bg-green-100 text-green-800' },
                  reserved: { label: 'Reserved', className: 'bg-amber-100 text-amber-800' },
                  placed: { label: 'Placed', className: 'bg-blue-100 text-blue-800' },
                  kept: { label: 'Kept', className: 'bg-purple-100 text-purple-800' },
                }
                const statusInfo = puppy.status && puppy.status !== 'none' ? statusConfig[puppy.status] : null
                const sexLabel = puppy.sex === 'bitch' ? 'Bitch' : puppy.sex === 'dog' ? 'Dog' : null
                const card = (
                  <div className="bg-gray-50 rounded-xl overflow-hidden">
                    {puppy.photo ? (
                      <div className="relative h-40">
                        <Image
                          src={urlForImage(puppy.photo).width(300).height(200).url()}
                          alt={puppy.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        />
                      </div>
                    ) : (
                      <div className="h-40 bg-primary-50 flex items-center justify-center text-3xl">🐾</div>
                    )}
                    <div className="p-3">
                      <p className="font-semibold text-gray-900 text-sm leading-tight">{puppy.name}</p>
                      {(sexLabel || puppy.colour) && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {[sexLabel, puppy.colour].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      {statusInfo && (
                        <span className={`inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${statusInfo.className}`}>
                          {statusInfo.label}
                        </span>
                      )}
                      {puppy.notes && (
                        <p className="text-xs text-gray-500 mt-1.5 leading-snug">{puppy.notes}</p>
                      )}
                    </div>
                  </div>
                )
                return puppy.dogProfile ? (
                  <Link key={puppy._key} href={`/dogs/${puppy.dogProfile.slug.current}`} className="group hover:-translate-y-0.5 transition-transform duration-200">
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
            <h2 className="font-heading text-2xl font-semibold text-gray-800 mb-6">Gallery</h2>
            <Gallery images={litter.gallery} columns={3} />
          </section>
        )}

        {/* Timeline */}
        {litter.timeline && litter.timeline.length > 0 && (
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-800 mb-6">
              Litter Diary
            </h2>
            <LitterTimeline updates={litter.timeline} />
          </section>
        )}

        {/* CTA */}
        <div className="bg-primary-50 rounded-xl p-8 text-center">
          <h3 className="font-heading text-2xl font-semibold text-primary-800 mb-3">
            Interested in a Puppy?
          </h3>
          <p className="text-primary-700 mb-6">
            Get in touch to find out more about availability and our puppy waiting list.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
          >
            Enquire Now
          </Link>
        </div>
      </div>
    </article>
  )
}

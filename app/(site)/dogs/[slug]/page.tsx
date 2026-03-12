import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { client } from '@/sanity/lib/client'
import { dogBySlugQuery, allDogSlugsQuery } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/image'
import PortableTextRenderer from '@/components/ui/PortableTextRenderer'
import HealthTestTable from '@/components/dog/HealthTestTable'
import PedigreeTree from '@/components/dog/PedigreeTree'
import Gallery from '@/components/ui/Gallery'
import type { Dog } from '@/types'

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(allDogSlugsQuery).catch(() => [])
  return slugs.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const dog = await client.fetch<Dog>(dogBySlugQuery, { slug }).catch(() => null)
  if (!dog) return { title: 'Dog Not Found' }
  const displayName = dog.displayName || dog.name
  return {
    title: displayName,
    description: `Learn about ${displayName}, ${dog.breed || 'our dog'}.`,
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

const statusConfig: Record<string, { label: string; classes: string }> = {
  active: { label: 'Active', classes: 'text-emerald-700 border-emerald-300 bg-emerald-50' },
  retired: { label: 'Retired', classes: 'text-[#7a6c5c] border-[#c8bfb0] bg-[#f5f0e8]' },
  deceased: { label: 'Deceased', classes: 'text-[#6b5c4c] border-[#c8bfb0] bg-[#f0ece4]' },
}

export default async function DogPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const dog = await client.fetch<Dog>(dogBySlugQuery, { slug }).catch(() => null)

  if (!dog) {
    notFound()
  }

  const displayName = dog.displayName || dog.name
  const sexLabel = dog.sex === 'bitch' ? 'Bitch' : dog.sex === 'dog' ? 'Dog' : null
  const status = dog.status && dog.status !== 'none' ? statusConfig[dog.status] : null

  return (
    <article>
      {/* Hero */}
      <div className="relative h-72 md:h-[28rem] bg-[#1a1714] overflow-hidden">
        {dog.mainPhoto && (
          <Image
            src={urlForImage(dog.mainPhoto).width(1600).height(650).url()}
            alt={displayName}
            fill
            className="object-cover object-center opacity-60"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-8 lg:px-12 pb-8 md:pb-12 max-w-7xl mx-auto">
          <div className="h-px w-12 bg-[#c4a05a] mb-4" />
          <div className="flex flex-wrap items-end gap-3">
            <h1 className="font-heading font-normal text-4xl md:text-6xl tracking-wide text-white leading-tight">
              {displayName}
            </h1>
            {status && (
              <span className={`font-body text-xs font-medium uppercase tracking-wide px-2.5 py-1 border rounded mb-1 ${status.classes}`}>
                {status.label}
              </span>
            )}
          </div>
          {(sexLabel || dog.breed) && (
            <p className="font-body text-sm text-white/60 mt-2 tracking-wide">
              {[sexLabel, dog.breed].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            {dog.blurb && dog.blurb.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-heading font-normal text-2xl md:text-3xl tracking-wide text-[#1a1714]">About {dog.name}</h2>
                  <div className="flex-1 h-px bg-[#e8dfd2]" />
                </div>
                <div className="prose-breeder">
                  <PortableTextRenderer value={dog.blurb} />
                </div>
              </section>
            )}

            {/* Health Tests */}
            {dog.healthTests && dog.healthTests.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-heading font-normal text-2xl md:text-3xl tracking-wide text-[#1a1714]">Health Tests</h2>
                  <div className="flex-1 h-px bg-[#e8dfd2]" />
                </div>
                <HealthTestTable tests={dog.healthTests} dogName={dog.name} />
              </section>
            )}

            {/* Pedigree */}
            {dog.pedigree && (
              <section>
                <PedigreeTree pedigree={dog.pedigree} title="Pedigree" />
              </section>
            )}

            {/* Show Results */}
            {dog.showResults && dog.showResults.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-heading font-normal text-2xl md:text-3xl tracking-wide text-[#1a1714]">Show Results</h2>
                  <div className="flex-1 h-px bg-[#e8dfd2]" />
                </div>
                <div className="overflow-x-auto border border-[#e8dfd2] rounded-lg">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#f5f0e8] border-b border-[#e8dfd2]">
                        <th className="text-left py-3 px-4 font-body font-medium text-xs uppercase tracking-[0.1em] text-[#7a6c5c]">Show</th>
                        <th className="text-left py-3 px-4 font-body font-medium text-xs uppercase tracking-[0.1em] text-[#7a6c5c]">Date</th>
                        <th className="text-left py-3 px-4 font-body font-medium text-xs uppercase tracking-[0.1em] text-[#7a6c5c]">Result</th>
                        <th className="text-left py-3 px-4 font-body font-medium text-xs uppercase tracking-[0.1em] text-[#7a6c5c]">Judge</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0ece4]">
                      {dog.showResults.map((result, i) => (
                        <tr key={i} className="hover:bg-[#faf8f3] transition-colors">
                          <td className="py-3 px-4 font-body font-medium text-[#1a1714]">{result.showName}</td>
                          <td className="py-3 px-4 font-body text-[#7a6c5c]">{formatDate(result.date)}</td>
                          <td className="py-3 px-4 font-body font-semibold text-primary-700">{result.result}</td>
                          <td className="py-3 px-4 font-body text-[#7a6c5c]">{result.judge}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Gallery */}
            {dog.gallery && dog.gallery.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-heading font-normal text-2xl md:text-3xl tracking-wide text-[#1a1714]">Gallery</h2>
                  <div className="flex-1 h-px bg-[#e8dfd2]" />
                </div>
                <Gallery images={dog.gallery} columns={3} />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Details */}
            <div className="border border-[#e8dfd2] rounded-lg p-6">
              <p className="text-xs font-body uppercase tracking-[0.2em] text-[#9e8e7e] mb-5">Details</p>
              <dl className="space-y-3">
                {dog.breed && (
                  <div className="flex justify-between items-baseline gap-4">
                    <dt className="font-body text-xs uppercase tracking-wide text-[#9e8e7e]">Breed</dt>
                    <dd className="font-body text-sm font-medium text-[#1a1714] text-right">{dog.breed}</dd>
                  </div>
                )}
                {sexLabel && (
                  <div className="flex justify-between items-baseline gap-4">
                    <dt className="font-body text-xs uppercase tracking-wide text-[#9e8e7e]">Sex</dt>
                    <dd className="font-body text-sm font-medium text-[#1a1714]">{sexLabel}</dd>
                  </div>
                )}
                {dog.dateOfBirth && (
                  <div className="flex justify-between items-baseline gap-4">
                    <dt className="font-body text-xs uppercase tracking-wide text-[#9e8e7e]">Born</dt>
                    <dd className="font-body text-sm font-medium text-[#1a1714]">{formatDate(dog.dateOfBirth)}</dd>
                  </div>
                )}
                {dog.colour && (
                  <div className="flex justify-between items-baseline gap-4">
                    <dt className="font-body text-xs uppercase tracking-wide text-[#9e8e7e]">Colour</dt>
                    <dd className="font-body text-sm font-medium text-[#1a1714] text-right">{dog.colour}</dd>
                  </div>
                )}
                {dog.registrationNumbers?.map((reg: { label: string; value: string }) => (
                  <div key={reg.label} className="flex justify-between items-baseline gap-4">
                    <dt className="font-body text-xs uppercase tracking-wide text-[#9e8e7e]">{reg.label}</dt>
                    <dd className="font-body text-sm font-medium text-[#1a1714] text-right">{reg.value}</dd>
                  </div>
                ))}
                {status && (
                  <div className="flex justify-between items-center gap-4 pt-1">
                    <dt className="font-body text-xs uppercase tracking-wide text-[#9e8e7e]">Status</dt>
                    <dd>
                      <span className={`font-body text-xs font-medium uppercase tracking-wide px-2 py-0.5 border rounded ${status.classes}`}>
                        {status.label}
                      </span>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {dog.allowEnquiry === true && (
              <a
                href="/contact"
                className="block w-full bg-[#1a1714] text-[#f0e8d8] text-center py-3.5 px-6 hover:bg-[#c4a05a] hover:text-[#1a1714] transition-all duration-300 font-body text-sm tracking-[0.12em] uppercase"
              >
                Enquire About This Dog
              </a>
            )}
          </aside>
        </div>
      </div>
    </article>
  )
}

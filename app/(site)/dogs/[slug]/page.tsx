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
  const displayName = dog.kcTitle ? `${dog.kcTitle} ${dog.name}` : dog.name
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

  const displayName = dog.kcTitle ? `${dog.kcTitle} ${dog.name}` : dog.name
  const sexLabel = dog.sex === 'bitch' ? 'Bitch' : dog.sex === 'dog' ? 'Dog' : null

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    retired: 'bg-gray-100 text-gray-700',
    deceased: 'bg-stone-100 text-stone-700',
  }

  return (
    <article>
      {/* Hero */}
      <div className="relative h-64 md:h-96 bg-primary-900 overflow-hidden">
        {dog.mainPhoto && (
          <Image
            src={urlForImage(dog.mainPhoto).width(1600).height(600).url()}
            alt={displayName}
            fill
            className="object-cover object-center opacity-80"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-end gap-3">
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-white">
              {displayName}
            </h1>
            {dog.status && dog.status !== 'none' && (
              <span className={`text-sm font-semibold px-3 py-1 rounded-full mb-1 ${statusColors[dog.status] || 'bg-gray-100 text-gray-700'}`}>
                {dog.status.charAt(0).toUpperCase() + dog.status.slice(1)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* About */}
            {dog.blurb && dog.blurb.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl font-semibold text-gray-800 mb-4">
                  About {dog.name}
                </h2>
                <div className="prose-breeder">
                  <PortableTextRenderer value={dog.blurb} />
                </div>
              </section>
            )}

            {/* Health Tests */}
            {dog.healthTests && dog.healthTests.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl font-semibold text-gray-800 mb-4">
                  Health Tests
                </h2>
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
                <h2 className="font-heading text-2xl font-semibold text-gray-800 mb-4">
                  Show Results
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Show</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Result</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Judge</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {dog.showResults.map((result, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{result.showName}</td>
                          <td className="py-3 px-4 text-gray-600">{formatDate(result.date)}</td>
                          <td className="py-3 px-4 font-semibold text-primary-700">{result.result}</td>
                          <td className="py-3 px-4 text-gray-600">{result.judge}</td>
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
                <h2 className="font-heading text-2xl font-semibold text-gray-800 mb-4">
                  Gallery
                </h2>
                <Gallery images={dog.gallery} columns={3} />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Main photo (mobile hidden — shown in hero) */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <h3 className="font-heading text-lg font-semibold text-gray-800">Details</h3>
              <dl className="space-y-2 text-sm">
                {dog.breed && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Breed</dt>
                    <dd className="font-medium text-gray-800">{dog.breed}</dd>
                  </div>
                )}
                {sexLabel && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Sex</dt>
                    <dd className="font-medium text-gray-800">{sexLabel}</dd>
                  </div>
                )}
                {dog.dateOfBirth && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Date of Birth</dt>
                    <dd className="font-medium text-gray-800">{formatDate(dog.dateOfBirth)}</dd>
                  </div>
                )}
                {dog.colour && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Colour</dt>
                    <dd className="font-medium text-gray-800">{dog.colour}</dd>
                  </div>
                )}
                {dog.registrationNumbers?.map((reg: { label: string; value: string }) => (
                  <div key={reg.label} className="flex justify-between">
                    <dt className="text-gray-500">{reg.label}</dt>
                    <dd className="font-medium text-gray-800 text-right">{reg.value}</dd>
                  </div>
                ))}
                {dog.status && dog.status !== 'none' && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Status</dt>
                    <dd>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[dog.status] || 'bg-gray-100 text-gray-700'}`}>
                        {dog.status.charAt(0).toUpperCase() + dog.status.slice(1)}
                      </span>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <a
              href="/contact"
              className="block w-full bg-primary-600 text-white text-center py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
            >
              Enquire About This Dog
            </a>
          </aside>
        </div>
      </div>
    </article>
  )
}

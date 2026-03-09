import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { homepageQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import PageBuilder from '@/components/blocks/PageBuilder'
import PageHero from '@/components/ui/PageHero'
import type { Page, SiteSettings } from '@/types'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    client.fetch<Page>(homepageQuery).catch(() => null),
    client.fetch<SiteSettings>(siteSettingsQuery).catch(() => null),
  ])

  return {
    title: page?.seo?.seoTitle || page?.heroTitle || settings?.siteName || 'Home',
    description: page?.seo?.seoDescription || settings?.tagline,
  }
}

export default async function HomePage() {
  const page = await client.fetch<Page>(homepageQuery).catch(() => null)

  if (!page) {
    // Render a friendly placeholder if no homepage is configured
    return (
      <div>
        <div className="bg-primary-700 text-white py-24 px-4 text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
            Welcome to Our Kennel
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            We breed quality dogs with health, temperament, and breed type at the forefront of everything we do.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/dogs"
              className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Meet Our Dogs
            </a>
            <a
              href="/litters"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              View Litters
            </a>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-16 px-4 text-center">
          <h2 className="font-heading text-3xl font-semibold text-gray-800 mb-4">
            Getting Started
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            To configure your homepage, visit the Sanity Studio and create a Page document with the Homepage toggle enabled.
          </p>
          <a
            href="/studio"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Open Studio
          </a>
        </div>
      </div>
    )
  }

  return (
    <div>
      {(page.heroImage || page.heroTitle) && (
        <PageHero
          image={page.heroImage}
          title={page.heroTitle || page.title}
          subtitle={page.heroSubtitle}
          overlay={true}
        />
      )}
      {page.content && page.content.length > 0 && (
        <PageBuilder blocks={page.content} />
      )}
    </div>
  )
}

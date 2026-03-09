import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { pageBySlugQuery, allPageSlugsQuery } from '@/sanity/lib/queries'
import PageBuilder from '@/components/blocks/PageBuilder'
import PageHero from '@/components/ui/PageHero'
import type { Page } from '@/types'

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(allPageSlugsQuery).catch(() => [])
  return slugs.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await client.fetch<Page>(pageBySlugQuery, { slug }).catch(() => null)

  if (!page) {
    return { title: 'Page Not Found' }
  }

  return {
    title: page.seo?.seoTitle || page.heroTitle || page.title,
    description: page.seo?.seoDescription,
  }
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await client.fetch<Page>(pageBySlugQuery, { slug }).catch(() => null)

  if (!page) {
    notFound()
  }

  return (
    <div>
      {(page.heroImage || page.heroTitle || page.title) && (
        <PageHero
          image={page.heroImage}
          title={page.heroTitle || page.title}
          subtitle={page.heroSubtitle}
          overlay={!!page.heroImage}
        />
      )}
      {page.content && page.content.length > 0 && (
        <PageBuilder blocks={page.content} />
      )}
    </div>
  )
}

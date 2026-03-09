import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { newsPostBySlugQuery, allNewsSlugQuery } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/image'
import PortableTextRenderer from '@/components/ui/PortableTextRenderer'
import type { NewsPost } from '@/types'

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(allNewsSlugQuery).catch(() => [])
  return slugs.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await client.fetch<NewsPost>(newsPostBySlugQuery, { slug }).catch(() => null)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.title,
    description: post.excerpt,
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await client.fetch<NewsPost>(newsPostBySlugQuery, { slug }).catch(() => null)

  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <Link
        href="/news"
        className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium mb-8 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to News
      </Link>

      {/* Featured image */}
      {post.featuredImage && (
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
          <Image
            src={urlForImage(post.featuredImage).width(900).height(500).url()}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 900px"
          />
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <time className="text-sm text-gray-500 font-medium" dateTime={post.publishedAt}>
          {formatDate(post.publishedAt)}
        </time>
        {post.tags && post.tags.length > 0 && (
          <>
            <span className="text-gray-300">•</span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Title */}
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        {post.title}
      </h1>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-xl text-gray-600 font-medium mb-8 leading-relaxed border-l-4 border-primary-400 pl-4">
          {post.excerpt}
        </p>
      )}

      {/* Body */}
      {post.body && post.body.length > 0 && (
        <div className="prose-breeder">
          <PortableTextRenderer value={post.body} />
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          All News Posts
        </Link>
      </div>
    </article>
  )
}

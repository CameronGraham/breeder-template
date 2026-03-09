import { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { allNewsPostsQuery } from '@/sanity/lib/queries'
import NewsCard from '@/components/news/NewsCard'
import type { NewsPostSummary } from '@/types'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'News & Updates',
  description: 'The latest news and updates from our kennel.',
}

export default async function NewsPage() {
  const posts = await client.fetch<NewsPostSummary[]>(allNewsPostsQuery).catch(() => [])

  if (posts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="font-heading text-4xl font-bold text-gray-800 mb-4">News & Updates</h1>
        <p className="text-gray-500 text-lg">
          No news posts yet. Check back soon for updates from our kennel.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12 text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          News &amp; Updates
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          The latest news, show results and updates from our kennel.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <NewsCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  )
}

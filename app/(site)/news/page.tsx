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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="h-px w-10 bg-[#c4a05a] mx-auto mb-6" />
        <h1 className="font-heading font-normal text-5xl tracking-wide text-[#1a1714] mb-5">News &amp; Updates</h1>
        <p className="font-body text-[#7a6c5c] text-lg">
          No news posts yet. Check back soon for updates from our kennel.
        </p>
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
            News &amp; Updates
          </h1>
          <p className="font-body text-[#9e8e7e] text-base mt-4 max-w-lg">
            The latest news, show results and updates from our kennel.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <NewsCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}

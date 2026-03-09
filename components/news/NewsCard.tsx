import Link from 'next/link'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/image'
import type { NewsPostSummary } from '@/types'

interface NewsCardProps {
  post: NewsPostSummary
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function NewsCard({ post }: NewsCardProps) {
  return (
    <Link
      href={`/news/${post.slug.current}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      {/* Featured Image */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {post.featuredImage ? (
          <Image
            src={urlForImage(post.featuredImage).width(600).height(340).url()}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
            <svg className="w-12 h-12 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Date */}
        <time className="text-xs text-gray-400 font-medium uppercase tracking-wide block mb-2">
          {formatDate(post.publishedAt)}
        </time>

        {/* Title */}
        <h3 className="font-heading text-lg font-semibold text-gray-900 group-hover:text-primary-700 transition-colors leading-snug mb-3">
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
            {post.excerpt}
          </p>
        )}

        <div className="mt-4 flex items-center text-primary-600 text-sm font-medium group-hover:text-primary-700">
          <span>Read More</span>
          <svg className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

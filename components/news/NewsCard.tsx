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
      className="group bg-white border border-[#e8dfd2] hover:border-[#c4a05a] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col"
    >
      {/* Featured Image */}
      <div className="relative aspect-video overflow-hidden bg-[#f5f0e8]">
        {post.featuredImage ? (
          <Image
            src={urlForImage(post.featuredImage).width(600).height(340).url()}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#c8bfb0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Date */}
        <time className="font-body text-xs text-[#9e8e7e] uppercase tracking-[0.15em] block mb-3">
          {formatDate(post.publishedAt)}
        </time>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="font-body text-xs font-medium bg-[#f5f0e8] text-[#7a6c5c] border border-[#e0d5c4] px-2 py-0.5 rounded uppercase tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="font-heading text-xl font-normal text-[#1a1714] group-hover:text-primary-700 transition-colors leading-snug mb-3">
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="font-body text-sm text-[#7a6c5c] leading-relaxed line-clamp-3 flex-1">
            {post.excerpt}
          </p>
        )}

        <div className="mt-4 pt-3 border-t border-[#f0ece4] flex items-center justify-between">
          <span className="font-body text-xs text-[#9e8e7e] uppercase tracking-wider group-hover:text-primary-600 transition-colors">
            Read More
          </span>
          <svg className="w-4 h-4 text-[#c4a05a] transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import TextBlock from './TextBlock'
import HeroBlock from './HeroBlock'
import FeaturedDogsBlock from './FeaturedDogsBlock'
import FeaturedLittersBlock from './FeaturedLittersBlock'
import ContactFormBlock from './ContactFormBlock'
import PortableTextRenderer from '@/components/ui/PortableTextRenderer'
import NewsCard from '@/components/news/NewsCard'
import { urlForImage } from '@/sanity/lib/image'
import type {
  PageContentBlock,
  RichTextBlock,
  ImageBlock,
  TwoColumnTextBlock,
  FeaturedDogsBlock as FeaturedDogsBlockType,
  FeaturedLittersBlock as FeaturedLittersBlockType,
  LatestNewsBlock,
  ContactFormBlock as ContactFormBlockType,
  CallToActionBlock,
} from '@/types'

interface PageBuilderProps {
  blocks: PageContentBlock[]
}

function ImageBlockRenderer({ block }: { block: ImageBlock }) {
  if (!block.image) return null

  if (block.layout === 'full') {
    return (
      <section className="py-8">
        <figure className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative w-full rounded-2xl overflow-hidden">
            <Image
              src={urlForImage(block.image).width(1400).url()}
              alt={block.altText || block.caption || ''}
              width={1400}
              height={700}
              className="w-full h-auto"
              sizes="(max-width: 1280px) 100vw, 1400px"
            />
          </div>
          {block.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2 italic">{block.caption}</figcaption>
          )}
        </figure>
      </section>
    )
  }

  // Float left or right
  const floatSide = block.layout === 'left' ? 'float-left mr-8 mb-4' : 'float-right ml-8 mb-4'
  return (
    <div className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <figure className={`${floatSide} w-full sm:w-1/2 lg:w-2/5`}>
        <div className="rounded-xl overflow-hidden">
          <Image
            src={urlForImage(block.image).width(700).url()}
            alt={block.altText || block.caption || ''}
            width={700}
            height={467}
            className="w-full h-auto"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>
        {block.caption && (
          <figcaption className="text-center text-sm text-gray-500 mt-2 italic">{block.caption}</figcaption>
        )}
      </figure>
      <div className="clear-both" />
    </div>
  )
}

function TwoColumnTextRenderer({ block }: { block: TwoColumnTextBlock }) {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="prose-breeder">
          {block.leftContent && <PortableTextRenderer value={block.leftContent} />}
        </div>
        <div className="prose-breeder">
          {block.rightContent && <PortableTextRenderer value={block.rightContent} />}
        </div>
      </div>
    </section>
  )
}

function LatestNewsRenderer({ block }: { block: LatestNewsBlock }) {
  if (!block.posts || block.posts.length === 0) return null

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-gray-900">
            {block.heading || 'Latest News'}
          </h2>
          <Link
            href="/news"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1 transition-colors"
          >
            All Posts
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {block.posts.map((post) => (
            <NewsCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CallToActionRenderer({ block }: { block: CallToActionBlock }) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-700">
      <div className="max-w-3xl mx-auto text-center">
        {block.heading && (
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            {block.heading}
          </h2>
        )}
        {block.text && (
          <p className="text-primary-100 text-lg mb-8 leading-relaxed">
            {block.text}
          </p>
        )}
        {block.buttonLabel && block.buttonUrl && (
          <Link
            href={block.buttonUrl}
            className="inline-block bg-white text-primary-700 hover:bg-primary-50 font-bold px-8 py-4 rounded-xl transition-colors duration-200 text-lg shadow-lg"
          >
            {block.buttonLabel}
          </Link>
        )}
      </div>
    </section>
  )
}

export default function PageBuilder({ blocks }: PageBuilderProps) {
  if (!blocks || blocks.length === 0) return null

  return (
    <div>
      {blocks.map((block, index) => {
        switch (block._type) {
          case 'richText':
            return <TextBlock key={block._key || index} block={block as RichTextBlock} />

          case 'imageBlock':
            return <ImageBlockRenderer key={block._key || index} block={block as ImageBlock} />

          case 'twoColumnText':
            return <TwoColumnTextRenderer key={block._key || index} block={block as TwoColumnTextBlock} />

          case 'featuredDogs':
            return <FeaturedDogsBlock key={block._key || index} block={block as FeaturedDogsBlockType} />

          case 'featuredLitters':
            return <FeaturedLittersBlock key={block._key || index} block={block as FeaturedLittersBlockType} />

          case 'latestNews':
            return <LatestNewsRenderer key={block._key || index} block={block as LatestNewsBlock} />

          case 'contactForm':
            return <ContactFormBlock key={block._key || index} block={block as ContactFormBlockType} />

          case 'callToAction':
            return <CallToActionRenderer key={block._key || index} block={block as CallToActionBlock} />

          default:
            return null
        }
      })}
    </div>
  )
}

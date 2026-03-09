import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/image'
import type { PortableTextBlock } from '@/types'

interface PortableTextRendererProps {
  value: PortableTextBlock[] | undefined
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-heading text-2xl md:text-3xl font-semibold text-gray-900 mt-8 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-heading text-xl md:text-2xl font-semibold text-gray-900 mt-6 mb-3">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-heading text-lg font-semibold text-gray-900 mt-5 mb-2">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-gray-700 leading-relaxed mb-4">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary-400 pl-4 my-6 text-gray-600 italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic">{children}</em>
    ),
    underline: ({ children }) => (
      <span className="underline">{children}</span>
    ),
    link: ({ value, children }) => {
      const href = value?.href || '#'
      const isExternal = href.startsWith('http') || value?.blank
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-primary-600 hover:text-primary-700 hover:underline transition-colors"
        >
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-8">
          <div className="relative w-full rounded-xl overflow-hidden">
            <Image
              src={urlForImage(value).width(900).url()}
              alt={value.altText || value.caption || ''}
              width={900}
              height={600}
              className="w-full h-auto rounded-xl"
              sizes="(max-width: 768px) 100vw, 900px"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-1 mb-4 text-gray-700 ml-4">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-700 ml-4">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
}

export default function PortableTextRenderer({ value }: PortableTextRendererProps) {
  if (!value || value.length === 0) return null

  return <PortableText value={value} components={components} />
}

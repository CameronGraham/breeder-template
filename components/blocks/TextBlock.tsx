import PortableTextRenderer from '@/components/ui/PortableTextRenderer'
import type { RichTextBlock } from '@/types'

interface TextBlockProps {
  block: RichTextBlock
}

export default function TextBlock({ block }: TextBlockProps) {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className={`max-w-4xl ${block.alignment === 'center' ? 'mx-auto text-center' : 'mx-auto'}`}>
        {block.heading && (
          <h2 className={`font-heading text-3xl md:text-4xl font-semibold text-gray-900 mb-6 ${block.alignment === 'center' ? 'text-center' : ''}`}>
            {block.heading}
          </h2>
        )}
        {block.body && block.body.length > 0 && (
          <div className={`prose-breeder ${block.alignment === 'center' ? '[&_p]:text-center' : ''}`}>
            <PortableTextRenderer value={block.body} />
          </div>
        )}
      </div>
    </section>
  )
}

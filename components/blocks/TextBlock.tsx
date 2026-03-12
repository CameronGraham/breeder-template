import PortableTextRenderer from '@/components/ui/PortableTextRenderer'
import type { RichTextBlock } from '@/types'

interface TextBlockProps {
  block: RichTextBlock
}

export default function TextBlock({ block }: TextBlockProps) {
  const isCentered = block.alignment === 'center'

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className={`max-w-4xl ${isCentered ? 'mx-auto text-center' : 'mx-auto'}`}>
        {block.heading && (
          <>
            <div className={`h-px w-10 bg-[#c4a05a] mb-6 ${isCentered ? 'mx-auto' : ''}`} />
            <h2 className={`font-heading font-normal text-4xl md:text-5xl tracking-wide text-[#1a1714] mb-8 leading-tight ${isCentered ? 'text-center' : ''}`}>
              {block.heading}
            </h2>
          </>
        )}
        {block.body && block.body.length > 0 && (
          <div className={`prose-breeder ${isCentered ? '[&_p]:text-center' : ''}`}>
            <PortableTextRenderer value={block.body} />
          </div>
        )}
      </div>
    </section>
  )
}

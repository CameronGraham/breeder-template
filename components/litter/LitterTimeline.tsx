import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/image'
import PortableTextRenderer from '@/components/ui/PortableTextRenderer'
import type { LitterUpdate } from '@/types'

interface LitterTimelineProps {
  updates: LitterUpdate[]
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function LitterTimeline({ updates }: LitterTimelineProps) {
  if (!updates || updates.length === 0) return null

  // Already sorted in reverse-chronological order by GROQ query
  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary-100" aria-hidden="true" />

      <div className="space-y-10">
        {updates.map((update, index) => (
          <div key={update._key || index} className="relative pl-12">
            {/* Timeline dot */}
            <div
              className="absolute left-0 w-8 h-8 rounded-full bg-primary-600 border-4 border-white shadow-md flex items-center justify-center"
              aria-hidden="true"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              {/* Date */}
              <time
                className="text-xs uppercase tracking-widest font-semibold text-primary-600 block mb-2"
                dateTime={update.date}
              >
                {formatDate(update.date)}
              </time>

              {/* Title */}
              <h3 className="font-heading text-xl font-semibold text-gray-900 mb-4">
                {update.title}
              </h3>

              {/* Content */}
              {update.content && update.content.length > 0 && (
                <div className="prose-breeder mb-4">
                  <PortableTextRenderer value={update.content} />
                </div>
              )}

              {/* Photos */}
              {update.photos && update.photos.length > 0 && (
                <div className={`grid gap-3 mt-4 ${
                  update.photos.length === 1
                    ? 'grid-cols-1'
                    : update.photos.length === 2
                    ? 'grid-cols-2'
                    : 'grid-cols-2 sm:grid-cols-3'
                }`}>
                  {update.photos.map((photo, photoIndex) => (
                    <div
                      key={photo._key || photoIndex}
                      className="relative aspect-square rounded-xl overflow-hidden bg-gray-100"
                    >
                      <Image
                        src={urlForImage(photo.image).width(400).height(400).url()}
                        alt={photo.altText || photo.caption || `${update.title} photo ${photoIndex + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                      {photo.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <p className="text-white text-xs">{photo.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

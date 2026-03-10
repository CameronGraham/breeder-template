import Link from 'next/link'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/image'
import StatusBadge from './StatusBadge'
import type { LitterSummary } from '@/types'

interface LitterCardProps {
  litter: LitterSummary
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })
}

export default function LitterCard({ litter }: LitterCardProps) {
  const sireName = litter.sire?.name || litter.sireName
  const damName = litter.dam?.name || litter.damName
  const sirePhoto = litter.sire?.mainPhoto || litter.sirePhoto
  const damPhoto = litter.dam?.mainPhoto || litter.damPhoto
  const dateDisplay = litter.actualDate
    ? `Born ${formatDate(litter.actualDate)}`
    : litter.expectedDate
    ? `Expected ${formatDate(litter.expectedDate)}`
    : null

  return (
    <Link
      href={`/litters/${litter.slug.current}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      {/* Sire & Dam photos */}
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {(sirePhoto || damPhoto) ? (
          <div className="absolute inset-0 flex">
            {sirePhoto && (
              <div className={`relative overflow-hidden ${damPhoto ? 'w-1/2' : 'w-full'}`}>
                <Image
                  src={urlForImage(sirePhoto).width(300).height(220).url()}
                  alt={sireName || 'Sire'}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent py-1.5 px-2">
                  <span className="text-white text-xs font-semibold">{sireName}</span>
                </div>
              </div>
            )}
            {damPhoto && (
              <div className={`relative overflow-hidden ${sirePhoto ? 'w-1/2 border-l border-white/20' : 'w-full'}`}>
                <Image
                  src={urlForImage(damPhoto).width(300).height(220).url()}
                  alt={damName || 'Dam'}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent py-1.5 px-2">
                  <span className="text-white text-xs font-semibold">{damName}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-primary-50">
            {/* Placeholder with parent names */}
            <div className="text-center px-4">
              <div className="text-3xl mb-2">🐾</div>
              {sireName && damName && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{sireName}</span>
                  <span className="mx-1 text-gray-400">×</span>
                  <span className="font-medium">{damName}</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <StatusBadge status={litter.status} size="sm" />
          {dateDisplay && (
            <span className="text-xs text-gray-500">{dateDisplay}</span>
          )}
        </div>

        <h3 className="font-heading text-base font-semibold text-gray-900 group-hover:text-primary-700 transition-colors mt-1 leading-tight">
          {litter.title}
        </h3>

        {sireName && damName && (
          <p className="text-sm text-gray-500 mt-1">
            {sireName} <span className="text-gray-400">×</span> {damName}
          </p>
        )}

        <div className="mt-auto pt-3 flex items-center text-primary-600 text-sm font-medium group-hover:text-primary-700">
          <span>View Details</span>
          <svg className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

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
  const sirePhoto = litter.sirePhoto || litter.sire?.mainPhoto
  const damPhoto = litter.damPhoto || litter.dam?.mainPhoto
  const dateDisplay = litter.actualDate
    ? `Born ${formatDate(litter.actualDate)}`
    : litter.expectedDate
    ? `Expected ${formatDate(litter.expectedDate)}`
    : null

  return (
    <Link
      href={`/litters/${litter.slug.current}`}
      className="group bg-white border border-[#e8dfd2] hover:border-[#c4a05a] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col"
    >
      {/* Sire & Dam photos */}
      <div className="relative h-44 bg-[#f5f0e8] overflow-hidden">
        {(sirePhoto || damPhoto) ? (
          <div className="absolute inset-0 flex">
            {sirePhoto && (
              <div className={`relative overflow-hidden ${damPhoto ? 'w-1/2' : 'w-full'}`}>
                <Image
                  src={urlForImage(sirePhoto).width(300).height(220).url()}
                  alt={sireName || 'Sire'}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-2 px-2.5">
                  <span className="text-white/90 text-xs font-body">{sireName}</span>
                </div>
              </div>
            )}
            {damPhoto && (
              <div className={`relative overflow-hidden ${sirePhoto ? 'w-1/2 border-l border-white/20' : 'w-full'}`}>
                <Image
                  src={urlForImage(damPhoto).width(300).height(220).url()}
                  alt={damName || 'Dam'}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-2 px-2.5">
                  <span className="text-white/90 text-xs font-body">{damName}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              {sireName && damName && (
                <p className="font-heading text-lg text-[#7a6c5c]">
                  <span>{sireName}</span>
                  <span className="mx-2 text-[#c4a05a]">×</span>
                  <span>{damName}</span>
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
            <span className="text-xs font-body text-[#9e8e7e]">{dateDisplay}</span>
          )}
        </div>

        <h3 className="font-heading text-lg font-normal text-[#1a1714] group-hover:text-primary-700 transition-colors mt-1 leading-tight">
          {litter.title}
        </h3>

        {sireName && damName && (
          <p className="font-body text-sm text-[#9e8e7e] mt-1">
            {sireName} <span className="text-[#c4a05a]">×</span> {damName}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-[#f0ece4] flex items-center justify-between">
          <span className="font-body text-xs text-[#9e8e7e] uppercase tracking-wider group-hover:text-primary-600 transition-colors">
            View Details
          </span>
          <svg className="w-4 h-4 text-[#c4a05a] transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

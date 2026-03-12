import Link from 'next/link'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/image'
import type { DogSummary } from '@/types'

interface DogCardProps {
  dog: DogSummary
}

const statusConfig = {
  active: { label: 'Active', classes: 'text-emerald-700 border-emerald-300 bg-emerald-50' },
  retired: { label: 'Retired', classes: 'text-[#7a6c5c] border-[#c8bfb0] bg-[#f5f0e8]' },
  deceased: { label: 'Deceased', classes: 'text-[#6b5c4c] border-[#c8bfb0] bg-[#f0ece4]' },
}

export default function DogCard({ dog }: DogCardProps) {
  const sexLabel = dog.sex === 'bitch' ? 'Bitch' : dog.sex === 'dog' ? 'Dog' : null
  const status = dog.status && dog.status !== 'none' ? statusConfig[dog.status as keyof typeof statusConfig] : null

  return (
    <Link
      href={`/dogs/${dog.slug.current}`}
      className="group bg-white border border-[#e8dfd2] hover:border-[#c4a05a] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col"
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f0e8]">
        {dog.mainPhoto ? (
          <Image
            src={urlForImage(dog.mainPhoto).width(480).height(360).url()}
            alt={dog.name}
            fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-[#c8bfb0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Eyebrow: sex + breed */}
        {(sexLabel || dog.breed) && (
          <p className="text-xs font-body font-medium uppercase tracking-[0.15em] text-[#9e8e7e] mb-1.5">
            {[sexLabel, dog.breed].filter(Boolean).join(' · ')}
          </p>
        )}

        <h3 className="font-heading text-xl font-normal text-[#1a1714] group-hover:text-primary-700 transition-colors leading-tight mb-2">
          {dog.name}
        </h3>

        {status && (
          <span className={`self-start text-xs font-body font-medium px-2 py-0.5 border rounded ${status.classes} mb-3`}>
            {status.label}
          </span>
        )}

        <div className="mt-auto pt-2 border-t border-[#f0ece4] flex items-center justify-between">
          <span className="font-body text-xs text-[#9e8e7e] uppercase tracking-wider group-hover:text-primary-600 transition-colors">
            View Profile
          </span>
          <svg className="w-4 h-4 text-[#c4a05a] transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

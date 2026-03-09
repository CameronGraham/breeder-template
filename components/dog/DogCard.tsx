import Link from 'next/link'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/image'
import type { DogSummary } from '@/types'

interface DogCardProps {
  dog: DogSummary
}

const statusBadge = {
  active: { label: 'Active', classes: 'bg-green-100 text-green-700' },
  retired: { label: 'Retired', classes: 'bg-gray-100 text-gray-600' },
  deceased: { label: 'Deceased', classes: 'bg-stone-100 text-stone-600' },
}

export default function DogCard({ dog }: DogCardProps) {
  const sexLabel = dog.sex === 'bitch' ? 'Bitch' : dog.sex === 'dog' ? 'Dog' : null
  const sexClasses = dog.sex === 'bitch'
    ? 'bg-pink-50 text-pink-700'
    : dog.sex === 'dog'
    ? 'bg-blue-50 text-blue-700'
    : 'bg-gray-100 text-gray-600'

  const status = dog.status && statusBadge[dog.status]

  return (
    <Link
      href={`/dogs/${dog.slug.current}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {dog.mainPhoto ? (
          <Image
            src={urlForImage(dog.mainPhoto).width(400).height(300).url()}
            alt={dog.name}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-heading text-lg font-semibold text-gray-900 group-hover:text-primary-700 transition-colors leading-tight">
            {dog.name}
          </h3>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {sexLabel && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sexClasses}`}>
                {sexLabel}
              </span>
            )}
            {status && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.classes}`}>
                {status.label}
              </span>
            )}
          </div>
        </div>

        {dog.breed && (
          <p className="text-sm text-gray-500 mt-auto">{dog.breed}</p>
        )}

        <div className="mt-3 flex items-center text-primary-600 text-sm font-medium group-hover:text-primary-700">
          <span>View Profile</span>
          <svg className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

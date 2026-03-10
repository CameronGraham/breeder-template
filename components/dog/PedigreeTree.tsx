import Link from 'next/link'
import type { PedigreeTree as PedigreeTreeType, PedigreeEntry } from '@/types'

interface PedigreeTreeProps {
  pedigree: PedigreeTreeType
  title?: string
}

interface PedigreeNodeProps {
  entry?: PedigreeEntry
  generation: 'parent' | 'grandparent' | 'great-grandparent'
  label?: string
}

function PedigreeNode({ entry, generation, label }: PedigreeNodeProps) {
  const sizeClass = {
    parent: 'min-h-[80px] p-3',
    grandparent: 'min-h-[64px] p-2.5',
    'great-grandparent': 'min-h-[52px] p-2',
  }[generation]

  const textSize = {
    parent: 'text-sm',
    grandparent: 'text-xs',
    'great-grandparent': 'text-xs',
  }[generation]

  if (!entry) {
    return (
      <div
        className={`${sizeClass} bg-gray-50 border border-dashed border-gray-200 rounded-lg flex flex-col justify-center`}
        aria-label={label || 'Unknown'}
      >
        {label && (
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">{label}</span>
        )}
        <span className="text-gray-400 italic text-xs">Unknown</span>
      </div>
    )
  }

  const nameContent = (
    <>
      <span className={`font-semibold text-gray-900 ${textSize} leading-tight block`}>{entry.name}</span>
      {entry.colour && (
        <span className="text-[10px] text-gray-400 block mt-0.5">{entry.colour}</span>
      )}
      {entry.breeder && (
        <span className="text-[10px] text-gray-400 block">Breeder: {entry.breeder}</span>
      )}
      {entry.owner && (
        <span className="text-[10px] text-gray-400 block">Owner: {entry.owner}</span>
      )}
    </>
  )

  const baseClasses = `${sizeClass} bg-white border border-gray-200 rounded-lg flex flex-col justify-center hover:border-primary-300 hover:shadow-sm transition-all`

  if (entry.linkType === 'internal' && entry.internalDog?.slug?.current) {
    return (
      <Link
        href={`/dogs/${entry.internalDog.slug.current}`}
        className={`${baseClasses} cursor-pointer group`}
        title={entry.name}
      >
        {label && (
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">{label}</span>
        )}
        {nameContent}
        <span className="text-[10px] text-primary-500 group-hover:text-primary-600 mt-0.5 block">View Profile →</span>
      </Link>
    )
  }

  if (entry.linkType === 'external' && entry.externalUrl) {
    return (
      <a
        href={entry.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} cursor-pointer group`}
        title={entry.name}
      >
        {label && (
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">{label}</span>
        )}
        {nameContent}
        <span className="text-[10px] text-primary-500 group-hover:text-primary-600 mt-0.5 block">External ↗</span>
      </a>
    )
  }

  return (
    <div className={`${baseClasses}`} title={entry.name}>
      {label && (
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">{label}</span>
      )}
      {nameContent}
    </div>
  )
}

// Mobile list view for a single ancestor line
function MobileAncestorRow({ label, entry }: { label: string; entry?: PedigreeEntry }) {
  if (!entry) return null

  return (
    <div className="flex items-start gap-2 py-1.5">
      <span className="text-xs text-gray-400 w-28 flex-shrink-0 pt-0.5">{label}</span>
      <div>
        {entry.linkType === 'internal' && entry.internalDog?.slug?.current ? (
          <Link href={`/dogs/${entry.internalDog.slug.current}`} className="text-primary-600 hover:underline text-sm font-medium">
            {entry.name}
          </Link>
        ) : entry.linkType === 'external' && entry.externalUrl ? (
          <a href={entry.externalUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline text-sm font-medium">
            {entry.name} ↗
          </a>
        ) : (
          <span className="font-medium text-gray-900 text-sm">{entry.name}</span>
        )}
        {entry.colour && <p className="text-xs text-gray-400">{entry.colour}</p>}
        {entry.breeder && <p className="text-xs text-gray-400">Breeder: {entry.breeder}</p>}
        {entry.owner && <p className="text-xs text-gray-400">Owner: {entry.owner}</p>}
      </div>
    </div>
  )
}

export default function PedigreeTree({ pedigree, title }: PedigreeTreeProps) {
  const hasSireSide = pedigree.sire || pedigree.sireSire || pedigree.sireDam ||
    pedigree.sireSireSire || pedigree.sireSireDam || pedigree.sireDamSire || pedigree.sireDamDam
  const hasDamSide = pedigree.dam || pedigree.damSire || pedigree.damDam ||
    pedigree.damSireSire || pedigree.damSireDam || pedigree.damDamSire || pedigree.damDamDam

  if (!hasSireSide && !hasDamSide) {
    return null
  }

  return (
    <div>
      {title && (
        <h2 className="font-heading text-2xl font-semibold text-gray-800 mb-6">{title}</h2>
      )}

      {/* Desktop horizontal pedigree chart */}
      <div className="hidden md:block overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Generation labels */}
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 mb-1 px-2">
            <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold text-center">Parents</div>
            <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold text-center">Grandparents</div>
            <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold text-center">Great-grandparents</div>
          </div>

          {/* Pedigree grid
              Layout: 4 rows × 3 columns
              Col 1: parents (sire top half, dam bottom half, each spanning 4 rows)
              Col 2: grandparents (one per 2 rows)
              Col 3: great-grandparents (one per row)
          */}
          <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-2">
            {/* Column 1 — Parents */}
            <div className="grid grid-rows-2 gap-y-2 h-full">
              {/* Sire — upper half */}
              <div className="flex items-center">
                <PedigreeNode entry={pedigree.sire} generation="parent" label="Sire" />
              </div>
              {/* Dam — lower half */}
              <div className="flex items-center">
                <PedigreeNode entry={pedigree.dam} generation="parent" label="Dam" />
              </div>
            </div>

            {/* Column 2 — Grandparents */}
            <div className="grid grid-rows-4 gap-y-2">
              <div className="flex items-center">
                <PedigreeNode entry={pedigree.sireSire} generation="grandparent" label="Sire's Sire" />
              </div>
              <div className="flex items-center">
                <PedigreeNode entry={pedigree.sireDam} generation="grandparent" label="Sire's Dam" />
              </div>
              <div className="flex items-center">
                <PedigreeNode entry={pedigree.damSire} generation="grandparent" label="Dam's Sire" />
              </div>
              <div className="flex items-center">
                <PedigreeNode entry={pedigree.damDam} generation="grandparent" label="Dam's Dam" />
              </div>
            </div>

            {/* Column 3 — Great-grandparents */}
            <div className="grid grid-rows-8 gap-y-2">
              <div className="flex items-center">
                <PedigreeNode entry={pedigree.sireSireSire} generation="great-grandparent" label="SS Sire" />
              </div>
              <div className="flex items-center">
                <PedigreeNode entry={pedigree.sireSireDam} generation="great-grandparent" label="SS Dam" />
              </div>
              <div className="flex items-center">
                <PedigreeNode entry={pedigree.sireDamSire} generation="great-grandparent" label="SD Sire" />
              </div>
              <div className="flex items-center">
                <PedigreeNode entry={pedigree.sireDamDam} generation="great-grandparent" label="SD Dam" />
              </div>
              <div className="flex items-center">
                <PedigreeNode entry={pedigree.damSireSire} generation="great-grandparent" label="DS Sire" />
              </div>
              <div className="flex items-center">
                <PedigreeNode entry={pedigree.damSireDam} generation="great-grandparent" label="DS Dam" />
              </div>
              <div className="flex items-center">
                <PedigreeNode entry={pedigree.damDamSire} generation="great-grandparent" label="DD Sire" />
              </div>
              <div className="flex items-center">
                <PedigreeNode entry={pedigree.damDamDam} generation="great-grandparent" label="DD Dam" />
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-3 text-right">
            SS = Sire&apos;s Sire · SD = Sire&apos;s Dam · DS = Dam&apos;s Sire · DD = Dam&apos;s Dam
          </p>
        </div>
      </div>

      {/* Mobile list view */}
      <div className="md:hidden space-y-6">
        {hasSireSide && (
          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-900 text-sm uppercase tracking-wider mb-3">Sire Line</h3>
            <div className="divide-y divide-blue-100">
              <MobileAncestorRow label="Sire" entry={pedigree.sire} />
              <MobileAncestorRow label="Sire's Sire" entry={pedigree.sireSire} />
              <MobileAncestorRow label="Sire's Sire's Sire" entry={pedigree.sireSireSire} />
              <MobileAncestorRow label="Sire's Sire's Dam" entry={pedigree.sireSireDam} />
              <MobileAncestorRow label="Sire's Dam" entry={pedigree.sireDam} />
              <MobileAncestorRow label="Sire's Dam's Sire" entry={pedigree.sireDamSire} />
              <MobileAncestorRow label="Sire's Dam's Dam" entry={pedigree.sireDamDam} />
            </div>
          </div>
        )}

        {hasDamSide && (
          <div className="bg-pink-50/50 rounded-xl p-4 border border-pink-100">
            <h3 className="font-semibold text-pink-900 text-sm uppercase tracking-wider mb-3">Dam Line</h3>
            <div className="divide-y divide-pink-100">
              <MobileAncestorRow label="Dam" entry={pedigree.dam} />
              <MobileAncestorRow label="Dam's Sire" entry={pedigree.damSire} />
              <MobileAncestorRow label="Dam's Sire's Sire" entry={pedigree.damSireSire} />
              <MobileAncestorRow label="Dam's Sire's Dam" entry={pedigree.damSireDam} />
              <MobileAncestorRow label="Dam's Dam" entry={pedigree.damDam} />
              <MobileAncestorRow label="Dam's Dam's Sire" entry={pedigree.damDamSire} />
              <MobileAncestorRow label="Dam's Dam's Dam" entry={pedigree.damDamDam} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

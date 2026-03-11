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
        className={`w-full ${sizeClass} bg-gray-50 border border-dashed border-gray-200 rounded-lg flex flex-col justify-center`}
        aria-label={label || 'Unknown'}
      >
        {label && (
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">{label}</span>
        )}
        <span className="text-gray-400 italic text-xs">Unknown</span>
      </div>
    )
  }

  const displayName = entry.name || entry.internalDog?.name || ''

  const nameContent = (
    <>
      <span className={`font-semibold text-gray-900 ${textSize} leading-tight block`}>{displayName}</span>
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

  const baseClasses = `w-full ${sizeClass} bg-white border border-gray-200 rounded-lg flex flex-col justify-center hover:border-primary-300 hover:shadow-sm transition-all`

  if (entry.linkType === 'internal' && entry.internalDog?.slug?.current) {
    return (
      <Link
        href={`/dogs/${entry.internalDog.slug.current}`}
        className={`${baseClasses} cursor-pointer group`}
        title={displayName}
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
        title={displayName}
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
    <div className={baseClasses} title={displayName}>
      {label && (
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">{label}</span>
      )}
      {nameContent}
    </div>
  )
}

/**
 * SVG bracket connector.
 * The connector column spans N rows. Within that span:
 *   - The parent (left) is vertically centred → y = 50%
 *   - The upper child is centred in the top half → y = 25%
 *   - The lower child is centred in the bottom half → y = 75%
 *
 * Draws: a horizontal arm from the left (parent side), a vertical spine,
 * and two horizontal arms going right to the children.
 */
function Bracket() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Horizontal arm from parent (left edge) to spine */}
      <line x1="0" y1="50" x2="50" y2="50" stroke="#d1d5db" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      {/* Vertical spine connecting the two child branches */}
      <line x1="50" y1="25" x2="50" y2="75" stroke="#d1d5db" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      {/* Arm to upper child */}
      <line x1="50" y1="25" x2="100" y2="25" stroke="#d1d5db" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      {/* Arm to lower child */}
      <line x1="50" y1="75" x2="100" y2="75" stroke="#d1d5db" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

// Mobile list view for a single ancestor line
function MobileAncestorRow({ label, entry }: { label: string; entry?: PedigreeEntry }) {
  if (!entry) return null
  const displayName = entry.name || entry.internalDog?.name || ''

  return (
    <div className="flex items-start gap-2 py-1.5">
      <span className="text-xs text-gray-400 w-28 flex-shrink-0 pt-0.5">{label}</span>
      <div>
        {entry.linkType === 'internal' && entry.internalDog?.slug?.current ? (
          <Link href={`/dogs/${entry.internalDog.slug.current}`} className="text-primary-600 hover:underline text-sm font-medium">
            {displayName}
          </Link>
        ) : entry.linkType === 'external' && entry.externalUrl ? (
          <a href={entry.externalUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline text-sm font-medium">
            {displayName} ↗
          </a>
        ) : (
          <span className="font-medium text-gray-900 text-sm">{displayName}</span>
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
          <div
            className="mb-2 px-1"
            style={{ display: 'grid', gridTemplateColumns: '1.2fr 40px 1fr 40px 1fr' }}
          >
            <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold text-center">Parents</div>
            <div />
            <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold text-center">Grandparents</div>
            <div />
            <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold text-center">Great-grandparents</div>
          </div>

          {/*
            5-column × 8-row grid.
            Fixed height ensures all 8 rows are exactly equal so the SVG
            connector percentages (25 / 50 / 75 %) align with node centres.
              Col 1 — parents        (rows 1-4 = Sire, rows 5-8 = Dam)
              Col 2 — connector A→B  (Sire bracket rows 1-4, Dam bracket rows 5-8)
              Col 3 — grandparents   (2 rows each)
              Col 4 — connector B→C  (2-row bracket per grandparent)
              Col 5 — great-grandparents (1 row each)
          */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 40px 1fr 40px 1fr',
              gridTemplateRows: 'repeat(8, 1fr)',
              height: '560px',
            }}
          >
            {/* ── Col 1: Parents ── */}
            <div style={{ gridColumn: 1, gridRow: '1 / 5' }} className="flex items-center pr-1 py-1">
              <PedigreeNode entry={pedigree.sire} generation="parent" label="Sire" />
            </div>
            <div style={{ gridColumn: 1, gridRow: '5 / 9' }} className="flex items-center pr-1 py-1">
              <PedigreeNode entry={pedigree.dam} generation="parent" label="Dam" />
            </div>

            {/* ── Col 2: Connector A→B ── */}
            <div style={{ gridColumn: 2, gridRow: '1 / 5' }}>
              <Bracket />
            </div>
            <div style={{ gridColumn: 2, gridRow: '5 / 9' }}>
              <Bracket />
            </div>

            {/* ── Col 3: Grandparents ── */}
            <div style={{ gridColumn: 3, gridRow: '1 / 3' }} className="flex items-center px-1 py-1">
              <PedigreeNode entry={pedigree.sireSire} generation="grandparent" label="Sire's Sire" />
            </div>
            <div style={{ gridColumn: 3, gridRow: '3 / 5' }} className="flex items-center px-1 py-1">
              <PedigreeNode entry={pedigree.sireDam} generation="grandparent" label="Sire's Dam" />
            </div>
            <div style={{ gridColumn: 3, gridRow: '5 / 7' }} className="flex items-center px-1 py-1">
              <PedigreeNode entry={pedigree.damSire} generation="grandparent" label="Dam's Sire" />
            </div>
            <div style={{ gridColumn: 3, gridRow: '7 / 9' }} className="flex items-center px-1 py-1">
              <PedigreeNode entry={pedigree.damDam} generation="grandparent" label="Dam's Dam" />
            </div>

            {/* ── Col 4: Connector B→C ── */}
            <div style={{ gridColumn: 4, gridRow: '1 / 3' }}>
              <Bracket />
            </div>
            <div style={{ gridColumn: 4, gridRow: '3 / 5' }}>
              <Bracket />
            </div>
            <div style={{ gridColumn: 4, gridRow: '5 / 7' }}>
              <Bracket />
            </div>
            <div style={{ gridColumn: 4, gridRow: '7 / 9' }}>
              <Bracket />
            </div>

            {/* ── Col 5: Great-grandparents ── */}
            <div style={{ gridColumn: 5, gridRow: 1 }} className="flex items-center pl-1 py-0.5">
              <PedigreeNode entry={pedigree.sireSireSire} generation="great-grandparent" label="SS Sire" />
            </div>
            <div style={{ gridColumn: 5, gridRow: 2 }} className="flex items-center pl-1 py-0.5">
              <PedigreeNode entry={pedigree.sireSireDam} generation="great-grandparent" label="SS Dam" />
            </div>
            <div style={{ gridColumn: 5, gridRow: 3 }} className="flex items-center pl-1 py-0.5">
              <PedigreeNode entry={pedigree.sireDamSire} generation="great-grandparent" label="SD Sire" />
            </div>
            <div style={{ gridColumn: 5, gridRow: 4 }} className="flex items-center pl-1 py-0.5">
              <PedigreeNode entry={pedigree.sireDamDam} generation="great-grandparent" label="SD Dam" />
            </div>
            <div style={{ gridColumn: 5, gridRow: 5 }} className="flex items-center pl-1 py-0.5">
              <PedigreeNode entry={pedigree.damSireSire} generation="great-grandparent" label="DS Sire" />
            </div>
            <div style={{ gridColumn: 5, gridRow: 6 }} className="flex items-center pl-1 py-0.5">
              <PedigreeNode entry={pedigree.damSireDam} generation="great-grandparent" label="DS Dam" />
            </div>
            <div style={{ gridColumn: 5, gridRow: 7 }} className="flex items-center pl-1 py-0.5">
              <PedigreeNode entry={pedigree.damDamSire} generation="great-grandparent" label="DD Sire" />
            </div>
            <div style={{ gridColumn: 5, gridRow: 8 }} className="flex items-center pl-1 py-0.5">
              <PedigreeNode entry={pedigree.damDamDam} generation="great-grandparent" label="DD Dam" />
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

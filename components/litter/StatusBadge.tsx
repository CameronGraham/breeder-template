type LitterStatus = 'none' | 'planned' | 'expecting' | 'born' | 'available' | 'all placed'

interface StatusBadgeProps {
  status: LitterStatus
  size?: 'sm' | 'md'
}

const statusConfig: Record<LitterStatus, { label: string; classes: string; pulse?: boolean }> = {
  none: {
    label: '',
    classes: '',
  },
  planned: {
    label: 'Planned',
    classes: 'text-sky-700 border-sky-200 bg-sky-50',
  },
  expecting: {
    label: 'Expecting',
    classes: 'text-violet-700 border-violet-200 bg-violet-50',
  },
  born: {
    label: 'Born',
    classes: 'text-emerald-700 border-emerald-200 bg-emerald-50',
  },
  available: {
    label: 'Puppies Available',
    classes: 'text-emerald-800 border-emerald-300 bg-emerald-50',
    pulse: true,
  },
  'all placed': {
    label: 'All Placed',
    classes: 'text-[#7a6c5c] border-[#c8bfb0] bg-[#f5f0e8]',
  },
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  if (!status || status === 'none') return null

  const config = statusConfig[status] || {
    label: status,
    classes: 'text-[#7a6c5c] border-[#c8bfb0] bg-[#f5f0e8]',
  }

  const sizeClasses = size === 'sm'
    ? 'text-xs px-2 py-0.5 tracking-wide'
    : 'text-xs px-2.5 py-1 tracking-wide'

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-body font-medium rounded border uppercase ${sizeClasses} ${config.classes}`}
    >
      {config.pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </span>
      )}
      {config.label}
    </span>
  )
}

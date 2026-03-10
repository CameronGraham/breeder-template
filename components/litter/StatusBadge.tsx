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
    classes: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  expecting: {
    label: 'Expecting',
    classes: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  born: {
    label: 'Born',
    classes: 'bg-green-100 text-green-800 border-green-200',
  },
  available: {
    label: 'Puppies Available',
    classes: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    pulse: true,
  },
  'all placed': {
    label: 'All Placed',
    classes: 'bg-gray-100 text-gray-600 border-gray-200',
  },
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  if (!status || status === 'none') return null

  const config = statusConfig[status] || {
    label: status,
    classes: 'bg-gray-100 text-gray-600 border-gray-200',
  }

  const sizeClasses = size === 'sm'
    ? 'text-xs px-2 py-0.5'
    : 'text-sm px-3 py-1'

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${sizeClasses} ${config.classes}`}
    >
      {config.pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      )}
      {config.label}
    </span>
  )
}

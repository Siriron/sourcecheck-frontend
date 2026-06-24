interface VerdictBadgeProps {
  verdict: string
  size?: 'sm' | 'md' | 'lg'
}

const ICONS: Record<string, string> = {
  SUPPORTED: '✓',
  DISPUTED: '✕',
  UNVERIFIABLE: '?',
  PENDING: '◌',
}

const LABELS: Record<string, string> = {
  SUPPORTED: 'Supported',
  DISPUTED: 'Disputed',
  UNVERIFIABLE: 'Unverifiable',
  PENDING: 'Pending',
}

export default function VerdictBadge({ verdict, size = 'md' }: VerdictBadgeProps) {
  const v = verdict?.toUpperCase() || 'PENDING'
  const key = ['SUPPORTED','DISPUTED','UNVERIFIABLE'].includes(v) ? v : 'PENDING'

  const sizeClass = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2',
  }[size]

  return (
    <span className={`inline-flex items-center font-semibold rounded-full border verdict-${key.toLowerCase()} ${sizeClass}`}>
      <span className="font-bold">{ICONS[key]}</span>
      {LABELS[key]}
    </span>
  )
}

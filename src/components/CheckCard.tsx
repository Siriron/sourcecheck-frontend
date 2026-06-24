import { motion } from 'framer-motion'
import VerdictBadge from './VerdictBadge'
import type { CheckEntry } from '../hooks/useContract'

interface CheckCardProps {
  entry: CheckEntry
  index: number
}

export default function CheckCard({ entry, index }: CheckCardProps) {
  const shortUrl = (() => {
    try {
      return new URL(entry.url).hostname
    } catch {
      return entry.url.slice(0, 40)
    }
  })()

  const shortAddr = entry.submitter
    ? `${entry.submitter.slice(0, 6)}...${entry.submitter.slice(-4)}`
    : '—'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="card-glass rounded-3xl p-5 hover:shadow-soft transition-shadow duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-purple-400">#{entry.check_id}</span>
            <span className="text-xs text-purple-300">·</span>
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-500 hover:text-purple-700 truncate font-mono underline underline-offset-2"
            >
              {shortUrl}
            </a>
          </div>
          <p className="text-sm font-semibold text-purple-900 leading-snug line-clamp-2">
            {entry.claim}
          </p>
        </div>
        <VerdictBadge verdict={entry.verdict} size="sm" />
      </div>

      {/* Summary */}
      {entry.summary && (
        <p className="text-xs text-purple-600/70 leading-relaxed mb-3 line-clamp-2">
          {entry.summary}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-purple-400 pt-2 border-t border-purple-100">
        <span className="font-mono">{shortAddr}</span>
        <span>{entry.created_at ? entry.created_at.slice(0, 16) : '—'}</span>
      </div>
    </motion.div>
  )
}

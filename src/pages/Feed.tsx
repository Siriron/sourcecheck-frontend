import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useContract } from '../hooks/useContract'
import type { NetworkKey } from '../config/chains'
import type { CheckEntry } from '../hooks/useContract'
import CheckCard from '../components/CheckCard'
import VerdictBadge from '../components/VerdictBadge'

interface FeedProps { network: NetworkKey }

const FILTERS = ['ALL', 'SUPPORTED', 'DISPUTED', 'UNVERIFIABLE'] as const
type Filter = typeof FILTERS[number]

export default function Feed({ network }: FeedProps) {
  const { getAllChecks } = useContract(network)
  const [checks, setChecks] = useState<CheckEntry[]>([])
  const [fetching, setFetching] = useState(true)
  const [filter, setFilter] = useState<Filter>('ALL')
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setFetching(true)
    try {
      const data = await getAllChecks(100)
      setChecks([...data].reverse())
    } catch {
      setChecks([])
    } finally {
      setFetching(false)
    }
  }, [network])

  useEffect(() => { load() }, [load])

  const filtered = checks.filter(c => {
    const matchFilter = filter === 'ALL' || c.verdict?.toUpperCase() === filter
    const q = search.toLowerCase()
    const matchSearch = !q || c.claim.toLowerCase().includes(q) || c.url.toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  const counts = {
    ALL: checks.length,
    SUPPORTED: checks.filter(c => c.verdict === 'SUPPORTED').length,
    DISPUTED: checks.filter(c => c.verdict === 'DISPUTED').length,
    UNVERIFIABLE: checks.filter(c => c.verdict === 'UNVERIFIABLE').length,
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display text-4xl font-extrabold text-purple-950 mb-2">
                Public Feed
              </h1>
              <p className="text-purple-600/70 text-sm">
                All onchain verdicts from GenLayer validators.
              </p>
            </div>
            <button
              onClick={load}
              disabled={fetching}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-100 text-purple-700 text-sm font-semibold hover:bg-purple-200 transition-colors disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`card-glass rounded-2xl p-4 text-left transition-all ${filter === f ? 'ring-2 ring-purple-400 shadow-soft' : 'hover:shadow-card'}`}
            >
              <div className="text-2xl font-display font-bold gradient-text">{counts[f]}</div>
              <div className="text-xs text-purple-500 mt-0.5 font-medium">{f === 'ALL' ? 'Total' : f.charAt(0) + f.slice(1).toLowerCase()}</div>
            </button>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search claims or URLs..."
            className="flex-1 px-4 py-2.5 rounded-2xl border border-purple-200 bg-white/80 text-purple-900 text-sm placeholder:text-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
          />
          <div className="flex gap-1.5 overflow-x-auto">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filter === f
                    ? 'shimmer-btn text-white shadow-soft'
                    : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                }`}
              >
                {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {fetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-glass rounded-3xl p-5 animate-pulse">
                <div className="h-4 bg-purple-100 rounded mb-3 w-3/4" />
                <div className="h-3 bg-purple-50 rounded mb-2" />
                <div className="h-3 bg-purple-50 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-display text-xl font-bold text-purple-900 mb-2">
              {checks.length === 0 ? 'No checks yet' : 'No results found'}
            </h3>
            <p className="text-purple-500 text-sm">
              {checks.length === 0
                ? 'Be the first to submit a source check.'
                : 'Try a different filter or search term.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((entry, i) => (
              <CheckCard key={`${entry.check_id}-${network}`} entry={entry} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

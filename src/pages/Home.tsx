import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useContract } from '../hooks/useContract'
import type { NetworkKey } from '../config/chains'
import VerdictBadge from '../components/VerdictBadge'
import type { CheckEntry } from '../hooks/useContract'

interface HomeProps { network: NetworkKey }

const FEATURES = [
  {
    icon: '🔍',
    title: 'Submit Any URL',
    desc: 'Paste a source URL and the claim you want verified. No signup required.',
  },
  {
    icon: '🤖',
    title: 'Validator Consensus',
    desc: 'Multiple GenLayer validators independently fetch the URL and judge the claim.',
  },
  {
    icon: '⛓️',
    title: 'Onchain Verdict',
    desc: 'The result is stored permanently — SUPPORTED, DISPUTED, or UNVERIFIABLE.',
  },
  {
    icon: '🌐',
    title: 'No Central Authority',
    desc: 'No single node decides. Consensus is required. Truth is decentralized.',
  },
]

export default function Home({ network }: HomeProps) {
  const { getAllChecks } = useContract(network)
  const [recent, setRecent] = useState<CheckEntry[]>([])

  useEffect(() => {
    getAllChecks(6).then(data => setRecent(data.slice(-6).reverse())).catch(() => {})
  }, [network])

  return (
    <div>
      {/* Hero */}
      <section className="bg-hero min-h-[80vh] flex flex-col items-center justify-center text-center px-6 py-24 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-16 left-10 w-64 h-64 rounded-full bg-purple-300/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-16 right-10 w-80 h-80 rounded-full bg-pink-300/20 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          {/* Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-purple-200 text-sm text-purple-600 font-medium mb-8 shadow-soft">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse-soft" />
            Powered by GenLayer Intelligent Contracts
          </div>

          <h1 className="font-display text-5xl sm:text-6xl font-extrabold leading-tight mb-6 text-purple-950">
            Is your source
            <span className="block gradient-text">actually true?</span>
          </h1>

          <p className="text-lg text-purple-700/80 leading-relaxed mb-10 max-w-xl mx-auto">
            Submit any URL and claim. GenLayer validators independently fetch the source and reach
            decentralized consensus — SUPPORTED, DISPUTED, or UNVERIFIABLE.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/submit"
              className="shimmer-btn text-white font-semibold px-8 py-3.5 rounded-2xl shadow-glow hover:opacity-90 transition-opacity text-sm"
            >
              Submit a Check →
            </Link>
            <Link
              to="/feed"
              className="bg-white/80 text-purple-700 font-semibold px-8 py-3.5 rounded-2xl border border-purple-200 hover:bg-white transition-colors text-sm"
            >
              View Public Feed
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl font-bold text-purple-950 mb-3">How it works</h2>
          <p className="text-purple-600/70 text-sm max-w-md mx-auto">
            No APIs. No middlemen. Pure onchain verification.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card-glass rounded-3xl p-6 text-center hover:shadow-soft transition-shadow"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-display font-bold text-purple-900 mb-2 text-sm">{f.title}</h3>
              <p className="text-xs text-purple-600/70 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent checks */}
      {recent.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-purple-950">Recent Verdicts</h2>
            <Link to="/feed" className="text-sm text-purple-500 hover:text-purple-700 font-medium transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map((entry, i) => (
              <motion.div
                key={entry.check_id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
                className="card-glass rounded-3xl p-5 hover:shadow-soft transition-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-purple-900 line-clamp-2 flex-1">{entry.claim}</p>
                  <VerdictBadge verdict={entry.verdict} size="sm" />
                </div>
                {entry.summary && (
                  <p className="text-xs text-purple-500/80 line-clamp-2">{entry.summary}</p>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-br from-purple-600 to-pink-500 py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto"
        >
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Start verifying sources today
          </h2>
          <p className="text-purple-100 text-sm mb-8 leading-relaxed">
            No account needed. Connect your wallet and submit. Validators do the rest.
          </p>
          <Link
            to="/submit"
            className="inline-block bg-white text-purple-700 font-bold px-8 py-3.5 rounded-2xl hover:bg-purple-50 transition-colors shadow-soft text-sm"
          >
            Submit Your First Check
          </Link>
        </motion.div>
      </section>
    </div>
  )
}

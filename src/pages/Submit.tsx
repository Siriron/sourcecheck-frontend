import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useContract } from '../hooks/useContract'
import type { NetworkKey } from '../config/chains'
import { NETWORKS } from '../config/chains'
import VerdictBadge from '../components/VerdictBadge'

interface SubmitProps { network: NetworkKey }

type Stage = 'form' | 'pending' | 'done' | 'error'

export default function Submit({ network }: SubmitProps) {
  const { submitCheck, loading, error, setError } = useContract(network)
  const [url, setUrl] = useState('')
  const [claim, setClaim] = useState('')
  const [stage, setStage] = useState<Stage>('form')
  const [statusMsg, setStatusMsg] = useState('')
  const [lastVerdictUrl, setLastVerdictUrl] = useState('')

  const net = NETWORKS[network]

  const handleSubmit = async () => {
    if (!url.trim() || !claim.trim()) return
    setStage('pending')
    setStatusMsg('Submitting transaction...')
    try {
      await submitCheck(url, claim, (msg) => setStatusMsg(msg))
      setLastVerdictUrl(url)
      setStage('done')
    } catch (e: any) {
      setStage('error')
    }
  }

  const reset = () => {
    setUrl('')
    setClaim('')
    setStage('form')
    setStatusMsg('')
    setError(null)
  }

  return (
    <div className="min-h-screen bg-hero px-6 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-xs font-semibold text-purple-600 mb-4">
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse-soft" />
            {net.name}
          </div>
          <h1 className="font-display text-4xl font-extrabold text-purple-950 mb-3">
            Submit a <span className="gradient-text">Source Check</span>
          </h1>
          <p className="text-purple-600/70 text-sm leading-relaxed">
            GenLayer validators will independently fetch the URL and reach consensus on your claim.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* FORM */}
          {stage === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="card-glass rounded-4xl p-8 shadow-soft"
            >
              <div className="mb-6">
                <label className="block text-xs font-semibold text-purple-700 uppercase tracking-widest mb-2">
                  Source URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  className="w-full px-4 py-3 rounded-2xl border border-purple-200 bg-white/80 text-purple-900 text-sm placeholder:text-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all font-mono"
                />
              </div>

              <div className="mb-8">
                <label className="block text-xs font-semibold text-purple-700 uppercase tracking-widest mb-2">
                  Claim to Verify
                </label>
                <textarea
                  value={claim}
                  onChange={e => setClaim(e.target.value)}
                  placeholder="The article states that Bitcoin reached $100,000 in 2024."
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border border-purple-200 bg-white/80 text-purple-900 text-sm placeholder:text-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all resize-none"
                />
                <p className="text-xs text-purple-400 mt-2">
                  Be specific. Validators judge only what the page content says.
                </p>
              </div>

              {/* Info box */}
              <div className="bg-purple-50 rounded-2xl p-4 mb-6 border border-purple-100">
                <p className="text-xs text-purple-600 leading-relaxed">
                  <strong>What happens next:</strong> Your claim is sent to the SourceChecker contract on {net.name}.
                  Multiple validators independently fetch the URL, read the content, and vote on a verdict.
                  Consensus is required — no single node decides.
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!url.trim() || !claim.trim()}
                className="w-full shimmer-btn text-white font-bold py-3.5 rounded-2xl shadow-glow hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed text-sm"
              >
                Submit for Verification →
              </button>
            </motion.div>
          )}

          {/* PENDING */}
          {stage === 'pending' && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="card-glass rounded-4xl p-12 text-center shadow-soft"
            >
              <div className="w-16 h-16 rounded-full shimmer-btn flex items-center justify-center mx-auto mb-6 animate-pulse">
                <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              </div>
              <h2 className="font-display text-2xl font-bold text-purple-900 mb-3">Validators at work</h2>
              <p className="text-purple-600/70 text-sm mb-6 leading-relaxed max-w-sm mx-auto">
                {statusMsg || 'GenLayer validators are independently fetching your URL and judging your claim...'}
              </p>
              <div className="flex justify-center gap-2">
                {['Fetch', 'Analyze', 'Consensus'].map((step, i) => (
                  <div key={step} className="flex flex-col items-center gap-1.5">
                    <div className="w-8 h-8 rounded-full bg-purple-100 border-2 border-purple-300 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse-soft" style={{ animationDelay: `${i * 0.3}s` }} />
                    </div>
                    <span className="text-xs text-purple-400">{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* DONE */}
          {stage === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-glass rounded-4xl p-10 text-center shadow-soft"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 border-2 border-green-300 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="font-display text-2xl font-bold text-purple-900 mb-2">Verdict recorded!</h2>
              <p className="text-purple-600/70 text-sm mb-6">
                Your check has been verified and stored onchain on {net.name}.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  onClick={reset}
                  className="shimmer-btn text-white font-semibold px-6 py-2.5 rounded-2xl text-sm"
                >
                  Submit Another
                </button>
                <a
                  href="/feed"
                  className="bg-purple-50 text-purple-700 font-semibold px-6 py-2.5 rounded-2xl text-sm border border-purple-200 hover:bg-purple-100 transition-colors"
                >
                  View Feed
                </a>
              </div>
            </motion.div>
          )}

          {/* ERROR */}
          {stage === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-glass rounded-4xl p-10 text-center shadow-soft border border-red-100"
            >
              <div className="w-16 h-16 rounded-full bg-red-100 border-2 border-red-200 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24">
                  <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="font-display text-2xl font-bold text-purple-900 mb-2">Something went wrong</h2>
              <p className="text-purple-600/70 text-sm mb-6 max-w-sm mx-auto">
                {error || 'Transaction failed. Make sure your wallet is connected and on the right network.'}
              </p>
              <button
                onClick={reset}
                className="shimmer-btn text-white font-semibold px-6 py-2.5 rounded-2xl text-sm"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

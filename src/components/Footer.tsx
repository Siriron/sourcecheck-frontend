import { Link } from 'react-router-dom'
import { NETWORKS } from '../config/chains'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-purple-100 bg-white/40">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg shimmer-btn flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
                <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2.5"/>
                <path d="M8.5 11l2 2 3.5-3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.5 16.5L20 20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-display font-bold gradient-text">SourceCheck</span>
          </div>
          <p className="text-xs text-purple-500 leading-relaxed">
            Decentralized URL credibility oracle powered by GenLayer intelligent contracts.
          </p>
        </div>

        {/* Links */}
        <div>
          <p className="text-xs font-semibold text-purple-900 uppercase tracking-widest mb-3">Navigate</p>
          <div className="flex flex-col gap-2">
            {[['/', 'Home'], ['/submit', 'Submit Check'], ['/feed', 'Public Feed'], ['/docs', 'Documentation']].map(([to, label]) => (
              <Link key={to} to={to} className="text-xs text-purple-500 hover:text-purple-700 transition-colors">{label}</Link>
            ))}
          </div>
        </div>

        {/* Contracts */}
        <div>
          <p className="text-xs font-semibold text-purple-900 uppercase tracking-widest mb-3">Contracts</p>
          <div className="flex flex-col gap-2">
            {(Object.keys(NETWORKS) as (keyof typeof NETWORKS)[]).map((key) => {
              const net = NETWORKS[key]
              return (
                <a
                  key={key}
                  href={`${net.explorerUrl}/tx/${net.deployTx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-500 hover:text-purple-700 transition-colors font-mono"
                >
                  {net.name}: {net.contractAddress.slice(0, 10)}...
                </a>
              )
            })}
          </div>
        </div>
      </div>
      <div className="border-t border-purple-100 py-4 text-center text-xs text-purple-400">
        Built on GenLayer · Onchain truth, no central authority
      </div>
    </footer>
  )
}

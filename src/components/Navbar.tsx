import { Link, useLocation } from 'react-router-dom'
import { NETWORKS, type NetworkKey } from '../config/chains'

interface NavbarProps {
  network: NetworkKey
  setNetwork: (n: NetworkKey) => void
}

export default function Navbar({ network, setNetwork }: NavbarProps) {
  const location = useLocation()

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/submit', label: 'Submit' },
    { to: '/feed', label: 'Feed' },
    { to: '/docs', label: 'Docs' },
  ]

  return (
    <nav className="sticky top-0 z-50 card-glass border-b border-purple-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl shimmer-btn flex items-center justify-center shadow-soft">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2"/>
              <path d="M8.5 11l2 2 3.5-3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.5 16.5L20 20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-display font-800 text-lg gradient-text">SourceCheck</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === to
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-purple-900/60 hover:text-purple-700 hover:bg-purple-50'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Network Toggle */}
        <div className="flex items-center gap-2 bg-purple-50 rounded-2xl p-1 border border-purple-100">
          {(Object.keys(NETWORKS) as NetworkKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setNetwork(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                network === key
                  ? 'bg-white text-purple-700 shadow-soft'
                  : 'text-purple-400 hover:text-purple-600'
              }`}
            >
              {NETWORKS[key].name}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex gap-1 px-4 pb-2 overflow-x-auto">
        {navLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              location.pathname === to
                ? 'bg-purple-100 text-purple-700'
                : 'text-purple-400 hover:text-purple-600'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

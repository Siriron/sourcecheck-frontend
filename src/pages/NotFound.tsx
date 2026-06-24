import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-hero flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="font-display text-5xl font-extrabold gradient-text mb-3">404</h1>
        <p className="text-purple-700 mb-8 text-sm">This page could not be found — much like an unverifiable source.</p>
        <Link to="/" className="shimmer-btn text-white font-semibold px-8 py-3 rounded-2xl text-sm inline-block">
          Back to Home
        </Link>
      </motion.div>
    </div>
  )
}

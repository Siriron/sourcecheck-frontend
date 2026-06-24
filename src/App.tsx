import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { DEFAULT_NETWORK, type NetworkKey } from './config/chains'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Submit from './pages/Submit'
import Feed from './pages/Feed'
import Docs from './pages/Docs'
import NotFound from './pages/NotFound'

export default function App() {
  const [network, setNetwork] = useState<NetworkKey>(DEFAULT_NETWORK)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar network={network} setNetwork={setNetwork} />
      <main className="flex-1">
        <Routes>
          <Route path="/"       element={<Home   network={network} />} />
          <Route path="/submit" element={<Submit network={network} />} />
          <Route path="/feed"   element={<Feed   network={network} />} />
          <Route path="/docs"   element={<Docs   network={network} />} />
          <Route path="*"       element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

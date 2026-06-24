import { useState } from 'react'
import { DEFAULT_NETWORK, type NetworkKey } from '../config/chains'

export function useNetwork() {
  const [network, setNetwork] = useState<NetworkKey>(DEFAULT_NETWORK)
  return { network, setNetwork }
}

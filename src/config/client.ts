import { createClient, bradbury, studionet } from 'genlayer-js'
import { type NetworkKey } from './chains'

export function getReadClient(network: NetworkKey) {
  const chain = network === 'bradbury' ? bradbury : studionet
  return createClient({ chain })
}

export async function getWriteClient(network: NetworkKey) {
  if (!window.ethereum) throw new Error('No wallet detected. Please install MetaMask.')
  const chain = network === 'bradbury' ? bradbury : studionet
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  const client = createClient({
    chain,
    account: accounts[0],
    provider: window.ethereum,
  })
  return client
}

declare global {
  interface Window { ethereum?: any }
}

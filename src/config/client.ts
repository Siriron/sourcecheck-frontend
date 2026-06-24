import { createClient } from 'genlayer-js'
import { studionet } from 'genlayer-js/chains'
import { type NetworkKey } from './chains'

// Bradbury manual config since it may not be in genlayer-js/chains yet
const bradburyChain = {
  id: 4221,
  name: 'Bradbury',
  rpcUrls: { default: { http: ['https://rpc-bradbury.genlayer.com'] } },
} as any

const studionetChain = studionet as any

export function getReadClient(network: NetworkKey) {
  const chain = network === 'bradbury' ? bradburyChain : studionetChain
  return createClient({ chain })
}

export async function getWriteClient(network: NetworkKey) {
  if (!window.ethereum) throw new Error('No wallet detected. Please install MetaMask.')
  const chain = network === 'bradbury' ? bradburyChain : studionetChain
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  const client = createClient({
    chain,
    account: accounts[0],
  })
  return client
}

declare global {
  interface Window { ethereum?: any }
}

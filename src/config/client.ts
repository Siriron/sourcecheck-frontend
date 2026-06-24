import { createClient, simulator } from 'genlayer-js'
import { NETWORKS, type NetworkKey } from '../config/chains'

export function getReadClient(network: NetworkKey) {
  const net = NETWORKS[network]
  return createClient({
    chain: { id: net.chainId, rpcUrls: { default: { http: [net.rpcUrl] } } } as any,
  })
}

export async function getWriteClient(network: NetworkKey) {
  const net = NETWORKS[network]
  if (!window.ethereum) throw new Error('No wallet detected. Please install MetaMask.')
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  const client = createClient({
    chain: { id: net.chainId, rpcUrls: { default: { http: [net.rpcUrl] } } } as any,
    account: accounts[0],
    provider: window.ethereum,
  })
  await client.connect()
  return client
}

declare global {
  interface Window {
    ethereum?: any
  }
}

import { createClient } from 'genlayer-js'
import { studionet, testnetBradbury } from 'genlayer-js/chains'
import { type NetworkKey } from './chains'

export function getReadClient(network: NetworkKey) {
  const chain = network === 'bradbury' ? testnetBradbury : studionet
  return createClient({ chain })
}

export async function getWriteClient(network: NetworkKey) {
  if (!window.ethereum) throw new Error('No wallet detected. Please install MetaMask.')
  const chain = network === 'bradbury' ? testnetBradbury : studionet
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

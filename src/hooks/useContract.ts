import { useState, useCallback } from 'react'
import { getReadClient, getWriteClient } from '../config/client'
import { NETWORKS, type NetworkKey } from '../config/chains'

export interface CheckEntry {
  check_id: string
  submitter: string
  url: string
  claim: string
  verdict: 'SUPPORTED' | 'DISPUTED' | 'UNVERIFIABLE'
  summary: string
  created_at: string
}

export function useContract(network: NetworkKey) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const contractAddress = NETWORKS[network].contractAddress

  const getAllChecks = useCallback(async (limit = 50): Promise<CheckEntry[]> => {
    try {
      const client = getReadClient(network)
      const result = await client.readContract({
        address: contractAddress,
        functionName: 'get_all_checks',
        args: [limit],
      })
      const parsed = typeof result === 'string' ? JSON.parse(result) : result
      return Array.isArray(parsed) ? parsed : []
    } catch (e: any) {
      console.error('getAllChecks error:', e)
      return []
    }
  }, [network, contractAddress])

  const getTotal = useCallback(async (): Promise<number> => {
    try {
      const client = getReadClient(network)
      const result = await client.readContract({
        address: contractAddress,
        functionName: 'get_total',
        args: [],
      })
      const parsed = typeof result === 'string' ? JSON.parse(result) : result
      return parseInt(parsed?.total ?? parsed ?? '0')
    } catch {
      return 0
    }
  }, [network, contractAddress])

  const submitCheck = useCallback(async (
    url: string,
    claim: string,
    onStatus?: (msg: string) => void
  ): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const client = await getWriteClient(network)
      onStatus?.('Submitting transaction...')
      const txHash = await client.writeContract({
        address: contractAddress,
        functionName: 'submit_check',
        args: [url, claim],
        value: BigInt(0),
      })
      onStatus?.('Waiting for validator consensus...')
      let receipt = null
      let attempts = 0
      while (attempts < 60) {
        await new Promise(r => setTimeout(r, 3000))
        try {
          receipt = await client.getTransactionReceipt({ hash: txHash })
          if (receipt?.status === 'success') break
          if (receipt?.status === 'reverted') {
            throw new Error('Transaction reverted. Validators could not reach consensus.')
          }
        } catch (e: any) {
          if (e.message?.includes('consensus')) throw e
        }
        attempts++
      }
      if (!receipt) throw new Error('Transaction timed out.')
      onStatus?.('Verdict recorded onchain!')
    } catch (e: any) {
      setError(e.message ?? 'Transaction failed')
      throw e
    } finally {
      setLoading(false)
    }
  }, [network, contractAddress])

  return { getAllChecks, getTotal, submitCheck, loading, error, setError }
}

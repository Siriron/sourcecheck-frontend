export const NETWORKS = {
  studionet: {
    id: 'studionet',
    name: 'StudioNet',
    chainId: 61999,
    rpcUrl: 'https://studio.genlayer.com/api',
    explorerUrl: 'https://explorer-studio.genlayer.com',
    contractAddress: '0x91C9A5B84E17e22807ef710416BaA8E7fC5027d4' as `0x${string}`,
    deployTx: '0xc504eda607f0aa01f6af3acff371d22bf350b9991b41e2d6419bf600ff1cd029',
  },
  bradbury: {
    id: 'bradbury',
    name: 'Bradbury',
    chainId: 4221,
    rpcUrl: 'https://rpc-bradbury.genlayer.com',
    explorerUrl: 'https://explorer-bradbury.genlayer.com',
    contractAddress: '0xD7E4b3EC299e46d34aEA2DfEC88523c617a8126f' as `0x${string}`,
    deployTx: '0x0a3e075f3b35a3a77d1328ba1004c6c945811427aa34963de4fb1e15c172e811',
  },
} as const

export type NetworkKey = keyof typeof NETWORKS
export const DEFAULT_NETWORK: NetworkKey = 'studionet'

# Deployment

## Contract Deployment

### Requirements
- GenLayer Studio account: https://studio.genlayer.com
- GEN tokens from faucet: https://testnet-faucet.genlayer.foundation
- MetaMask (for Bradbury only)

### Deploy Steps

1. Open https://studio.genlayer.com
2. Upload `/contracts/SourceChecker.py` via the file upload button
3. Click **Deploy** — no constructor arguments required
4. Copy the contract address from the transaction receipt
5. Update `/src/config/chains.ts` with the new address

> ⚠️ Always deploy via Studio UI file upload. Never paste contract code. Never use MetaMask to deploy.

---

## Deployed Contracts

### StudioNet
- **Address:** `0x91C9A5B84E17e22807ef710416BaA8E7fC5027d4`
- **Deploy TX:** `0xc504eda607f0aa01f6af3acff371d22bf350b9991b41e2d6419bf600ff1cd029`
- **Explorer:** https://explorer-studio.genlayer.com/tx/0xc504eda607f0aa01f6af3acff371d22bf350b9991b41e2d6419bf600ff1cd029
- **Import:** https://studio.genlayer.com/contracts?import-contract=0x91C9A5B84E17e22807ef710416BaA8E7fC5027d4
- **Chain ID:** 61999
- **RPC:** https://studio.genlayer.com/api

### Bradbury Testnet
- **Address:** `0xD7E4b3EC299e46d34aEA2DfEC88523c617a8126f`
- **Deploy TX:** `0x0a3e075f3b35a3a77d1328ba1004c6c945811427aa34963de4fb1e15c172e811`
- **Explorer:** https://explorer-bradbury.genlayer.com/tx/0x0a3e075f3b35a3a77d1328ba1004c6c945811427aa34963de4fb1e15c172e811
- **Import:** https://studio.genlayer.com/contracts?import-contract=0xD7E4b3EC299e46d34aEA2DfEC88523c617a8126f
- **Chain ID:** 4221
- **RPC:** https://rpc-bradbury.genlayer.com

---

## Frontend Deployment (Vercel)

### Steps
1. Push repo to GitHub: `github.com/Siriron/sourcecheck-frontend`
2. Go to https://vercel.com → Import Project → select the repo
3. Framework: **Vite**
4. Root directory: `/` (repo root)
5. Build command: `npm run build` (auto-detected)
6. Output directory: `dist` (auto-detected)
7. No environment variables required
8. Click **Deploy**

### Live URL
https://sourcecheck-genlayer.vercel.app

### Vercel Config
`vercel.json` includes SPA rewrite rule — all routes return `index.html` for client-side routing:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

---

## MetaMask Setup (Bradbury)

To submit checks on Bradbury, add the network to MetaMask:

| Field | Value |
|-------|-------|
| Network Name | GenLayer Bradbury |
| RPC URL | https://rpc-bradbury.genlayer.com |
| Chain ID | 4221 |
| Currency Symbol | GEN |
| Explorer | https://explorer-bradbury.genlayer.com |

Then get testnet GEN from: https://testnet-faucet.genlayer.foundation

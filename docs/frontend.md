# Frontend Guide

## Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.3.1 | UI framework |
| Vite | 5.2.0 | Build tool + dev server |
| TypeScript | 5.4.5 | Type safety |
| Tailwind CSS | 3.4.4 | Utility-first styling |
| Framer Motion | 11.0.0 | Animations |
| genlayer-js | ^1.1.7 | GenLayer blockchain SDK |
| React Router | 6.22.0 | Client-side routing |
| Lucide React | 0.383.0 | Icons |

---

## Local Setup

```bash
git clone https://github.com/Siriron/sourcecheck-frontend
cd sourcecheck-frontend
npm install
npm run dev
# → http://localhost:5173
```

No environment variables needed.

---

## Project Structure

```
src/
├── components/
│   ├── CheckCard.tsx      # Verdict card displayed in feed
│   ├── Footer.tsx         # Site footer with contract links
│   ├── Navbar.tsx         # Top nav + StudioNet/Bradbury toggle
│   └── VerdictBadge.tsx   # Colored badge: SUPPORTED/DISPUTED/UNVERIFIABLE
├── config/
│   ├── chains.ts          # Network definitions + contract addresses
│   └── client.ts          # genlayer-js client factory functions
├── hooks/
│   ├── useContract.ts     # Contract read/write hooks
│   └── useNetwork.ts      # Active network state
├── pages/
│   ├── Home.tsx           # Landing page + recent verdicts
│   ├── Submit.tsx         # Submit form with multi-stage UX
│   ├── Feed.tsx           # Public feed with filter + search
│   ├── Docs.tsx           # In-app documentation
│   └── NotFound.tsx       # 404 page
├── App.tsx                # Root component + router
├── index.css              # Tailwind directives + custom utilities
└── main.tsx               # React entry point
```

---

## Key Components

### `Navbar.tsx`
- Sticky top navigation
- Network toggle (StudioNet / Bradbury) — switches all contract calls
- Mobile-responsive with horizontal scroll on small screens

### `VerdictBadge.tsx`
Renders color-coded badge based on verdict string:
- `SUPPORTED` → green
- `DISPUTED` → red
- `UNVERIFIABLE` → yellow
- `PENDING` → purple

### `CheckCard.tsx`
Displays a single onchain check entry with:
- Check ID + domain hostname
- Claim text (truncated to 2 lines)
- Verdict badge
- Validator summary
- Submitter address (shortened) + timestamp

### `Submit.tsx`
Four-stage UI:
1. **Form** — URL input + claim textarea + info box
2. **Pending** — animated spinner + live status message from `onStatus` callback
3. **Done** — success confirmation
4. **Error** — error message + retry

---

## Network Config (`chains.ts`)

```typescript
export const NETWORKS = {
  studionet: {
    id: 'studionet',
    name: 'StudioNet',
    chainId: 61999,
    rpcUrl: 'https://studio.genlayer.com/api',
    explorerUrl: 'https://explorer-studio.genlayer.com',
    contractAddress: '0x91C9A5B84E17e22807ef710416BaA8E7fC5027d4',
    deployTx: '0xc504eda...',
  },
  bradbury: {
    id: 'bradbury',
    name: 'Bradbury',
    chainId: 4221,
    rpcUrl: 'https://rpc-bradbury.genlayer.com',
    explorerUrl: 'https://explorer-bradbury.genlayer.com',
    contractAddress: '0xD7E4b3EC299e46d34aEA2DfEC88523c617a8126f',
    deployTx: '0x0a3e075...',
  },
}
```

To add a new network, add an entry here — all components pick it up automatically.

---

## Client Factory (`client.ts`)

```typescript
import { createClient } from 'genlayer-js'
import { studionet, testnetBradbury } from 'genlayer-js/chains'

// Read-only — no wallet needed
export function getReadClient(network) {
  const chain = network === 'bradbury' ? testnetBradbury : studionet
  return createClient({ chain })
}

// Write — MetaMask required
export async function getWriteClient(network) {
  const chain = network === 'bradbury' ? testnetBradbury : studionet
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  return createClient({ chain, account: accounts[0] })
}
```

**Critical rules:**
- Import chains from `genlayer-js/chains` — NOT from `genlayer-js`
- Bradbury export: `testnetBradbury` (NOT `bradbury`)
- `value: BigInt(0)` is required in `writeContract` calls
- `readContract` always returns a JSON string — always parse it

---

## Design System

Colors follow a purple/lavender palette:
- Background: `#faf5ff`
- Text: `#1e1b4b`
- Primary: `#a855f7` (purple-500)
- Accent: `#ec4899` (pink-500)
- Cards: `rgba(255,255,255,0.70)` with backdrop blur

Custom CSS utilities in `index.css`:
- `.gradient-text` — purple-to-pink gradient text
- `.card-glass` — frosted glass card effect
- `.shimmer-btn` — animated gradient button
- `.verdict-supported/disputed/unverifiable/pending` — verdict color classes

---

## Build & Deploy

```bash
npm run build   # Outputs to /dist
npm run preview # Preview production build locally
```

Deploy to Vercel by connecting the GitHub repo. No env vars needed.

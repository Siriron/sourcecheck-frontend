# SourceCheck — Decentralized URL Credibility Oracle

> Submit any URL and claim. GenLayer validators independently fetch the source and reach onchain consensus — SUPPORTED, DISPUTED, or UNVERIFIABLE. No central authority. No single point of failure.

**Live App:** https://sourcecheck-genlayer.vercel.app  
**GitHub:** https://github.com/Siriron/sourcecheck-frontend

---

## What Is SourceCheck?

SourceCheck is a GenLayer-native intelligent contract that solves a real problem: **you cannot trust a source just because someone links to it.**

Anyone can submit a publicly accessible URL alongside a specific claim. Multiple GenLayer validators independently fetch the URL, read the content, and use LLM-powered reasoning to judge whether the page actually supports the claim. Validators must reach consensus — disagreement means no verdict is recorded. The final verdict is stored permanently onchain.

This is decentralized fact-checking without gatekeepers.

---

## Verdicts

| Verdict | Meaning |
|---------|---------|
| ✓ SUPPORTED | The page content clearly and directly supports the claim |
| ✕ DISPUTED | The page content contradicts or does not support the claim |
| ? UNVERIFIABLE | The page could not be fetched, is paywalled, or the claim cannot be judged from this source |

---

## Smart Contracts

| Network | Contract Address | Deploy TX | Explorer |
|---------|-----------------|-----------|---------|
| StudioNet (61999) | `0x91C9A5B84E17e22807ef710416BaA8E7fC5027d4` | [View](https://explorer-studio.genlayer.com/tx/0xc504eda607f0aa01f6af3acff371d22bf350b9991b41e2d6419bf600ff1cd029) | [Import](https://studio.genlayer.com/contracts?import-contract=0x91C9A5B84E17e22807ef710416BaA8E7fC5027d4) |
| Bradbury (4221) | `0xD7E4b3EC299e46d34aEA2DfEC88523c617a8126f` | [View](https://explorer-bradbury.genlayer.com/tx/0x0a3e075f3b35a3a77d1328ba1004c6c945811427aa34963de4fb1e15c172e811) | [Import](https://studio.genlayer.com/contracts?import-contract=0xD7E4b3EC299e46d34aEA2DfEC88523c617a8126f) |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Intelligent Contract | Python (GenLayer GenVM) |
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| Blockchain SDK | genlayer-js ^1.1.7 |
| Hosting | Vercel |
| Networks | GenLayer StudioNet + Bradbury Testnet |

---

## Architecture

```
User (Browser)
  │
  ├── Read path:  genlayer-js readContract → SourceChecker.get_all_checks()
  │                                        → returns JSON string → parse → render
  │
  └── Write path: MetaMask sign → genlayer-js writeContract → submit_check(url, claim)
                                                             │
                                              GenLayer Consensus Layer
                                                             │
                                   ┌─────────────────────────────────────────┐
                                   │  run_nondet_unsafe(leader_fn, validator_fn) │
                                   │                                           │
                                   │  Leader:                                  │
                                   │  1. gl.nondet.web.get(url)                │
                                   │  2. gl.nondet.exec_prompt(prompt)         │
                                   │  3. Return "VERDICT=LABEL|summary"        │
                                   │                                           │
                                   │  Each Validator (independently):          │
                                   │  1. Re-runs leader_fn()                   │
                                   │  2. Compares verdict label only           │
                                   │  3. Approves if labels match              │
                                   └─────────────────────────────────────────┘
                                                             │
                                        Consensus reached → verdict stored onchain
                                        No consensus     → transaction reverts
```

---

## Repository Structure

```
sourcecheck-frontend/
├── contracts/
│   └── SourceChecker.py        # GenLayer intelligent contract
├── docs/
│   ├── architecture.md         # System design + consensus flow
│   ├── contracts.md            # Contract reference + ABI
│   ├── deployment.md           # Deploy addresses + instructions
│   ├── frontend.md             # Frontend setup + component guide
│   └── api.md                  # Contract function reference
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── CheckCard.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── VerdictBadge.tsx
│   ├── config/
│   │   ├── chains.ts           # Network config + contract addresses
│   │   └── client.ts           # genlayer-js client factory
│   ├── hooks/
│   │   ├── useContract.ts      # Read + write contract hooks
│   │   └── useNetwork.ts       # Network switcher state
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Submit.tsx
│   │   ├── Feed.tsx
│   │   ├── Docs.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── vercel.json
├── .env.example
└── README.md
```

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/Siriron/sourcecheck-frontend
cd sourcecheck-frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

No environment variables required. All reads use the public GenLayer RPC. Writes use MetaMask.

---

## How to Use

1. Open https://sourcecheck-genlayer.vercel.app
2. Connect MetaMask (Bradbury network: RPC `https://rpc-bradbury.genlayer.com`, ChainID `4221`)
3. Navigate to **Submit**
4. Enter a publicly accessible URL
5. Enter a specific, verifiable claim about what that source says
6. Click **Submit for Verification**
7. Wait for validator consensus (~30–90 seconds)
8. View the verdict on the **Feed** page

---

## Grant Alignment

Built for the **GenLayer Builder Program**. Demonstrates:

- GenLayer-native intelligent contract with real web access (`gl.nondet.web.get`)
- LLM-powered verdict generation (`gl.nondet.exec_prompt`)
- Decentralized consensus via `gl.vm.run_nondet_unsafe`
- Production-quality React + Vite frontend with live onchain data
- Dual network deployment (StudioNet + Bradbury testnet)
- Novel use case: decentralized source credibility oracle — not previously built on GenLayer

---

## Links

- **Live App:** https://sourcecheck-genlayer.vercel.app
- **GitHub:** https://github.com/Siriron/sourcecheck-frontend
- **GenLayer Portal:** https://portal.genlayer.foundation
- **GenLayer Docs:** https://docs.genlayer.com
- **StudioNet Explorer:** https://explorer-studio.genlayer.com
- **Bradbury Explorer:** https://explorer-bradbury.genlayer.com

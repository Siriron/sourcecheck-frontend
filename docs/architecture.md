# Architecture

## Overview

SourceCheck is a fully GenLayer-native decentralized application. There is no backend server, no centralized API, no oracle middleman. Every verdict is produced by multiple independent GenLayer validators and stored permanently onchain.

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                         │
│                                                             │
│   React + Vite + TypeScript + Tailwind + Framer Motion      │
│   genlayer-js SDK ←→ MetaMask (writes) / Public RPC (reads) │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   GenLayer Network                          │
│                                                             │
│   SourceChecker.py (Python, GenVM)                          │
│                                                             │
│   submit_check(url, claim)                                  │
│         │                                                   │
│         ▼                                                   │
│   run_nondet_unsafe(leader_fn, validator_fn)                │
│         │                                                   │
│   ┌─────┴──────────────────────────────────┐               │
│   │         Leader Validator               │               │
│   │  1. gl.nondet.web.get(url)             │               │
│   │  2. Truncate content to 3000 chars     │               │
│   │  3. gl.nondet.exec_prompt(prompt)      │               │
│   │  4. Parse → "VERDICT=LABEL|summary"   │               │
│   └─────┬──────────────────────────────────┘               │
│         │ leader_result                                     │
│   ┌─────▼──────────────────────────────────┐               │
│   │    N Validator Nodes (independently)   │               │
│   │  1. Re-run leader_fn() from scratch    │               │
│   │  2. Parse own verdict label            │               │
│   │  3. Compare label == leader label      │               │
│   │  4. Return True/False                  │               │
│   └─────┬──────────────────────────────────┘               │
│         │                                                   │
│   Majority agree → Consensus reached                        │
│   Disagreement   → Transaction reverts                      │
│         │                                                   │
│         ▼                                                   │
│   CheckEntry stored in TreeMap[u256, CheckEntry]            │
└─────────────────────────────────────────────────────────────┘
```

---

## Consensus Flow

### Why `run_nondet_unsafe`?

GenLayer uses non-deterministic execution for any operation that touches the outside world (web fetches, LLM calls). The `run_nondet_unsafe` primitive allows the leader validator to produce a result, then all other validators independently replicate the computation and vote on whether the result is equivalent.

SourceCheck uses this pattern correctly:
- **Leader** fetches the URL and generates a verdict
- **Validators** independently re-fetch and re-prompt
- **Comparison** is on the verdict **label only** (SUPPORTED/DISPUTED/UNVERIFIABLE), not the full LLM output text
- This makes consensus robust — minor wording differences in summaries do not cause disagreement

### Why label-only comparison?

LLM outputs are non-deterministic by nature. Two validators asking the same question will get slightly different wording. Comparing full text would cause consensus to fail almost every time. Comparing only the categorical label (one of three values) gives validators a stable, deterministic target to agree on while preserving the LLM's reasoning ability.

---

## Data Model

```python
@allow_storage
@dataclass
class CheckEntry:
    check_id:   u256   # Auto-incremented ID
    submitter:  str    # Wallet address of submitter
    url:        str    # Source URL that was checked
    claim:      str    # The claim submitted for verification
    verdict:    str    # SUPPORTED | DISPUTED | UNVERIFIABLE
    summary:    str    # One-sentence validator reasoning (max 280 chars)
    created_at: str    # Datetime from gl.message_raw["datetime"]
```

Primary storage: `TreeMap[u256, CheckEntry]` — indexed by check_id for O(log n) reads.

---

## Frontend Architecture

```
App.tsx (network state)
├── Navbar.tsx (network toggle: StudioNet / Bradbury)
├── pages/
│   ├── Home.tsx        → reads last 6 checks via getAllChecks(6)
│   ├── Submit.tsx      → write via submitCheck(url, claim)
│   ├── Feed.tsx        → reads all checks via getAllChecks(100)
│   ├── Docs.tsx        → static in-app documentation
│   └── NotFound.tsx    → 404
└── Footer.tsx

hooks/
├── useContract.ts      → getAllChecks(), getTotal(), submitCheck()
└── useNetwork.ts       → network switcher state

config/
├── chains.ts           → contract addresses + RPC URLs per network
└── client.ts           → genlayer-js createClient factory
```

---

## Network Configuration

| Property | StudioNet | Bradbury |
|----------|-----------|---------|
| Chain ID | 61999 | 4221 |
| RPC | https://studio.genlayer.com/api | https://rpc-bradbury.genlayer.com |
| Explorer | explorer-studio.genlayer.com | explorer-bradbury.genlayer.com |
| Contract | 0x91C9A5B84E17e22807ef710416BaA8E7fC5027d4 | 0xD7E4b3EC299e46d34aEA2DfEC88523c617a8126f |
| Resets | Periodically | Persistent |

---

## Security Considerations

- No private keys ever stored in frontend or environment variables
- All writes go through MetaMask — user signs every transaction
- No admin functions in the contract — immutable after deployment
- No financial logic — no ETH handling, no token transfers, no staking
- URL content truncated to 3000 chars before LLM prompt — prevents prompt injection via page content

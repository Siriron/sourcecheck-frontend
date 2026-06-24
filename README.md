# SourceCheck — Decentralized URL Credibility Oracle

> A GenLayer intelligent contract that reaches validator consensus on whether a source URL supports a claim.

**Live App:** https://sourcecheck.vercel.app  
**Network:** GenLayer StudioNet + Bradbury Testnet

---

## Contracts

| Network    | Address                                      | Explorer |
|------------|----------------------------------------------|---------|
| StudioNet  | `0x91C9A5B84E17e22807ef710416BaA8E7fC5027d4` | [View TX](https://explorer-studio.genlayer.com/tx/0xc504eda607f0aa01f6af3acff371d22bf350b9991b41e2d6419bf600ff1cd029) |
| Bradbury   | `0xD7E4b3EC299e46d34aEA2DfEC88523c617a8126f` | [View TX](https://explorer-bradbury.genlayer.com/tx/0x0a3e075f3b35a3a77d1328ba1004c6c945811427aa34963de4fb1e15c172e811) |

---

## What It Does

Submit any publicly accessible URL and a claim. GenLayer validators:
1. Independently fetch the URL content
2. Run an LLM prompt to judge if the content supports the claim
3. Compare verdict labels — consensus required
4. Store the verdict onchain: **SUPPORTED**, **DISPUTED**, or **UNVERIFIABLE**

No central authority. No single point of failure.

---

## Tech Stack

- **Smart Contract:** Python (GenLayer GenVM)
- **Frontend:** React + Vite + TypeScript + Tailwind CSS + Framer Motion
- **SDK:** genlayer-js ^1.1.7
- **Deployment:** Vercel

---

## Local Development

```bash
cd frontend
npm install
npm run dev
```

---

## Architecture

```
User → Frontend (React+Vite)
     → genlayer-js write tx
     → SourceChecker.py (GenLayer contract)
     → run_nondet_unsafe(leader_fn, validator_fn)
       → leader: fetch URL + LLM verdict
       → validators: re-run independently + compare label
     → Consensus verdict stored onchain
     → Frontend reads via readContract
```

---

## Grant Alignment

Built for the GenLayer Builder Program. Demonstrates:
- GenLayer-native intelligent contract with web access + LLM consensus
- Production-quality React frontend with live onchain data
- Dual network deployment (StudioNet + Bradbury)
- Novel use case: decentralized fact-checking oracle

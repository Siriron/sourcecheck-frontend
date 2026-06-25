# Smart Contracts

## SourceChecker.py

The core GenLayer intelligent contract. Written in Python, executed on GenVM.

**File:** `/contracts/SourceChecker.py`

---

## Deployed Addresses

| Network | Chain ID | Address |
|---------|----------|---------|
| StudioNet | 61999 | `0x91C9A5B84E17e22807ef710416BaA8E7fC5027d4` |
| Bradbury | 4221 | `0xD7E4b3EC299e46d34aEA2DfEC88523c617a8126f` |

**Import into GenLayer Studio:**
- StudioNet: https://studio.genlayer.com/contracts?import-contract=0x91C9A5B84E17e22807ef710416BaA8E7fC5027d4
- Bradbury: https://studio.genlayer.com/contracts?import-contract=0xD7E4b3EC299e46d34aEA2DfEC88523c617a8126f

---

## Storage

```python
checks:      TreeMap[u256, CheckEntry]   # All verified checks, indexed by ID
check_count: u256                        # Total number of checks submitted
```

### CheckEntry Fields

| Field | Type | Description |
|-------|------|-------------|
| check_id | u256 | Auto-incremented unique ID |
| submitter | str | Wallet address of the submitter |
| url | str | Source URL that was verified |
| claim | str | The claim submitted for verification |
| verdict | str | SUPPORTED, DISPUTED, or UNVERIFIABLE |
| summary | str | One-sentence validator reasoning (max 280 chars) |
| created_at | str | Timestamp from gl.message_raw["datetime"] |

---

## Public Functions

### Views (read-only, no gas)

#### `get_all_checks(limit: int) → str`
Returns a JSON string array of all checks up to `limit`.

```json
[
  {
    "check_id": "1",
    "submitter": "0xAbc...",
    "url": "https://example.com/article",
    "claim": "The article states X happened in 2024.",
    "verdict": "SUPPORTED",
    "summary": "The page content directly confirms that X occurred in December 2024.",
    "created_at": "2026-06-24T16:36:00"
  }
]
```

#### `get_check(check_id: int) → str`
Returns a single check by ID as a JSON string. Returns `{"error": "Not found"}` if not found.

#### `get_total() → str`
Returns total check count as JSON string: `{"total": "42"}`

---

### Writes (require wallet + gas)

#### `submit_check(url: str, claim: str) → None`

Submits a URL and claim for validator verification.

**Parameters:**
- `url` — Publicly accessible URL. Must not be empty. Paywalled or login-required URLs will return UNVERIFIABLE.
- `claim` — The specific claim to verify against the URL content. Must not be empty. Be precise — validators judge only what the page content says.

**Process:**
1. Validates inputs (non-empty)
2. Runs `gl.vm.run_nondet_unsafe(leader_fn, validator_fn)`
3. Leader fetches URL content + runs LLM verdict prompt
4. Validators independently re-run and compare verdict labels
5. On consensus: stores `CheckEntry` in `self.checks[new_id]`
6. On failure: transaction reverts

**Gas:** Requires GEN tokens on the target network. Get from faucet: https://testnet-faucet.genlayer.foundation

---

## Verdict Logic

The LLM prompt instructs validators to judge using exactly one of three labels:

```
SUPPORTED     — the page clearly and directly supports the claim
DISPUTED      — the page contradicts or does not support the claim
UNVERIFIABLE  — could not fetch page, is paywalled, or claim cannot be verified
```

Validators compare **label only**, not full LLM output. This ensures consensus is robust against natural variation in LLM wording between validator nodes.

---

## Dependency

```python
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
```

Pinned dependency hash required for deterministic GenVM execution.

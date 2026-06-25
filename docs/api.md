# Contract API Reference

Complete reference for all public functions in `SourceChecker.py`.

---

## Read Functions

Read functions are free — no gas, no wallet required. Call via `genlayer-js` `readContract`.

---

### `get_all_checks(limit: int) → str`

Returns all stored checks up to `limit`, as a JSON string array sorted by insertion order.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| limit | int | Maximum number of checks to return (recommended: 50–100) |

**Returns:** JSON string — array of CheckEntry objects

**Example call (genlayer-js):**
```typescript
const result = await client.readContract({
  address: CONTRACT_ADDRESS,
  functionName: 'get_all_checks',
  args: [50],
})
const checks = JSON.parse(result as string)
```

**Example response:**
```json
[
  {
    "check_id": "1",
    "submitter": "0x1234567890abcdef1234567890abcdef12345678",
    "url": "https://coindesk.com/markets/2024/12/05/bitcoin-hits-100000/",
    "claim": "Bitcoin reached $100,000 for the first time in December 2024.",
    "verdict": "SUPPORTED",
    "summary": "The article directly confirms Bitcoin crossed the $100,000 mark on December 5, 2024.",
    "created_at": "2026-06-24T16:36:00"
  }
]
```

---

### `get_check(check_id: int) → str`

Returns a single check by its ID.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| check_id | int | The numeric ID of the check |

**Returns:** JSON string — single CheckEntry object, or `{"error": "Not found"}`

**Example call:**
```typescript
const result = await client.readContract({
  address: CONTRACT_ADDRESS,
  functionName: 'get_check',
  args: [1],
})
const check = JSON.parse(result as string)
```

---

### `get_total() → str`

Returns the total number of checks submitted.

**Returns:** JSON string — `{"total": "42"}`

**Example call:**
```typescript
const result = await client.readContract({
  address: CONTRACT_ADDRESS,
  functionName: 'get_total',
  args: [],
})
const { total } = JSON.parse(result as string)
```

---

## Write Functions

Write functions require a wallet (MetaMask) and GEN tokens for gas.

---

### `submit_check(url: str, claim: str) → None`

Submits a URL and claim for decentralized verification. Triggers the `run_nondet_unsafe` consensus flow.

**Parameters**

| Name | Type | Constraints | Description |
|------|------|-------------|-------------|
| url | str | Non-empty, valid URL | The source URL to fetch and verify |
| claim | str | Non-empty | The specific claim to verify against the URL |

**Reverts if:**
- `url` is empty
- `claim` is empty
- Validators cannot reach consensus on the verdict

**Example call (genlayer-js):**
```typescript
const txHash = await client.writeContract({
  address: CONTRACT_ADDRESS,
  functionName: 'submit_check',
  args: [url, claim],
  value: BigInt(0),  // required field
})

// Poll for receipt
const receipt = await client.getTransactionReceipt({ hash: txHash })
```

**Timeline:**
- Transaction submitted: ~1–2 seconds
- Validator consensus: ~30–90 seconds depending on network load
- Result stored onchain: immediately after consensus

---

## CheckEntry Schema

All read functions return data matching this schema:

```typescript
interface CheckEntry {
  check_id:   string   // Numeric ID as string (e.g. "1", "42")
  submitter:  string   // Full wallet address "0x..."
  url:        string   // Source URL as submitted
  claim:      string   // Claim text as submitted
  verdict:    string   // "SUPPORTED" | "DISPUTED" | "UNVERIFIABLE"
  summary:    string   // Validator reasoning, max 280 chars
  created_at: string   // ISO datetime string "2026-06-24T16:36:00"
}
```

---

## Verdict Values

| Value | Description |
|-------|-------------|
| `SUPPORTED` | The page content clearly and directly supports the claim |
| `DISPUTED` | The page content contradicts or does not support the claim |
| `UNVERIFIABLE` | The page could not be fetched, is paywalled, or the claim cannot be verified from the content |

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|-----------|
| `URL required` | Empty URL submitted | Provide a valid, non-empty URL |
| `Claim required` | Empty claim submitted | Provide a specific, non-empty claim |
| Transaction reverts | Validators disagreed | Retry — may succeed with different validator set |
| `Cannot convert undefined to BigInt` | Missing `value` field in writeContract | Always pass `value: BigInt(0)` |
| Receipt timeout | Network congestion | Increase polling duration or retry |

---

## Network Addresses

| Network | Chain ID | Contract Address |
|---------|----------|-----------------|
| StudioNet | 61999 | `0x91C9A5B84E17e22807ef710416BaA8E7fC5027d4` |
| Bradbury | 4221 | `0xD7E4b3EC299e46d34aEA2DfEC88523c617a8126f` |

**RPC Endpoints:**
- StudioNet: `https://studio.genlayer.com/api`
- Bradbury: `https://rpc-bradbury.genlayer.com`

# Garanti 3D Pay Integration - Working Configuration (Prod)

**Status:** ✅ Verified & Working
**Date:** 30.12.2025

## 1. Critical Configuration Settings

### IP Address Sanitization
Garanti PROD environment explicitly rejects IPv6-mapped IPv4 addresses (e.g., `::ffff:172.69.x.x`).
**Requirement:** You must strip the `::ffff:` prefix before sending.

```javascript
// src/services/garantiPaymentService.ts
let clientIp = request.customerIp || '127.0.0.1';
if (clientIp.startsWith('::ffff:')) {
    clientIp = clientIp.substring(7);
}
```

### Store Key (Hash/Security)
**Do NOT decode the Store Key.**
If your `.env` contains a Hex string (e.g., `4176...`), use it **exactly as is**.
Attempts to decode this hex string into plain text will cause a `Hash Mismatch (MD: 7 / Code: 99)` error.

```javascript
// src/services/garantiPaymentService.ts
// Use raw value from .env
const finalStoreKey = (process.env.GARANTI_STORE_KEY || "").trim();
```

### Form Defaults
Specific parameters must be sent as follows to avoid `MD: 7` or `Code: 92` errors:

| Parameter | Value | Note |
| :--- | :--- | :--- |
| `txninstallmentcount` | `""` (Empty String) | Do **NOT** use `"0"`. Sending `"0"` causes Security Error. |
| `terminaluserid` | `PROVAUT` | Must match the Provision User ID in PROD. Do not use "GARANTI". |
| `txnamount` | `10000` (Minor Units) | Amount * 100 (e.g., 100.00 TL -> 10000). |
| `secure3dsecuritylevel`| `3D_PAY` | |

## 2. Working File Path
The active logic resides in **TypeScript** source, not the compiled JS file (if present).
**File:** `src/services/garantiPaymentService.ts`

## 3. Common Errors & Solutions

*   **Code: 92** -> `CustomerIPAddress invalid`: You are sending `::ffff:127.0.0.1`. Sanitize it.
*   **Code: 99 / MD: 7** -> `Security Code Invalid`:
    *   Hash is wrong (Check Store Key - use Raw Hex).
    *   `txninstallmentcount` is `"0"` (Change to `""`).
*   **MD: 0** -> Authentication Failed. Check `terminaluserid`, `provUserId`, or `provPassword`.

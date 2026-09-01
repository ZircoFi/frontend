<p align="center">
  <img src="public/images/logo-mark.png" alt="ZircoFi" width="96" />
</p>

<h1 align="center">ZircoFi</h1>

<p align="center">
  A non-custodial swap venue for tokenized real-world assets on Robinhood Chain.<br />
  This repository is the website at <a href="https://zircofi.com">zircofi.com</a> and the trading platform at <code>/platform</code>.
</p>

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS 4 with the ZircoFi design tokens in `src/app/globals.css` (light, sky-inspired theme)
- Privy for sign-in and embedded wallets on Robinhood Chain
- Supabase (Postgres) for profiles and eligibility attestations
- viem for chain configuration and on-chain interaction

## Requirements

- Node 24 or newer (see `.nvmrc`)
- A Supabase project
- A Privy app

## How the platform works

- **Pricing.** The swap ticket, market list and explorer price with the AnchorVault formula (guarded mid, tier half-spread times the session multiplier, signed inventory skew, itemised fee) in `src/lib/platform/markets.ts`. The trading regime is derived from the live US-equity clock, so spreads widen and clips shrink outside the regular session exactly as the venue's contracts do. Mids, inventories and fill history are indicative until the venue indexer is wired in; the pages say so where it applies.
- **Reads.** Public content needs no account. Profile and attestation reads are per-user.
- **Writes and private reads** (profile, attestations) are sent to `POST /api/platform/db` with the user's Privy access token. The route verifies the token, validates the arguments in `src/lib/platform/ops.ts`, and runs the operation with a service-role Supabase client that carries the verified user id in an `x-zircofi-actor` header. The database function `app_user_id()` trusts that header only on service-role requests.
- **Settlement.** Swaps settle on-chain through the SwapRouter; the contracts and their deployment records live in `contracts/`.
- **Eligibility.** Trading, providing liquidity and making markets each require a role attestation (`TRADER`, `LP`, `MAKER`, `RELAYER`), shown in Settings and enforced on-chain by the EligibilityRegistry.

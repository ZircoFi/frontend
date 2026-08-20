/** Row types for the Supabase schema. Numeric columns arrive as strings. */

export interface Profile {
  id: string;
  wallet_address: string | null;
  email: string | null;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Attestation {
  id: string;
  profile_id: string | null;
  wallet_address: string;
  role: string;
  jurisdiction_class: string | null;
  investor_class: number | null;
  issuer: string | null;
  onchain_uid: string | null;
  status: "active" | "revoked";
  issued_at: string;
  expires_at: string;
}

// ---------------------------------------------------------------------------
// Venue read model (written by the indexer, public reads)
// ---------------------------------------------------------------------------

export type MarketSession = "regular" | "extended" | "closed";

export interface VenueMarketRow {
  id: string;
  chain_id: number;
  symbol: string;
  name: string;
  token_address: string;
  token_decimals: number;
  quote_symbol: string;
  quote_address: string;
  quote_decimals: number;
  tier: number;
  tier_label: string;
  base_half_spread_bps: number;
  max_skew_bps: number;
  inventory_band_bps: number;
  oracle_band_bps: number;
  max_clip: string;
  daily_volume_cap: string;
  tvl_cap: string;
  vault_address: string | null;
  enabled: boolean;
}

export interface LatestPriceRow {
  market_id: string;
  price: string;
  session: MarketSession;
  multiplier: string;
  source: string | null;
  observed_at: string;
}

export interface VaultSnapshotRow {
  market_id: string;
  tvl: string;
  inventory_ratio_bps: number;
  volume_24h: string;
  spread_revenue_24h: string;
  observed_at: string;
}

export interface FillRow {
  id: number;
  market_id: string;
  tx_hash: string | null;
  trader_address: string | null;
  side: "buy" | "sell";
  venue: "vault" | "rfq";
  amount_in: string;
  amount_out: string;
  notional: string;
  mid: string;
  half_spread_bps: number;
  skew_bps: number;
  fee_bps: number;
  fee_amount: string;
  session: MarketSession;
  executed_at: string;
}

export interface GovernanceRow {
  id: number;
  action: string;
  detail: string;
  rationale_url: string | null;
  tx_hash: string | null;
  occurred_at: string;
}

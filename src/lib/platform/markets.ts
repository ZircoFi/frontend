/**
 * Market catalogue and vault pricing for the platform.
 *
 * Quotes computed here follow the AnchorVault formula exactly (fee off the quote-token side, the
 * regime-adjusted half-spread around the mid, signed inventory skew, clip and band checks), and the
 * session is derived from the real US-equity clock, so the ticket behaves like the venue does.
 * Mids, inventories and volumes are indicative until the venue indexer feeds this page.
 */

export type Session = "regular" | "extended" | "closed";

export interface TierParams {
  label: string;
  baseHalfSpreadBps: number;
  maxSkewBps: number;
  inventoryBandBps: number;
  oracleBandBps: number;
  /** Largest single swap in the regular session, quote-token notional. */
  maxClip: number;
}

export const TIERS: Record<1 | 2 | 3, TierParams> = {
  1: { label: "A", baseHalfSpreadBps: 10, maxSkewBps: 15, inventoryBandBps: 2000, oracleBandBps: 75, maxClip: 50_000 },
  2: { label: "B", baseHalfSpreadBps: 20, maxSkewBps: 25, inventoryBandBps: 2000, oracleBandBps: 150, maxClip: 20_000 },
  3: { label: "C", baseHalfSpreadBps: 40, maxSkewBps: 50, inventoryBandBps: 2000, oracleBandBps: 300, maxClip: 5_000 },
};

export const REGIMES: Record<Session, { label: string; spreadMulBps: number; clipMulBps: number }> = {
  regular: { label: "OPEN", spreadMulBps: 10_000, clipMulBps: 10_000 },
  extended: { label: "EXTENDED", spreadMulBps: 15_000, clipMulBps: 7_500 },
  closed: { label: "CLOSED", spreadMulBps: 30_000, clipMulBps: 5_000 },
};

export const FEES = { swapFeeBps: 2, rfqFeeBps: 2, spreadShareBps: 1000 } as const;

export const QUOTE_SYMBOL = "USDG";

export interface VaultMarket {
  symbol: string;
  name: string;
  tier: 1 | 2 | 3;
  /** USDG per whole token. */
  mid: number;
  /** Token share of vault value, bps. 5000 is on target. */
  inventoryRatioBps: number;
  /** Vault value in USDG. */
  tvl: number;
  volume24h: number;
}

export const MARKETS: VaultMarket[] = [
  { symbol: "NVDAx", name: "NVIDIA Stock Token", tier: 1, mid: 176.4, inventoryRatioBps: 4880, tvl: 986_000, volume24h: 412_000 },
  { symbol: "SPYx", name: "SPDR S&P 500 Stock Token", tier: 1, mid: 645.2, inventoryRatioBps: 5060, tvl: 1_240_000, volume24h: 517_000 },
  { symbol: "AAPLx", name: "Apple Stock Token", tier: 1, mid: 232.15, inventoryRatioBps: 5140, tvl: 742_000, volume24h: 236_000 },
  { symbol: "MSFTx", name: "Microsoft Stock Token", tier: 1, mid: 512.3, inventoryRatioBps: 4970, tvl: 688_000, volume24h: 198_000 },
  { symbol: "QQQx", name: "Invesco QQQ Stock Token", tier: 1, mid: 585.65, inventoryRatioBps: 5010, tvl: 654_000, volume24h: 173_000 },
  { symbol: "TSLAx", name: "Tesla Stock Token", tier: 2, mid: 342.8, inventoryRatioBps: 4560, tvl: 402_000, volume24h: 151_000 },
  { symbol: "AMZNx", name: "Amazon Stock Token", tier: 2, mid: 228.45, inventoryRatioBps: 5290, tvl: 356_000, volume24h: 98_000 },
  { symbol: "PLTRx", name: "Palantir Stock Token", tier: 3, mid: 148.3, inventoryRatioBps: 5620, tvl: 118_000, volume24h: 41_000 },
];

export const marketBySymbol = Object.fromEntries(MARKETS.map((m) => [m.symbol, m])) as Record<string, VaultMarket>;

/**
 * US-equity session from the UTC clock (standard time): regular 14:30 to 21:00, extended 09:00 to
 * 14:30 and 21:00 to 01:00, closed otherwise and all weekend. The venue itself reads the session
 * from the oracle's market status; this clock is the platform's local approximation of it.
 */
export function currentSession(now: Date = new Date()): Session {
  const day = now.getUTCDay(); // 0 Sunday .. 6 Saturday
  const minutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const inWrappedTail = minutes < 60; // 00:00 to 01:00 belongs to the previous day's extended session
  if (inWrappedTail) {
    const prev = (day + 6) % 7;
    return prev === 0 || prev === 6 ? "closed" : "extended";
  }
  if (day === 0 || day === 6) return "closed";
  if (minutes >= 870 && minutes < 1260) return "regular"; // 14:30 to 21:00
  if (minutes >= 540 && minutes < 870) return "extended"; // 09:00 to 14:30
  if (minutes >= 1260) return "extended"; // 21:00 to midnight
  return "closed";
}

export interface SwapQuoteResult {
  ok: boolean;
  reason?: string;
  session: Session;
  regimeLabel: string;
  mid: number;
  halfSpreadBps: number;
  skewBps: number;
  feeBps: number;
  /** Output amount: tokens on a buy, USDG on a sell. */
  amountOut: number;
  feeAmount: number;
  spreadAmount: number;
  /** Quote-token notional at mid, the unit of the clip. */
  notional: number;
  clip: number;
}

/** Price a swap the way AnchorVault does. `amountIn` is USDG on a buy and tokens on a sell. */
export function quoteSwap(
  market: VaultMarket,
  buyToken: boolean,
  amountIn: number,
  session: Session = currentSession()
): SwapQuoteResult {
  const tier = TIERS[market.tier];
  const regime = REGIMES[session];
  const base: SwapQuoteResult = {
    ok: false,
    session,
    regimeLabel: regime.label,
    mid: market.mid,
    halfSpreadBps: 0,
    skewBps: 0,
    feeBps: FEES.swapFeeBps,
    amountOut: 0,
    feeAmount: 0,
    spreadAmount: 0,
    notional: 0,
    clip: (tier.maxClip * regime.clipMulBps) / 10_000,
  };
  if (!Number.isFinite(amountIn) || amountIn <= 0) return { ...base, reason: "Enter an amount" };

  // Signed skew, positive when the vault is long of the token; the rebalancing side quotes tighter.
  let skew = (tier.maxSkewBps * (market.inventoryRatioBps - 5_000)) / tier.inventoryBandBps;
  skew = Math.max(-tier.maxSkewBps, Math.min(tier.maxSkewBps, skew));
  const half = Math.max(0, (tier.baseHalfSpreadBps * regime.spreadMulBps) / 10_000 + (buyToken ? -skew : skew));
  if (half + FEES.swapFeeBps > tier.oracleBandBps) {
    return { ...base, skewBps: Math.round(skew), reason: "Outside the oracle band" };
  }

  let out: SwapQuoteResult;
  if (buyToken) {
    const feeAmount = (amountIn * FEES.swapFeeBps) / 10_000;
    const net = amountIn - feeAmount;
    const ask = market.mid * (1 + half / 10_000);
    const amountOut = net / ask;
    out = {
      ...base,
      ok: true,
      halfSpreadBps: half,
      skewBps: Math.round(skew),
      amountOut,
      feeAmount,
      spreadAmount: net - amountOut * market.mid,
      notional: amountIn,
    };
  } else {
    const midValue = amountIn * market.mid;
    const bid = market.mid * (1 - half / 10_000);
    const gross = amountIn * bid;
    const feeAmount = (gross * FEES.swapFeeBps) / 10_000;
    out = {
      ...base,
      ok: true,
      halfSpreadBps: half,
      skewBps: Math.round(skew),
      amountOut: gross - feeAmount,
      feeAmount,
      spreadAmount: midValue - gross,
      notional: midValue,
    };
  }
  if (out.notional > out.clip) {
    return { ...out, ok: false, reason: `Above the ${REGIMES[session].label} clip of ${out.clip.toLocaleString("en-US")} ${QUOTE_SYMBOL}` };
  }
  return out;
}

export interface DemoFill {
  minutesAgo: number;
  symbol: string;
  side: "buy" | "sell";
  notional: number;
  venue: "vault" | "rfq";
  /** Distance from the oracle mid at the fill, bps over mid paid by the taker. */
  executionBps: number;
}

/** Recent fills shown in the explorer while the indexer is being wired. */
export const DEMO_FILLS: DemoFill[] = [
  { minutesAgo: 2, symbol: "SPYx", side: "buy", notional: 12_400, venue: "vault", executionBps: 11.9 },
  { minutesAgo: 7, symbol: "NVDAx", side: "sell", notional: 8_150, venue: "vault", executionBps: 12.3 },
  { minutesAgo: 11, symbol: "NVDAx", side: "buy", notional: 46_000, venue: "rfq", executionBps: 9.6 },
  { minutesAgo: 19, symbol: "AAPLx", side: "buy", notional: 3_900, venue: "vault", executionBps: 12.0 },
  { minutesAgo: 24, symbol: "TSLAx", side: "sell", notional: 15_800, venue: "rfq", executionBps: 18.4 },
  { minutesAgo: 31, symbol: "QQQx", side: "buy", notional: 9_240, venue: "vault", executionBps: 11.8 },
  { minutesAgo: 40, symbol: "PLTRx", side: "buy", notional: 1_260, venue: "vault", executionBps: 41.7 },
  { minutesAgo: 52, symbol: "MSFTx", side: "sell", notional: 22_500, venue: "rfq", executionBps: 8.9 },
];

/** Timelocked parameter history shown in the explorer's governance log. */
export const GOVERNANCE_LOG = [
  {
    date: "2026-08-30",
    action: "Markets opened",
    detail: "Tier A vaults for SPYx, QQQx, AAPLx, MSFTx and NVDAx; Tier B for TSLAx and AMZNx; Tier C for PLTRx.",
  },
  {
    date: "2026-08-30",
    action: "Launch parameters set",
    detail: "Tier half-spreads 10/20/40 bps, oracle bands 75/150/300 bps, regime multipliers x1.5 extended and x3 closed, fees 2 bps with a 10% spread share.",
  },
  {
    date: "2026-08-29",
    action: "Protocol deployed",
    detail: "SwapRouter, VaultFactory, RfqSettlement, OracleRouter, EligibilityRegistry and ParamController verified on Blockscout.",
  },
] as const;

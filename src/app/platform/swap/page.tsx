"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp } from "lucide-react";
import { useSession } from "@/components/platform/PlatformProviders";
import { useNow, useVenue } from "@/components/platform/usePlatformData";
import { Badge, Button, Field, Input, LeaderRow, Notice, PageHead, Select, Skeleton, sessionTone } from "@/components/platform/ui";
import { fmtBps, fmtMoney } from "@/lib/platform/format";
import { FEES, QUOTE_SYMBOL, REGIMES, TIERS, currentSession, quoteSwap } from "@/lib/platform/markets";

export default function SwapPage() {
  const { authenticated, login } = useSession();
  const venue = useVenue();
  const now = useNow();
  const session = currentSession(new Date(now));
  const regime = REGIMES[session];

  const markets = useMemo(() => venue.data?.markets ?? [], [venue.data]);
  const [symbol, setSymbol] = useState<string | null>(null);
  const [buyToken, setBuyToken] = useState(true);
  const [amountRaw, setAmountRaw] = useState("10000");
  const [slippageBps, setSlippageBps] = useState(15);

  const market = markets.find((m) => m.symbol === symbol) ?? markets[0];
  const amountIn = Number(amountRaw.replace(/,/g, ""));
  const quote = useMemo(
    () => (market ? quoteSwap(market, buyToken, amountIn, session) : null),
    [market, buyToken, amountIn, session]
  );

  if (venue.loading && !venue.data) {
    return (
      <div className="space-y-8">
        <PageHead code="ZF · 02 · Swap" title="The quote is the invoice" />
        <Skeleton rows={8} />
      </div>
    );
  }
  if (!market || !quote) return null;

  const tier = TIERS[market.tier];
  const minOut = quote.ok ? quote.amountOut * (1 - slippageBps / 10_000) : 0;
  const inSymbol = buyToken ? QUOTE_SYMBOL : market.symbol;
  const outSymbol = buyToken ? market.symbol : QUOTE_SYMBOL;
  const outDigits = buyToken ? 4 : 2;

  return (
    <div className="space-y-8">
      <PageHead
        code="ZF · 02 · Swap"
        title="The quote is the invoice"
        description="Every line on the pass below is the pricing formula in the open. What you sign is what the chain enforces; anything worse than your bound reverts instead of filling."
      />

      {/* The boarding pass */}
      <div className="sheet overflow-hidden">
        <div className="sheet-head">
          <span>Boarding pass · {market.symbol} / {QUOTE_SYMBOL}</span>
          <span className="flex items-center gap-2 normal-case tracking-normal">
            <Badge tone={sessionTone(session)}>
              {regime.label} x{(regime.spreadMulBps / 10_000).toFixed(1)}
            </Badge>
          </span>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px]">
          {/* Main body */}
          <div className="p-5 md:p-7">
            <div className="grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
              <Field label={`You pay · ${inSymbol}`}>
                <Input
                  inputMode="decimal"
                  value={amountRaw}
                  onChange={(e) => setAmountRaw(e.target.value)}
                  placeholder="0.00"
                  className="font-mono text-[17px]"
                />
              </Field>
              <button
                type="button"
                onClick={() => {
                  if (quote.ok) setAmountRaw(quote.amountOut.toFixed(buyToken ? 4 : 2));
                  setBuyToken((v) => !v);
                }}
                aria-label="Flip direction"
                className="cursor-pointer mx-auto mb-1 inline-flex size-10 items-center justify-center rounded-full border border-zf-line-strong bg-zf-cloud text-zf-teal transition-colors hover:border-zf-teal"
              >
                <ArrowDownUp className="size-4" />
              </button>
              <Field label={`You receive · ${outSymbol}`}>
                <Input
                  readOnly
                  value={quote.ok ? fmtMoney(quote.amountOut, "", outDigits) : ""}
                  placeholder="0.00"
                  className="font-mono text-[17px]"
                />
              </Field>
            </div>

            {/* Manifest */}
            <div className="perf mt-6 pt-4">
              <LeaderRow label="Chainlink mid" value={`${fmtMoney(quote.mid)} ${QUOTE_SYMBOL}`} sub="per whole token, guarded" />
              <LeaderRow
                label={`Spread · ${fmtBps(quote.halfSpreadBps)}`}
                value={quote.ok ? `${fmtMoney(quote.spreadAmount)} ${QUOTE_SYMBOL}` : "n/a"}
                sub={`tier ${tier.label} base ${fmtBps(tier.baseHalfSpreadBps)} x ${regime.label.toLowerCase()} ${(regime.spreadMulBps / 10_000).toFixed(1)} · skew ${quote.skewBps >= 0 ? "+" : ""}${quote.skewBps} bps`}
              />
              <LeaderRow
                label={`Protocol fee · ${fmtBps(quote.feeBps)}`}
                value={quote.ok ? `${fmtMoney(quote.feeAmount)} ${QUOTE_SYMBOL}` : "n/a"}
                sub="its own line here, its own field in the fill event"
              />
              <LeaderRow
                label={`Minimum received · ${(slippageBps / 100).toFixed(2)}% bound`}
                value={quote.ok ? `${fmtMoney(minOut, "", outDigits)} ${outSymbol}` : "n/a"}
                sub="below this the swap reverts"
              />
            </div>

            {!quote.ok && quote.reason && (
              <div className="mt-4">
                <Notice tone="warn">{quote.reason}</Notice>
              </div>
            )}
            {session === "closed" && (
              <div className="mt-4">
                <Notice tone="warn">
                  US markets are closed: you are quoting at the x3 weekend spread in half the clip. If this
                  trade can wait for the open, waiting is cheaper, and the venue would rather tell you that.
                </Notice>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              {authenticated ? (
                <Button className="w-full sm:w-auto" disabled>
                  Swap · opening market by market
                </Button>
              ) : (
                <Button className="w-full sm:w-auto" onClick={login}>
                  Sign in to trade
                </Button>
              )}
              <p className="text-[12px] leading-relaxed text-zf-faint">
                {authenticated
                  ? "Web submission is enabled per market during the guarded launch; the ticket prices with the live formula either way."
                  : "Verified traders can be active within minutes."}
              </p>
            </div>
          </div>

          {/* The stub */}
          <aside className="border-t-2 border-dashed border-zf-line-strong bg-zf-cloud/50 p-5 md:p-6 lg:border-l-2 lg:border-t-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zf-faint">Stub · route details</p>

            <div className="mt-4">
              <Field label="Market">
                <Select value={market.symbol} onChange={(e) => setSymbol(e.target.value)}>
                  {markets.map((m) => (
                    <option key={m.symbol} value={m.symbol}>
                      {m.symbol} · {m.name}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Slippage bound">
                <Select value={String(slippageBps)} onChange={(e) => setSlippageBps(Number(e.target.value))}>
                  <option value="10">0.10%</option>
                  <option value="15">0.15%</option>
                  <option value="30">0.30%</option>
                  <option value="50">0.50%</option>
                </Select>
              </Field>
            </div>

            <dl className="mt-6 space-y-2.5 font-mono text-[12px]">
              <div className="flex justify-between">
                <dt className="text-zf-muted">Route</dt>
                <dd className="text-zf-ink">{buyToken ? `${QUOTE_SYMBOL} → ${market.symbol}` : `${market.symbol} → ${QUOTE_SYMBOL}`}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zf-muted">Venue</dt>
                <dd className="text-zf-ink">vault, RFQ if better</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zf-muted">Clip this session</dt>
                <dd className="text-zf-ink">{fmtMoney(quote.clip, QUOTE_SYMBOL, 0)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zf-muted">Oracle band</dt>
                <dd className="text-zf-ink">{fmtBps(tier.oracleBandBps, 0)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zf-muted">RFQ fee</dt>
                <dd className="text-zf-ink">{fmtBps(FEES.rfqFeeBps)}</dd>
              </div>
            </dl>

            <p className="mt-6 border-t border-zf-line pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-zf-faint">
              ZF-4663 · atomic settlement · no custody
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

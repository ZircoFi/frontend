"use client";

import { useSession } from "@/components/platform/PlatformProviders";
import { useNow, useVenue } from "@/components/platform/usePlatformData";
import { Badge, Button, Notice, PageHead, Sheet, Skeleton, Table, Td, Th, sessionTone } from "@/components/platform/ui";
import { fmtBps, fmtCompact } from "@/lib/platform/format";
import { FEES, QUOTE_SYMBOL, REGIMES, TIERS, currentSession } from "@/lib/platform/markets";
import { cn } from "@/lib/utils";

export default function LiquidityPage() {
  const { authenticated, login } = useSession();
  const venue = useVenue();
  const now = useNow();
  const session = currentSession(new Date(now));
  const markets = venue.data?.markets ?? [];

  return (
    <div className="space-y-8">
      <PageHead
        code="ZF · 03 · Liquidity"
        title="Earn the spread, not the arbitrage bill"
        description="Vaults quote around the oracle, so LP revenue is the market's real cost of immediacy rather than what is left after arbitrage. Each vault is an island: you choose the asset, and no other market's losses can reach you."
      />

      <Notice>
        LP participation requires an <span className="font-mono">LP</span> attestation, issued to professional
        clients during the guarded launch. Withdrawal is pro-rata, in kind, and works in every vault state,
        always.
      </Notice>

      <Sheet
        label="Vaults · pick your market"
        meta={
          <span>
            session <Badge tone={sessionTone(session)}>{REGIMES[session].label}</Badge>
          </span>
        }
      >
        {venue.loading && !venue.data ? (
          <Skeleton rows={6} />
        ) : (
          <Table minWidth={760}>
            <thead>
              <tr>
                <Th>Vault</Th>
                <Th>Tier</Th>
                <Th>TVL</Th>
                <Th>Inventory · token share</Th>
                <Th>Base half-spread</Th>
                <Th>LP share of spread</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {markets.map((m) => {
                const tier = TIERS[m.tier];
                const pct = m.inventoryRatioBps / 100;
                const off = Math.abs(m.inventoryRatioBps - 5000);
                return (
                  <tr key={m.symbol} className="transition-colors hover:bg-zf-cloud/50">
                    <Td>
                      <div className="font-mono font-medium text-zf-ink">{m.symbol}</div>
                      <div className="text-[12px] text-zf-faint">{m.name}</div>
                    </Td>
                    <Td>
                      <Badge tone={m.tier === 1 ? "teal" : m.tier === 2 ? "blue" : "peri"}>{tier.label}</Badge>
                    </Td>
                    <Td className="font-mono">{fmtCompact(m.tvl, QUOTE_SYMBOL)}</Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <div className="relative h-2 w-28 overflow-hidden rounded-full bg-zf-mist">
                          {/* Band: 30% to 70% of value */}
                          <div className="absolute inset-y-0 left-[30%] right-[30%] bg-zf-teal/15" />
                          <div
                            className={cn(
                              "absolute inset-y-0 left-0 rounded-full",
                              off > 1500 ? "bg-zf-rose/70" : "bg-zf-teal/80"
                            )}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="font-mono text-[12px] text-zf-slate">{pct.toFixed(1)}%</span>
                      </div>
                    </Td>
                    <Td className="font-mono">{fmtBps(tier.baseHalfSpreadBps)}</Td>
                    <Td className="font-mono text-zf-teal">{100 - FEES.spreadShareBps / 100}%</Td>
                    <Td>
                      {authenticated ? (
                        <Button variant="ghost" className="!px-4 !py-2 text-[13px]" disabled>
                          Deposit soon
                        </Button>
                      ) : (
                        <Button variant="ghost" className="!px-4 !py-2 text-[13px]" onClick={login}>
                          Sign in
                        </Button>
                      )}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
        <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-zf-faint">
          Deposits value at the live mid, so they pause while a market is halted; withdrawals never do.
        </p>
      </Sheet>

      <div className="sheet grid divide-y divide-zf-line overflow-hidden md:grid-cols-3 md:divide-x md:divide-y-0">
        {[
          {
            label: "What you earn",
            body: `The realised spread on every fill your vault makes, minus the protocol's ${FEES.spreadShareBps / 100}% share, accruing into value per share continuously. No emissions, no points.`,
          },
          {
            label: "What you risk",
            body: "Price exposure to the token you chose, weekend gap risk on closed-session fills (charged for through the x3 multiplier), and the issuer risk inside every Stock Token.",
          },
          {
            label: "What you never risk",
            body: "Leverage, liquidation, socialised losses from other markets, or a gate on your exit. Withdrawal is an invariant, not a permission.",
          },
        ].map((c) => (
          <div key={c.label} className="p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zf-teal">{c.label}</p>
            <p className="mt-3 text-[14px] leading-relaxed text-zf-slate">{c.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

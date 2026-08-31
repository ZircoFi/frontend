"use client";

import { useNow, useVenue } from "@/components/platform/usePlatformData";
import { Badge, LeaderRow, PageHead, Sheet, Skeleton, Table, Td, Th, sessionTone } from "@/components/platform/ui";
import { fmtAgo, fmtBps, fmtCompact } from "@/lib/platform/format";
import { FEES, QUOTE_SYMBOL, REGIMES, TIERS, currentSession } from "@/lib/platform/markets";

export default function ExplorerPage() {
  const venue = useVenue();
  const now = useNow();
  const session = currentSession(new Date(now));

  const fills = venue.data?.fills ?? [];
  const governance = venue.data?.governance ?? [];
  const marketCount = venue.data?.markets.length ?? 0;

  return (
    <div className="space-y-8">
      <PageHead
        code="ZF · 05 · Explorer"
        title="Every number is a citation"
        description="Fills with their itemised breakdowns, the parameters in force, and the governance log. Everything rendered here is a pure function of chain events, and the chain always wins."
      />

      <Sheet
        label="Fills · execution vs mid"
        meta={venue.data?.source === "supabase" ? "indexer read model" : "indicative until the indexer lands"}
      >
        {venue.loading && !venue.data ? (
          <Skeleton rows={8} />
        ) : (
          <Table minWidth={680}>
            <thead>
              <tr>
                <Th>When</Th>
                <Th>Market</Th>
                <Th>Side</Th>
                <Th>Notional</Th>
                <Th>Venue</Th>
                <Th className="text-right">Paid over mid</Th>
              </tr>
            </thead>
            <tbody>
              {fills.map((f, i) => (
                <tr key={i} className="transition-colors hover:bg-zf-cloud/50">
                  <Td className="font-mono text-zf-faint">{fmtAgo(f.minutesAgo)}</Td>
                  <Td className="font-mono font-medium text-zf-ink">{f.symbol}</Td>
                  <Td>
                    <Badge tone={f.side === "buy" ? "teal" : "blue"}>{f.side}</Badge>
                  </Td>
                  <Td className="font-mono">{fmtCompact(f.notional, QUOTE_SYMBOL)}</Td>
                  <Td>
                    <Badge tone={f.venue === "vault" ? "muted" : "peri"}>{f.venue}</Badge>
                  </Td>
                  <Td className="text-right font-mono text-zf-teal">{fmtBps(f.executionBps)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-zf-faint">
          Published for every fill, unfiltered, the expensive closed-session ones included.
        </p>
      </Sheet>

      <div className="grid gap-6 lg:grid-cols-2">
        <Sheet label="Parameters · in force now" meta="timelocked, rationale published">
          {( [1, 2, 3] as const ).map((t) => (
            <div key={t} className="mb-1 flex items-baseline gap-3">
              <Badge tone={t === 1 ? "teal" : t === 2 ? "blue" : "peri"}>{TIERS[t].label}</Badge>
              <div className="min-w-0 flex-1">
                <LeaderRow
                  label={`half-spread ${fmtBps(TIERS[t].baseHalfSpreadBps)}`}
                  value={`band ${fmtBps(TIERS[t].oracleBandBps, 0)} · clip ${fmtCompact(TIERS[t].maxClip, QUOTE_SYMBOL)}`}
                />
              </div>
            </div>
          ))}
          <div className="perf mt-4 pt-3">
            <LeaderRow label="session now" value={REGIMES[session].label} />
            <LeaderRow label="regime multipliers" value="extended x1.5 · closed x3.0" />
            <LeaderRow
              label="fees"
              value={`swap ${fmtBps(FEES.swapFeeBps)} · rfq ${fmtBps(FEES.rfqFeeBps)} · share ${FEES.spreadShareBps / 100}%`}
            />
            <LeaderRow label="markets live" value={String(marketCount)} />
          </div>
          <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-zf-faint">
            Session badge: <Badge tone={sessionTone(session)}>{REGIMES[session].label}</Badge>
          </p>
        </Sheet>

        <Sheet label="Governance log · every change, before it bites" meta="no fund access, ever">
          <ol className="space-y-4">
            {governance.map((entry) => (
              <li key={entry.date + entry.action} className="border-l-2 border-zf-teal/40 pl-4">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[14px] font-medium text-zf-ink">{entry.action}</span>
                  <span className="font-mono text-[11px] text-zf-faint">{entry.date}</span>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-zf-muted">{entry.detail}</p>
              </li>
            ))}
          </ol>
        </Sheet>
      </div>
    </div>
  );
}

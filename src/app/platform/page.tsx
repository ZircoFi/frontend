"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSession } from "@/components/platform/PlatformProviders";
import { useNow, useVenue } from "@/components/platform/usePlatformData";
import { Badge, PageHead, Sheet, Skeleton, StatBand, StatCard, Table, Td, Th, sessionTone } from "@/components/platform/ui";
import { fmtBps, fmtCompact, fmtMoney } from "@/lib/platform/format";
import { FEES, QUOTE_SYMBOL, REGIMES, TIERS, currentSession, quoteSwap } from "@/lib/platform/markets";

export default function OverviewPage() {
  const { authenticated, login } = useSession();
  const venue = useVenue();
  const now = useNow();
  const session = currentSession(new Date(now));
  const regime = REGIMES[session];

  const markets = venue.data?.markets ?? [];
  const tvl = markets.reduce((acc, m) => acc + m.tvl, 0);
  const volume = markets.reduce((acc, m) => acc + m.volume24h, 0);

  return (
    <div className="space-y-8">
      <PageHead
        code="ZF · 01 · Overview"
        title="The venue, live"
        description="Every market quotes around the guarded Chainlink mid with the session, spread and fee in the open. Prices are a formula over public state; this page just renders it."
        action={
          !authenticated ? (
            <button type="button" onClick={login} className="cursor-pointer btn btn-primary">
              Sign in to trade
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          ) : (
            <Link href="/platform/swap" className="btn btn-primary">
              Open the ticket
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          )
        }
      />

      <StatBand>
        <StatCard label="Vault TVL" value={fmtCompact(tvl, QUOTE_SYMBOL)} hint={`${markets.length} markets live`} />
        <StatCard label="24h volume" value={fmtCompact(volume, QUOTE_SYMBOL)} hint="vault and RFQ together" accent="teal" />
        <StatCard
          label="Session"
          value={regime.label}
          hint={`spreads x${(regime.spreadMulBps / 10_000).toFixed(1)} · clips x${(regime.clipMulBps / 10_000).toFixed(2)}`}
        />
        <StatCard label="Protocol fee" value={fmtBps(FEES.swapFeeBps)} hint={`plus ${FEES.spreadShareBps / 100}% of realised spread`} />
      </StatBand>

      <Sheet
        label="Markets · anchor vaults"
        meta={
          <span>
            {venue.data?.source === "supabase" ? "indexer read model" : "indicative catalogue"} ·{" "}
            <Badge tone={sessionTone(session)}>{regime.label}</Badge>
          </span>
        }
      >
        {venue.loading && !venue.data ? (
          <Skeleton rows={6} />
        ) : (
          <Table minWidth={720}>
            <thead>
              <tr>
                <Th>Market</Th>
                <Th>Tier</Th>
                <Th>Mid</Th>
                <Th>Buy half-spread</Th>
                <Th>Clip now</Th>
                <Th>24h volume</Th>
                <Th className="text-right">TVL</Th>
              </tr>
            </thead>
            <tbody>
              {markets.map((m) => {
                const q = quoteSwap(m, true, 1_000, session);
                return (
                  <tr key={m.symbol} className="transition-colors hover:bg-zf-cloud/50">
                    <Td>
                      <div className="font-mono font-medium text-zf-ink">{m.symbol}</div>
                      <div className="text-[12px] text-zf-faint">{m.name}</div>
                    </Td>
                    <Td>
                      <Badge tone={m.tier === 1 ? "teal" : m.tier === 2 ? "blue" : "peri"}>{TIERS[m.tier].label}</Badge>
                    </Td>
                    <Td className="font-mono">{fmtMoney(m.mid, QUOTE_SYMBOL)}</Td>
                    <Td className="font-mono text-zf-teal">{fmtBps(q.halfSpreadBps)}</Td>
                    <Td className="font-mono">{fmtCompact(q.clip, QUOTE_SYMBOL)}</Td>
                    <Td className="font-mono">{fmtCompact(m.volume24h, QUOTE_SYMBOL)}</Td>
                    <Td className="text-right font-mono">{fmtCompact(m.tvl, QUOTE_SYMBOL)}</Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
        <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-zf-faint">
          The half-spread shown is a buy right now: tier base x session multiplier, adjusted by inventory skew.
        </p>
      </Sheet>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { href: "/platform/swap", code: "02", title: "Swap", body: "Mid, spread and fee as separate lines, session on the face of the ticket." },
          { href: "/platform/liquidity", code: "03", title: "Liquidity", body: "Fund a vault, earn the spread. Withdrawal works in every state." },
          { href: "/platform/explorer", code: "05", title: "Explorer", body: "Fills with their breakdowns, parameters in force, the governance log." },
        ].map((c) => (
          <Link key={c.href} href={c.href} className="sheet group flex items-start justify-between gap-4 p-5 transition-colors hover:border-zf-teal/50">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zf-teal">ZF · {c.code}</p>
              <h3 className="mt-1.5 font-heading text-lg font-medium text-zf-ink">{c.title}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-zf-muted">{c.body}</p>
            </div>
            <ArrowRight className="mt-1 size-4 shrink-0 text-zf-faint transition-transform group-hover:translate-x-1 group-hover:text-zf-teal" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </div>
  );
}

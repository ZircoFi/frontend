"use client";

import Link from "next/link";
import { useSession } from "@/components/platform/PlatformProviders";
import { RequireAuth } from "@/components/platform/PlatformShell";
import { useAsync, useNow } from "@/components/platform/usePlatformData";
import { Badge, EmptyState, Notice, PageHead, Sheet, Skeleton, Table, Td, Th } from "@/components/platform/ui";
import { getMyAttestations, getWalletFills } from "@/lib/platform/queries";
import { fmtAgo, fmtBps, fmtCompact, fmtDate, shortAddress } from "@/lib/platform/format";
import { QUOTE_SYMBOL } from "@/lib/platform/markets";
import { platformEnv } from "@/lib/platform/env";

export default function PortfolioPage() {
  return (
    <div className="space-y-8">
      <PageHead
        code="ZF · 04 · Portfolio"
        title="Your holdings, from the chain"
        description={`Balances, LP positions and fill history are read from ${platformEnv.chainName} and valued with the same guarded oracles the vaults quote from. Nothing here comes from a private ledger.`}
      />
      <RequireAuth title="Sign in to see your portfolio">
        <Portfolio />
      </RequireAuth>
    </div>
  );
}

const ROLES = ["TRADER", "LP", "MAKER", "RELAYER"] as const;

function Portfolio() {
  const { api, db, userId, walletAddress } = useSession();
  const fills = useAsync(
    () => (walletAddress ? getWalletFills(db, walletAddress) : Promise.resolve([])),
    [db, walletAddress]
  );
  const attestations = useAsync(() => getMyAttestations(api), [api, userId]);
  const now = useNow();

  return (
    <div className="space-y-6">
      <Notice>
        Connected as <span className="font-mono">{shortAddress(walletAddress)}</span>. Balance indexing is being
        wired to the venue indexer during the guarded launch; until it lands, your authoritative record is the
        chain itself. The trade history and attestations below read the venue&apos;s public read model.
      </Notice>

      <div className="grid gap-6 lg:grid-cols-2">
        <Sheet label="Holdings · tokens and USDG" meta="token and share terms">
          <EmptyState
            title="No indexed holdings yet"
            body="Once the indexer connects, balances for this wallet appear here automatically. Swaps you settle are on-chain immediately either way."
            action={
              <Link href="/platform/swap" className="btn btn-primary text-sm">
                Make your first swap
              </Link>
            }
          />
        </Sheet>

        <Sheet label="LP positions · vault shares" meta="value per share, accrued spread">
          <EmptyState
            title="No vault shares detected"
            body="Fund a vault from the Liquidity page to start earning the spread. Shares are transferable only between attested LPs, and withdrawal always works."
            action={
              <Link href="/platform/liquidity" className="btn btn-ghost text-sm">
                Browse vaults
              </Link>
            }
          />
        </Sheet>
      </div>

      <Sheet label="Trade history · this wallet" meta="from the venue read model">
        {fills.loading && !fills.data ? (
          <Skeleton rows={5} />
        ) : !fills.data || fills.data.length === 0 ? (
          <EmptyState
            title="No fills from this wallet yet"
            body="Swaps you settle appear here with their full breakdown: mid, spread, skew and fee, exactly as the fill event records them."
            action={
              <Link href="/platform/swap" className="btn btn-primary text-sm">
                Make your first swap
              </Link>
            }
          />
        ) : (
          <>
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
                {fills.data.map((f) => (
                  <tr key={f.id} className="transition-colors hover:bg-zf-cloud/50">
                    <Td className="font-mono text-zf-faint">
                      {fmtAgo(Math.max(0, (now - new Date(f.executed_at).getTime()) / 60_000))}
                    </Td>
                    <Td className="font-mono font-medium text-zf-ink">{f.markets?.symbol ?? "?"}</Td>
                    <Td>
                      <Badge tone={f.side === "buy" ? "teal" : "blue"}>{f.side}</Badge>
                    </Td>
                    <Td className="font-mono">{fmtCompact(f.notional, QUOTE_SYMBOL)}</Td>
                    <Td>
                      <Badge tone={f.venue === "vault" ? "muted" : "peri"}>{f.venue}</Badge>
                    </Td>
                    <Td className="text-right font-mono text-zf-teal">{fmtBps(f.half_spread_bps + f.fee_bps)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-zf-faint">
              Every fill, with the same itemised breakdown the public explorer shows.
            </p>
          </>
        )}
      </Sheet>

      <Sheet label="Eligibility · role attestations" meta="TRADER · LP · MAKER · RELAYER">
        {attestations.loading && !attestations.data ? (
          <Skeleton rows={2} />
        ) : (
          <div className="flex flex-wrap gap-2">
            {ROLES.map((role) => {
              const a = attestations.data?.find(
                (x) => x.role === role && x.status === "active" && new Date(x.expires_at) > new Date()
              );
              return (
                <div
                  key={role}
                  className="flex items-center gap-2.5 rounded-lg border border-zf-line bg-zf-cloud/40 px-3 py-2"
                >
                  <span className="font-mono text-[12px] text-zf-ink">{role}</span>
                  <Badge tone={a ? "teal" : "muted"}>{a ? `active · ${fmtDate(a.expires_at)}` : "not issued"}</Badge>
                </div>
              );
            })}
          </div>
        )}
        <p className="mt-4 text-[13px] leading-relaxed text-zf-muted">
          Trading, providing liquidity and making markets each require a role attestation. Manage them in
          Settings; withdrawal from a vault never requires one.
        </p>
        <Link href="/platform/settings" className="btn btn-ghost mt-4 text-sm">
          Open Settings
        </Link>
      </Sheet>
    </div>
  );
}

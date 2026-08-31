"use client";

import Link from "next/link";
import { useSession } from "@/components/platform/PlatformProviders";
import { RequireAuth } from "@/components/platform/PlatformShell";
import { EmptyState, Notice, PageHead, Sheet } from "@/components/platform/ui";
import { shortAddress } from "@/lib/platform/format";
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

function Portfolio() {
  const { walletAddress } = useSession();
  return (
    <div className="space-y-6">
      <Notice>
        Connected as <span className="font-mono">{shortAddress(walletAddress)}</span>. Portfolio indexing is
        being wired to the venue indexer during the guarded launch; until it lands, your authoritative record
        is the chain itself, and every balance is visible on Blockscout.
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

      <Sheet label="Eligibility · role attestations" meta="TRADER · LP · MAKER · RELAYER">
        <p className="text-[14px] leading-relaxed text-zf-muted">
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

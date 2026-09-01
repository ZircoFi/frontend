"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/components/platform/PlatformProviders";
import { RequireAuth } from "@/components/platform/PlatformShell";
import { useAsync } from "@/components/platform/usePlatformData";
import { Badge, Button, Field, Input, Notice, PageHead, Sheet, Skeleton } from "@/components/platform/ui";
import { getMyAttestations, upsertProfile } from "@/lib/platform/queries";
import { fmtDate, friendlyError } from "@/lib/platform/format";
import { platformEnv } from "@/lib/platform/env";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHead code="ZF · 06 · Settings" title="Account and eligibility" />
      <RequireAuth title="Sign in to manage your account">
        <Settings />
      </RequireAuth>
    </div>
  );
}

const ROLES = ["TRADER", "LP", "MAKER", "RELAYER"] as const;

const ROLE_HINTS: Record<(typeof ROLES)[number], string> = {
  TRADER: "Swap on the venue",
  LP: "Fund vaults and hold vault shares",
  MAKER: "Quote through the RFQ lane",
  RELAYER: "Submit swaps on behalf of users",
};

function Settings() {
  const { api, userId, walletAddress, email, profile, refreshProfile } = useSession();
  const attestations = useAsync(() => getMyAttestations(api), [api, userId]);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDisplayName(profile?.display_name ?? "");
  }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    setError(null);
    setMsg(null);
    try {
      await upsertProfile(api, { display_name: displayName || null, wallet_address: walletAddress, email });
      await refreshProfile();
      setMsg("Profile saved.");
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Sheet label="Profile · your account" meta="private to you">
        <form onSubmit={save} className="space-y-4">
          <Field label="Display name" hint="Shown only to you. Addresses stay addresses on the public explorer.">
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Optional" />
          </Field>
          <Field label="Wallet">
            <Input value={walletAddress ?? ""} readOnly className="font-mono" />
          </Field>
          <Field label="Email">
            <Input value={email ?? ""} readOnly />
          </Field>
          <Field label="User id">
            <Input value={userId ?? ""} readOnly className="font-mono text-[12px]" />
          </Field>
          {msg && <Notice>{msg}</Notice>}
          {error && <Notice tone="error">{error}</Notice>}
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </form>
      </Sheet>

      <Sheet label="Eligibility · attestations for this wallet" meta="no personal data on-chain">
        <p className="mb-4 text-[13px] leading-relaxed text-zf-muted">
          Issued by the KYC provider after identity, sanctions and residency checks. The registry holds role,
          jurisdiction class and expiry only.
        </p>
        {attestations.loading && !attestations.data ? (
          <Skeleton rows={4} />
        ) : (
          <ul className="space-y-2">
            {ROLES.map((role) => {
              const a = attestations.data?.find((x) => x.role === role && x.status === "active" && new Date(x.expires_at) > new Date());
              return (
                <li key={role} className="flex items-center justify-between rounded-lg border border-zf-line bg-zf-cloud/40 px-3 py-2.5">
                  <div>
                    <div className="font-mono text-[12px] text-zf-ink">{role}</div>
                    <div className="text-[11px] text-zf-faint">
                      {a
                        ? `${a.jurisdiction_class ?? "?"} · class ${a.investor_class ?? "?"} · expires ${fmtDate(a.expires_at)}`
                        : ROLE_HINTS[role]}
                    </div>
                  </div>
                  <Badge tone={a ? "teal" : "muted"}>{a ? "active" : "not issued"}</Badge>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-4 text-[12px] text-zf-faint">
          Attestations are mirrored on-chain in the EligibilityRegistry on {platformEnv.chainName}. Withdrawal
          from a vault never requires one. Contact the team to start onboarding.
        </p>
      </Sheet>
    </div>
  );
}

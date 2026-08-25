"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { PrivyProvider, usePrivy, useWallets } from "@privy-io/react-auth";
import { platformEnv } from "@/lib/platform/env";
import { robinhoodChain } from "@/lib/platform/chain";
import { createAnonClient, type PlatformClient } from "@/lib/platform/supabase";
import { getProfile, upsertProfile, type PlatformApi } from "@/lib/platform/queries";
import { friendlyError } from "@/lib/platform/format";
import type { Profile } from "@/lib/platform/types";

interface SessionState {
  ready: boolean;
  authenticated: boolean;
  userId: string | null;
  walletAddress: string | null;
  email: string | null;
  profile: Profile | null;
  /** Anonymous Supabase client for public reads. */
  db: PlatformClient;
  /** Authenticated operations, executed server-side as the signed-in user. */
  api: PlatformApi;
  login: () => void;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  sessionError: string | null;
}

const SessionContext = createContext<SessionState | null>(null);

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside PlatformProviders");
  return ctx;
}

function SessionProvider({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, user, login, logout, getAccessToken } = usePrivy();
  const { wallets } = useWallets();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const walletAddress = useMemo(() => {
    const embedded = wallets.find((w) => w.walletClientType === "privy");
    return (embedded ?? wallets[0])?.address ?? user?.wallet?.address ?? null;
  }, [wallets, user]);
  const email = user?.email?.address ?? null;

  const db = useMemo(() => createAnonClient(), []);

  const api = useCallback<PlatformApi>(
    async (op, args) => {
      const token = authenticated ? await getAccessToken() : null;
      if (!token) throw new Error("Sign in to continue.");
      const res = await fetch("/api/platform/db", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ op, args: args ?? {} }),
      });
      const body = (await res.json().catch(() => ({}))) as { data?: unknown; error?: string };
      if (!res.ok) throw new Error(body.error ?? `Request failed (${res.status})`);
      return body.data as never;
    },
    [authenticated, getAccessToken]
  );

  const refreshProfile = useCallback(async () => {
    if (!authenticated || !user) return;
    try {
      const existing = await getProfile(api);
      const next = await upsertProfile(api, {
        wallet_address: walletAddress ?? existing?.wallet_address ?? null,
        email: email ?? existing?.email ?? null,
        display_name: existing?.display_name ?? null,
      });
      setProfile(next);
      setSessionError(null);
    } catch (e) {
      setSessionError(friendlyError(e, "Could not load profile"));
    }
  }, [authenticated, user, api, walletAddress, email]);

  useEffect(() => {
    // Deferred so the profile sync never sets state synchronously inside the effect.
    const t = setTimeout(() => void refreshProfile(), 0);
    return () => clearTimeout(t);
  }, [refreshProfile]);

  const value = useMemo<SessionState>(
    () => ({
      ready,
      authenticated,
      userId: user?.id ?? null,
      walletAddress,
      email,
      profile: authenticated ? profile : null,
      db,
      api,
      login,
      logout,
      refreshProfile,
      sessionError,
    }),
    [ready, authenticated, user, walletAddress, email, profile, db, api, login, logout, refreshProfile, sessionError]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

const noopSubscribe = () => () => {};

/** True after hydration. Privy only runs in the browser, so the provider is mounted client-side only. */
function useIsClient(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function PlatformProviders({ children }: { children: React.ReactNode }) {
  const isClient = useIsClient();
  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background" aria-busy="true">
        <div className="size-10 animate-pulse rounded-full bg-zf-sky/40 blur-md" />
      </div>
    );
  }
  return (
    <PrivyProvider
      appId={platformEnv.privyAppId}
      config={{
        loginMethods: ["email", "wallet", "google"],
        appearance: {
          theme: "light",
          accentColor: "#0e8f86",
          logo: "/images/logo-mark.png",
          walletChainType: "ethereum-only",
        },
        embeddedWallets: { ethereum: { createOnLogin: "users-without-wallets" } },
        defaultChain: robinhoodChain,
        supportedChains: [robinhoodChain],
      }}
    >
      <SessionProvider>{children}</SessionProvider>
    </PrivyProvider>
  );
}

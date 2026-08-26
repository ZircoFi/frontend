"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowRightLeft, Briefcase, Droplets, LayoutDashboard, LogOut, Search, Settings } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useSession } from "./PlatformProviders";
import { useNow } from "./usePlatformData";
import { shortAddress } from "@/lib/platform/format";
import { platformEnv } from "@/lib/platform/env";
import { FEES, REGIMES, currentSession } from "@/lib/platform/markets";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/platform", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/platform/swap", label: "Swap", icon: ArrowRightLeft },
  { href: "/platform/liquidity", label: "Liquidity", icon: Droplets },
  { href: "/platform/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/platform/explorer", label: "Explorer", icon: Search },
  { href: "/platform/settings", label: "Settings", icon: Settings },
] as const;

export function PlatformShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { ready, authenticated, walletAddress, email, login, logout, sessionError } = useSession();
  const now = useNow();
  const session = currentSession(new Date(now));
  const regime = REGIMES[session];

  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  const account = !ready ? (
    <div className="h-9 w-32 animate-pulse rounded-full bg-zf-mist" />
  ) : authenticated ? (
    <div className="flex items-center gap-2">
      <div className="hidden items-center gap-2 rounded-full border border-zf-line-strong bg-white py-1.5 pl-3.5 pr-2 sm:flex">
        <span className="size-1.5 rounded-full bg-zf-teal" aria-hidden="true" />
        <span className="font-mono text-[12px] text-zf-ink">{shortAddress(walletAddress)}</span>
        {email && <span className="hidden text-[11px] text-zf-faint md:inline">{email}</span>}
        <button
          type="button"
          onClick={() => void logout()}
          aria-label="Sign out"
          className="cursor-pointer ml-1 inline-flex size-6 items-center justify-center rounded-full text-zf-muted transition-colors hover:bg-zf-mist hover:text-zf-ink"
        >
          <LogOut className="size-3.5" />
        </button>
      </div>
      <button
        type="button"
        onClick={() => void logout()}
        aria-label="Sign out"
        className="cursor-pointer inline-flex size-9 items-center justify-center rounded-full border border-zf-line-strong text-zf-muted sm:hidden"
      >
        <LogOut className="size-4" />
      </button>
    </div>
  ) : (
    <button type="button" onClick={login} className="cursor-pointer btn btn-primary !py-2.5 text-sm">
      Sign in
      <ArrowRight className="size-4" aria-hidden="true" />
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar: identity left, segmented nav centre, account right */}
      <header className="border-b border-zf-line bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Logo size={28} />
          </div>

          <nav aria-label="Platform" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full border border-zf-line-strong bg-zf-cloud p-1">
              {NAV.map((item) => {
                const active = isActive(item.href, "exact" in item && item.exact);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] transition-colors",
                        active ? "bg-zf-ink text-white" : "text-zf-slate hover:bg-white hover:text-zf-ink"
                      )}
                    >
                      <item.icon className="size-3.5" aria-hidden="true" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {account}
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 pb-32 pt-8 md:px-8 lg:pb-12">
        {sessionError && (
          <div className="mb-6 rounded-lg border-l-2 border-zf-rose bg-zf-rose/8 py-2.5 pl-4 pr-3 text-[13px] text-zf-rose">
            {sessionError}
          </div>
        )}
        {children}
      </main>

      {/* Mobile dock */}
      <nav
        aria-label="Platform"
        className="fixed inset-x-4 bottom-4 z-40 rounded-2xl border border-zf-line-strong bg-white/95 shadow-[0_18px_40px_-18px_rgb(13_27_51/0.35)] backdrop-blur-xl lg:hidden"
      >
        <ul className="flex items-stretch justify-around px-1 py-1.5">
          {NAV.map((item) => {
            const active = isActive(item.href, "exact" in item && item.exact);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl px-2.5 py-1.5 transition-colors",
                    active ? "bg-zf-ink text-white" : "text-zf-muted hover:text-zf-ink"
                  )}
                >
                  <item.icon className="size-4" aria-hidden="true" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.08em]">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

/** Gate that asks the visitor to sign in before showing account-specific content. */
export function RequireAuth({ children, title, body }: { children: React.ReactNode; title?: string; body?: string }) {
  const { ready, authenticated, login } = useSession();
  if (!ready) return <div className="h-40 animate-pulse rounded-2xl bg-zf-mist" />;
  if (!authenticated) {
    return (
      <div className="sheet overflow-hidden">
        <div className="sheet-head">
          <span>Sign in required</span>
          <span>ZF · access</span>
        </div>
        <div className="flex flex-col items-start gap-4 p-7">
          <h2 className="font-heading text-2xl font-medium text-zf-ink">{title ?? "Sign in to continue"}</h2>
          <p className="max-w-xl text-[14px] leading-relaxed text-zf-muted">
            {body ?? "Use your email, a social account or any EVM wallet. A wallet on Robinhood Chain is created for you if you do not have one, and it is the address your swaps settle to."}
          </p>
          <button type="button" onClick={login} className="cursor-pointer btn btn-primary">
            Sign in
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

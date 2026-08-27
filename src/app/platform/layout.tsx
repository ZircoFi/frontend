import type { Metadata } from "next";
import { PlatformProviders } from "@/components/platform/PlatformProviders";
import { PlatformShell } from "@/components/platform/PlatformShell";
import { SetupNotice } from "@/components/platform/SetupNotice";
import { missingPlatformEnv } from "@/lib/platform/env";

export const metadata: Metadata = {
  title: "Platform",
  description: "Swap tokenized stocks against USDG at oracle-anchored prices, or fund a vault and earn the spread, on Robinhood Chain.",
  robots: { index: false, follow: false },
};

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const missing = missingPlatformEnv();
  if (missing.length > 0) return <SetupNotice missing={missing} />;
  return (
    <PlatformProviders>
      <PlatformShell>{children}</PlatformShell>
    </PlatformProviders>
  );
}

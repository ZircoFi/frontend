/** Public runtime configuration for the platform. Everything else comes from Supabase. */
export const platformEnv = {
  privyAppId: process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 4663),
  chainName: process.env.NEXT_PUBLIC_CHAIN_NAME ?? "Robinhood Chain",
  chainRpc: process.env.NEXT_PUBLIC_CHAIN_RPC ?? "",
  chainExplorer: process.env.NEXT_PUBLIC_CHAIN_EXPLORER ?? "",
};

export function missingPlatformEnv(): string[] {
  const missing: string[] = [];
  if (!platformEnv.privyAppId) missing.push("NEXT_PUBLIC_PRIVY_APP_ID");
  if (!platformEnv.supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!platformEnv.supabaseAnonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return missing;
}

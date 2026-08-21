import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { platformEnv } from "./env";

export type PlatformClient = SupabaseClient;

/**
 * Browser client carrying a Supabase JWT from `getToken`. Kept for deployments that issue Supabase JWTs;
 * the platform itself reads publicly with `createAnonClient` and writes through the API route.
 */
export function createPlatformClient(getToken: () => Promise<string | null>): PlatformClient {
  return createClient(platformEnv.supabaseUrl, platformEnv.supabaseAnonKey, {
    accessToken: getToken,
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

/** Anonymous client for public reads (explorer, order book) before sign-in. */
export function createAnonClient(): PlatformClient {
  return createClient(platformEnv.supabaseUrl, platformEnv.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

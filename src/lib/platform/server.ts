import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { PrivyClient } from "@privy-io/server-auth";

/** Header the database reads to learn which user a service-role request is acting for (see app_user_id()). */
export const ACTOR_HEADER = "x-zircofi-actor";

export class ApiError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

/** Verify the Privy access token on an incoming request and return the Privy user id. */
export async function verifyPrivyRequest(req: Request): Promise<string> {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const appSecret = process.env.PRIVY_APP_SECRET;
  if (!appId || !appSecret) throw new ApiError("Server is missing NEXT_PUBLIC_PRIVY_APP_ID or PRIVY_APP_SECRET.", 500);

  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) throw new ApiError("Missing bearer token", 401);

  try {
    const claims = await new PrivyClient(appId, appSecret).verifyAuthToken(token);
    return claims.userId;
  } catch {
    throw new ApiError("Invalid or expired Privy token", 401);
  }
}

/**
 * Service-role Supabase client acting on behalf of `actorId`. The actor id travels as a request header that
 * `app_user_id()` trusts only when the JWT role is `service_role`, so the security-definer functions and
 * ownership checks in the schema see the real user.
 */
export function createServiceClient(actorId: string): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new ApiError("Server is missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.", 500);
  assertServiceRoleKey(key);
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { [ACTOR_HEADER]: actorId } },
  });
}

/**
 * Fail fast with a clear message when the configured key is not a service-role key. Supabase issues two
 * shapes: legacy JWT keys (whose payload carries `role`) and the newer `sb_secret_...` / `sb_publishable_...`
 * keys. The anon or publishable key would silently run under row-level security and every write would fail.
 */
function assertServiceRoleKey(key: string) {
  if (key.startsWith("sb_secret_")) return;
  if (key.startsWith("sb_publishable_")) {
    throw new ApiError("SUPABASE_SERVICE_ROLE_KEY is a publishable key. Use the secret (service role) key from Project Settings > API keys.", 500);
  }
  if (key.startsWith("eyJ")) {
    try {
      const payload = JSON.parse(Buffer.from(key.split(".")[1] ?? "", "base64url").toString("utf8")) as { role?: string };
      if (payload.role === "service_role") return;
      throw new ApiError(
        `SUPABASE_SERVICE_ROLE_KEY has role "${payload.role ?? "unknown"}", not service_role. Use the service_role key from Project Settings > API keys.`,
        500
      );
    } catch (e) {
      if (e instanceof ApiError) throw e;
      throw new ApiError("SUPABASE_SERVICE_ROLE_KEY is not a valid Supabase key.", 500);
    }
  }
  throw new ApiError("SUPABASE_SERVICE_ROLE_KEY does not look like a Supabase service-role key.", 500);
}

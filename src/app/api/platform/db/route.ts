import { NextResponse } from "next/server";
import { ops, type OpName } from "@/lib/platform/ops";
import { ApiError, createServiceClient, verifyPrivyRequest } from "@/lib/platform/server";

export const runtime = "nodejs";

/**
 * Authenticated data operations for the platform.
 *
 * The browser sends its Privy access token; the route verifies it, then runs the requested operation with a
 * service-role Supabase client that carries the verified user id as the acting user. Public reads never come
 * through here: the browser reads the order book, loans and configuration directly with the anon key.
 */
export async function POST(req: Request) {
  try {
    const actor = await verifyPrivyRequest(req);
    const body = (await req.json().catch(() => null)) as { op?: string; args?: Record<string, unknown> } | null;
    const op = body?.op;
    if (!op || !(op in ops)) return NextResponse.json({ error: "Unknown operation" }, { status: 400 });

    const db = createServiceClient(actor);
    const data = await ops[op as OpName](db, actor, body?.args ?? {});
    return NextResponse.json({ data });
  } catch (e) {
    const status = e instanceof ApiError ? e.status : 400;
    const message = e instanceof Error ? e.message : "Request failed";
    return NextResponse.json({ error: message }, { status });
  }
}

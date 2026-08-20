export function fmtMoney(v: number | string | null | undefined, symbol = "", digits = 2): string {
  const n = typeof v === "string" ? Number(v) : (v ?? 0);
  if (!Number.isFinite(n)) return "n/a";
  const s = n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
  return symbol ? `${s} ${symbol}` : s;
}

export function fmtCompact(v: number | string | null | undefined, symbol = ""): string {
  const n = typeof v === "string" ? Number(v) : (v ?? 0);
  if (!Number.isFinite(n)) return "n/a";
  const s = n.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2 });
  return symbol ? `${s} ${symbol}` : s;
}

export function fmtBps(bps: number | null | undefined, digits = 1): string {
  if (bps === null || bps === undefined || !Number.isFinite(bps)) return "n/a";
  return `${bps.toFixed(digits)} bps`;
}

export function shortAddress(a: string | null | undefined): string {
  if (!a) return "unknown";
  return a.length > 12 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a;
}

export function fmtDate(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function fmtAgo(minutes: number): string {
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${Math.round(minutes)}m ago`;
  const h = Math.floor(minutes / 60);
  return `${h}h ${Math.round(minutes % 60)}m ago`;
}

/** Turns thrown values into a short, readable message. Detects HTML bodies from a misconfigured backend. */
export function friendlyError(e: unknown, fallback = "Something went wrong"): string {
  const raw = e instanceof Error ? e.message : typeof e === "string" ? e : "";
  if (!raw) return fallback;
  if (/<!doctype|<html/i.test(raw)) {
    return "The data service returned a web page instead of JSON. Check NEXT_PUBLIC_SUPABASE_URL and that the schema has been applied.";
  }
  if (/failed to fetch|networkerror|load failed/i.test(raw)) {
    return "Could not reach the data service. Check NEXT_PUBLIC_SUPABASE_URL and your network connection.";
  }
  return raw.length > 240 ? `${raw.slice(0, 240)}…` : raw;
}

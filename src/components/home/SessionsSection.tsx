import { cn } from "@/lib/utils";

/**
 * A weekday on the venue, drawn to scale in UTC. Segment widths are minutes / 1440.
 * Schedule: 00:00-01:00 extended tail, 01:00-09:00 closed, 09:00-14:30 extended,
 * 14:30-21:00 regular, 21:00-24:00 extended.
 */
const DAY = [
  { session: "extended", from: "00:00", minutes: 60 },
  { session: "closed", from: "01:00", minutes: 480 },
  { session: "extended", from: "09:00", minutes: 330 },
  { session: "regular", from: "14:30", minutes: 390 },
  { session: "extended", from: "21:00", minutes: 180 },
] as const;

const LEGEND = [
  { session: "regular", label: "OPEN", spread: "×1.0 spread", clip: "full clip" },
  { session: "extended", label: "EXTENDED", spread: "×1.5 spread", clip: "×0.75 clip" },
  { session: "closed", label: "CLOSED", spread: "×3.0 spread", clip: "×0.5 clip" },
] as const;

const HALTS = [
  { trigger: "Feed older than the session's staleness bound", clears: "a fresh oracle round" },
  { trigger: "Corporate action: the feed reports oraclePaused()", clears: "the feed resuming" },
  { trigger: "A single round moves more than 25%", clears: "timelocked review, published" },
  { trigger: "Sequencer outage, plus one hour of recovery grace", clears: "the grace expiring" },
] as const;

function segColor(session: string) {
  if (session === "regular") return "bg-zf-teal/80";
  if (session === "extended") return "bg-zf-sky/60";
  return "bg-zf-mist";
}

export function SessionsSection() {
  return (
    <section id="sessions" className="relative scroll-mt-32 overflow-hidden py-24 md:py-32">
      <div className="grid-bg absolute inset-0 -z-10" aria-hidden="true" />
      <div className="container">
        <div className="max-w-3xl">
          <p className="eyebrow">Sessions</p>
          <h2 className="mt-5 text-[32px] font-medium leading-[1.1] text-zf-ink md:text-[44px] lg:text-[52px] [text-wrap:balance]">
            A venue that knows what time it is
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zf-muted md:text-lg">
            Equity markets are open about 32 hours a week. Stock Tokens trade
            around the clock. Every market on ZircoFi carries a regime that
            prices the difference, read from the oracle&apos;s own market status,
            never from a hard-coded calendar.
          </p>
        </div>

        {/* The day, to scale */}
        <div className="mt-14">
          <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-zf-faint">
            <span>A weekday on the venue · UTC</span>
            <span className="hidden sm:inline">segment widths to scale</span>
          </div>
          <div className="mt-3 flex h-14 w-full gap-[3px] overflow-hidden rounded-2xl border border-zf-line bg-white p-[3px]">
            {DAY.map((seg, i) => (
              <div
                key={i}
                className={cn("relative h-full rounded-xl", segColor(seg.session))}
                style={{ width: `${(seg.minutes / 1440) * 100}%` }}
                title={`${seg.session} from ${seg.from}`}
              >
                {seg.minutes >= 300 && (
                  <span
                    className={cn(
                      "absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.12em]",
                      seg.session === "closed" ? "text-zf-muted" : "text-white"
                    )}
                  >
                    {seg.session === "regular" ? "open" : seg.session}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[10px] text-zf-faint">
            {["00", "04", "08", "12", "16", "20", "24"].map((h) => (
              <span key={h}>{h}:00</span>
            ))}
          </div>

          {/* The weekend */}
          <div className="mt-4 flex h-9 w-full items-center overflow-hidden rounded-2xl border border-zf-line bg-white p-[3px]">
            <div className="flex h-full w-full items-center rounded-xl bg-zf-mist px-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-zf-muted">
                Saturday and Sunday · closed · quoting continues at ×3.0, half the clip, disclosed on the ticket
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {LEGEND.map((l) => (
              <div key={l.label} className="flex items-center gap-2.5 font-mono text-[12px]">
                <span className={cn("size-3 rounded-md", segColor(l.session))} />
                <span className="text-zf-ink">{l.label}</span>
                <span className="text-zf-faint">
                  {l.spread} · {l.clip}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Why closed trades at all + halts */}
        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="font-heading text-xl font-medium text-zf-ink">Why the weekend trades at all</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-zf-muted">
              Refusing to quote on weekends recreates market hours on a 24/7
              chain. Quoting weekend trades at weekday spreads makes LPs the
              free counterparty to every Monday gap. ZircoFi takes the honest
              middle: weekend liquidity exists, costs more, comes in smaller
              size, and the ticket says exactly how much more. If your trade
              can wait for the open, waiting is cheaper, and the venue tells
              you so.
            </p>
          </div>
          <div>
            <h3 className="font-heading text-xl font-medium text-zf-ink">When quoting stops entirely</h3>
            <ul className="mt-3 divide-y divide-zf-line">
              {HALTS.map((h) => (
                <li key={h.trigger} className="flex items-baseline justify-between gap-4 py-2.5 text-[13.5px]">
                  <span className="text-zf-slate">{h.trigger}</span>
                  <span className="shrink-0 font-mono text-[11px] text-zf-teal">clears on {h.clears}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-zf-faint">
              A halt stops pricing and nothing else. LP withdrawals always work.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

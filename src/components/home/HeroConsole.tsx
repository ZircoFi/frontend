import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { MARKETS, TIERS } from "@/lib/platform/markets";
import { cn } from "@/lib/utils";

/**
 * The hero is the product: a console mock of the venue (markets, an itemised ticket, live fills)
 * under a centered headline, with a scrolling market tape underneath. Ticket numbers follow the
 * vault formula so the mock is internally consistent.
 */
const AMOUNT_IN = 10_000;
const MID = 176.4;
const FEE = (AMOUNT_IN * 2) / 10_000;
const NET = AMOUNT_IN - FEE;
const OUT = NET / (MID * 1.001); // 10 bps half-spread
const SPREAD_COST = NET - OUT * MID;

const FILLS = [
  { t: "14:32:08", pair: "SPYx", side: "BUY", bps: "11.9" },
  { t: "14:31:44", pair: "NVDAx", side: "SELL", bps: "12.3" },
  { t: "14:30:59", pair: "NVDAx", side: "BUY", bps: "9.6", venue: "rfq" },
  { t: "14:30:12", pair: "AAPLx", side: "BUY", bps: "12.0" },
  { t: "14:28:51", pair: "QQQx", side: "BUY", bps: "11.8" },
  { t: "14:27:36", pair: "MSFTx", side: "SELL", bps: "8.9", venue: "rfq" },
] as const;

const fmt = (n: number, d = 2) =>
  n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

export function HeroConsole() {
  return (
    <section className="relative isolate -mt-[76px] overflow-hidden pb-0">
      {/* Sky: the real thing */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover object-[center_20%]"
        />
        {/* A soft white veil behind the centered copy so the ink text stays legible over the sky */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_62%_46%_at_50%_30%,rgb(255_255_255/0.82),rgb(255_255_255/0.35)_58%,transparent_78%)]" />
        {/* Fades into the page: white haze at the very top for the header, background colour at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-transparent to-background" />
      </div>

      <div className="container pt-[150px] md:pt-[180px]">
        {/* Headline, centered */}
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow animate-rise justify-center">
            The RWA swap venue on Robinhood Chain
          </p>
          <h1 className="animate-rise delay-1 mt-6 text-[44px] font-medium leading-[1.03] md:text-[66px] lg:text-[76px] [text-wrap:balance]">
            <span className="text-glow">Real-world assets,</span>{" "}
            <span className="text-spectrum">traded properly.</span>
          </h1>
          <p className="animate-rise delay-2 mx-auto mt-6 max-w-2xl text-[17px] leading-[1.65] text-zf-slate md:text-lg">
            Swap tokenized stocks against USDG at prices anchored to the live
            Chainlink mid. The spread and fee are itemised on every ticket, and
            every fill settles on-chain where anyone can check it.
          </p>
          <div className="animate-rise delay-3 mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href={SITE.appHref} className="btn btn-primary">
              Launch the app
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="#pricing" className="btn btn-ghost">
              Read the formula
            </Link>
          </div>
        </div>

        {/* The console */}
        <div className="animate-rise delay-4 relative mx-auto mt-16 max-w-5xl">
          <div
            aria-hidden="true"
            className="absolute -inset-x-10 -bottom-10 top-10 -z-10 rounded-[40px] bg-white/70 blur-[60px]"
          />
          <div className="overflow-hidden rounded-2xl border border-zf-line bg-white shadow-[0_40px_90px_-40px_rgb(30_64_175/0.35)]">
            {/* Window chrome */}
            <div className="flex items-center gap-3 border-b border-zf-line bg-zf-cloud/80 px-4 py-2.5">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-zf-rose/50" />
                <span className="size-2.5 rounded-full bg-zf-peri/50" />
                <span className="size-2.5 rounded-full bg-zf-teal/50" />
              </span>
              <span className="mx-auto rounded-full border border-zf-line bg-white px-4 py-0.5 font-mono text-[11px] text-zf-muted">
                zircofi.com/platform
              </span>
              <span className="w-12" aria-hidden="true" />
            </div>

            <div className="grid lg:grid-cols-[230px_1fr_230px]">
              {/* Markets pane */}
              <div className="hidden border-r border-zf-line lg:block">
                <PaneTitle>Markets</PaneTitle>
                <ul className="px-2 pb-3">
                  {MARKETS.slice(0, 6).map((m) => (
                    <li
                      key={m.symbol}
                      className={cn(
                        "flex items-baseline justify-between rounded-lg px-3 py-2 font-mono text-[12px]",
                        m.symbol === "NVDAx" ? "bg-zf-blue/8 text-zf-ink" : "text-zf-slate"
                      )}
                    >
                      <span>{m.symbol}</span>
                      <span className="text-right">
                        {fmt(m.mid)}
                        <span className="ml-2 text-[10px] text-zf-faint">
                          {TIERS[m.tier].baseHalfSpreadBps}bps
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ticket pane */}
              <div className="px-5 py-5 md:px-8">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-zf-faint">
                    Swap · NVDAx / USDG
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-zf-teal/30 bg-zf-teal/8 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-zf-teal">
                    <span className="size-1.5 rounded-full bg-zf-teal" />
                    Open ×1.0
                  </span>
                </div>

                <div className="mt-4 grid gap-2.5">
                  <div className="rounded-xl border border-zf-line bg-zf-cloud/60 px-4 py-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-zf-faint">You pay</div>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="font-heading text-[24px] font-medium text-zf-ink">{fmt(AMOUNT_IN, 0)}</span>
                      <span className="font-mono text-[12px] text-zf-muted">USDG</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-zf-blue/25 bg-zf-blue/5 px-4 py-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-zf-faint">You receive</div>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="font-heading text-[24px] font-medium text-zf-ink">{fmt(OUT, 4)}</span>
                      <span className="font-mono text-[12px] text-zf-muted">NVDA</span>
                    </div>
                  </div>
                </div>

                <ul className="mt-4 space-y-1.5 font-mono text-[12px] text-zf-slate">
                  <li className="flex justify-between">
                    <span>Chainlink mid</span>
                    <span className="text-zf-ink">{fmt(MID)} USDG</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Spread · 10.0 bps</span>
                    <span className="text-zf-ink">{fmt(SPREAD_COST)} USDG</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Protocol fee · 2.0 bps</span>
                    <span className="text-zf-ink">{fmt(FEE)} USDG</span>
                  </li>
                </ul>

                <div className="mt-4 rounded-full bg-gradient-to-r from-zf-teal-bright via-zf-teal to-zf-teal-deep py-2.5 text-center text-[14px] font-medium text-white">
                  Review swap
                </div>
              </div>

              {/* Fills pane */}
              <div className="hidden border-l border-zf-line lg:block">
                <PaneTitle>Fills · vs mid</PaneTitle>
                <ul className="px-4 pb-3">
                  {FILLS.map((f) => (
                    <li key={f.t} className="flex items-baseline justify-between py-1.5 font-mono text-[11px]">
                      <span className="text-zf-faint">{f.t}</span>
                      <span className={f.side === "BUY" ? "text-zf-teal" : "text-zf-blue"}>
                        {f.side} {f.pair}
                      </span>
                      <span className="text-zf-slate">{f.bps}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-zf-faint">
            The live app, one click away · chain ID {SITE.chainId}
          </p>
        </div>
      </div>

      {/* Market tape */}
      <div className="mt-14 border-y border-zf-line bg-white/70 backdrop-blur-sm">
        <div className="overflow-hidden">
          <div className="marquee py-3">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                aria-hidden={copy === 1}
                className="flex shrink-0 items-center gap-10 pr-10 font-mono text-[12px]"
              >
                {MARKETS.map((m) => (
                  <li key={m.symbol} className="flex items-baseline gap-2.5 whitespace-nowrap">
                    <span className="text-zf-ink">{m.symbol}</span>
                    <span className="text-zf-slate">{fmt(m.mid)}</span>
                    <span className="text-[10px] uppercase text-zf-faint">
                      ±{TIERS[m.tier].baseHalfSpreadBps} bps · tier {TIERS[m.tier].label}
                    </span>
                  </li>
                ))}
                <li className="flex items-baseline gap-2.5 whitespace-nowrap text-zf-faint">
                  <span className="text-zf-teal">●</span> anchored to Chainlink · itemised to the basis point
                </li>
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PaneTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 pb-1 pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-zf-faint">
      {children}
    </div>
  );
}

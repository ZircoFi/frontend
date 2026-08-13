import { Check, X } from "lucide-react";

const PAIRS = [
  {
    them: "Price discovered from the pool's own reserves",
    us: "Price anchored to the Chainlink mid, bounded by a hard band",
  },
  {
    them: "Saturday quoted as if it were Tuesday",
    us: "Closed sessions widen spreads and shrink clips, on the ticket",
  },
  {
    them: "LPs arbitraged on every reference-price move",
    us: "LPs earn the spread; skew pays the market to rebalance them",
  },
  {
    them: "Splits break the pool or force a migration",
    us: "Corporate actions halt the market and resume on the adjusted feed",
  },
  {
    them: "Size walks the curve and pays for it",
    us: "Size goes to competing makers through signed RFQ quotes",
  },
  {
    them: "Fees folded invisibly into the curve",
    us: "Fees itemised on the quote and recorded in the fill event",
  },
] as const;

export function DiptychSection() {
  return (
    <section id="compare" className="relative scroll-mt-32 overflow-hidden py-24 md:py-32">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/3 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-zf-mist/80 blur-[150px]"
      />
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center">Positioning</p>
          <h2 className="mt-5 text-[32px] font-medium leading-[1.1] text-zf-ink md:text-[44px] lg:text-[52px] [text-wrap:balance]">
            Generic AMMs price RWAs like memecoins
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zf-muted md:text-lg">
            Constant-product pools are the right tool for crypto-native pairs
            and the wrong one for assets whose authoritative price lives on an
            exchange. The 2025 launch dislocations, where thin pools quoted
            tokenized stocks at large premiums, were this difference playing out
            in public.
          </p>
        </div>

        {/* The diptych */}
        <div className="relative mt-16 grid gap-6 lg:grid-cols-2 lg:gap-10">
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-zf-line bg-white px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-zf-faint lg:inline"
          >
            vs
          </span>

          <div className="rounded-3xl border border-zf-line bg-zf-cloud/70 p-7 md:p-9">
            <h3 className="font-mono text-[12px] uppercase tracking-[0.2em] text-zf-muted">
              A generic pool
            </h3>
            <ul className="mt-6 space-y-4">
              {PAIRS.map((p) => (
                <li key={p.them} className="flex gap-3 text-[14.5px] leading-relaxed text-zf-muted">
                  <X className="mt-0.5 size-4 shrink-0 text-zf-rose/70" aria-hidden="true" />
                  {p.them}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-zf-blue/25 bg-gradient-to-b from-white to-zf-blue/6 p-7 shadow-[0_30px_70px_-35px_rgb(31_79_255/0.35)] md:p-9">
            <h3 className="font-mono text-[12px] uppercase tracking-[0.2em] text-zf-blue">
              ZircoFi
            </h3>
            <ul className="mt-6 space-y-4">
              {PAIRS.map((p) => (
                <li key={p.us} className="flex gap-3 text-[14.5px] leading-relaxed text-zf-slate">
                  <Check className="mt-0.5 size-4 shrink-0 text-zf-teal" aria-hidden="true" />
                  {p.us}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-[13.5px] leading-relaxed text-zf-faint">
          Complementary, not adversarial: arbitrageurs keeping generic pools in
          line with anchored quotes are welcome flow, and skew pricing pays them
          to rebalance the vaults while they do it.
        </p>
      </div>
    </section>
  );
}

interface FormulaTerm {
  term: string;
  detail: string;
  op?: string;
  accent?: boolean;
}

const TERMS: FormulaTerm[] = [
  {
    term: "mid",
    detail: "The guarded Chainlink price. Zero, stale or implausible rounds halt the market instead of pricing it.",
  },
  {
    op: "+",
    term: "spread × regime",
    detail: "The tier's half-spread, 10 bps for Tier A, times the session multiplier: ×1.0 open, ×1.5 extended, ×3.0 closed.",
  },
  {
    op: "±",
    term: "skew",
    detail: "A vault off its 50/50 inventory target quotes tighter on the side that rebalances it, up to ±15 bps.",
  },
  {
    op: "+",
    term: "fee",
    detail: "2 bps, shown as its own line on the ticket and recorded in the fill event. Never inside the curve.",
  },
  {
    op: "=",
    term: "your price",
    detail: "Bounded by a hard band: nothing settles more than 75 bps from the mid, whatever goes wrong upstream.",
    accent: true,
  },
];

const GUARANTEES = [
  {
    title: "The chain re-derives it",
    body: "The router recomputes the vault quote from oracle and vault state inside your transaction, so a front end cannot route you to a worse price than the formula's.",
  },
  {
    title: "Makers must beat it",
    body: "Signed RFQ quotes from attested makers settle only when they pay you more than the vault. Losing costs them nothing, which keeps them quoting.",
  },
  {
    title: "Worse means revert",
    body: "Your slippage bound and deadline travel with the signature. If state moves past them before inclusion, the swap reverts rather than fills.",
  },
] as const;

export function FormulaSection() {
  return (
    <section id="pricing" className="relative scroll-mt-32 py-24 md:py-32">
      <div className="container">
        <div className="max-w-3xl">
          <p className="eyebrow">Pricing</p>
          <h2 className="mt-5 text-[32px] font-medium leading-[1.1] text-zf-ink md:text-[44px] lg:text-[52px] [text-wrap:balance]">
            One formula, published in full
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zf-muted md:text-lg">
            Every quote on ZircoFi is the same arithmetic over public state.
            Anyone can reproduce any price from on-chain inputs, which is the
            point: a venue whose pricing survives being understood.
          </p>
        </div>

        {/* The equation */}
        <div className="mt-14 flex flex-col items-stretch gap-3 lg:flex-row lg:items-start lg:gap-0">
          {TERMS.map((t) => (
            <div key={t.term} className="flex flex-col gap-3 lg:flex-1 lg:flex-row lg:gap-0">
              {"op" in t && t.op && (
                <div className="hidden select-none items-start px-3 pt-7 font-heading text-[28px] text-zf-faint lg:flex">
                  {t.op}
                </div>
              )}
              <div
                className={
                  t.accent
                    ? "flex-1 rounded-2xl border border-zf-blue/30 bg-gradient-to-b from-zf-blue/10 to-white p-5"
                    : "flex-1 rounded-2xl border border-zf-line bg-white/80 p-5"
                }
              >
                <div
                  className={
                    "font-mono text-[13px] uppercase tracking-[0.14em] " +
                    (t.accent ? "text-zf-blue" : "text-zf-ink")
                  }
                >
                  {"op" in t && t.op ? <span className="mr-2 text-zf-faint lg:hidden">{t.op}</span> : null}
                  {t.term}
                </div>
                <p className="mt-2.5 text-[13px] leading-relaxed text-zf-muted">{t.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* What the formula buys you */}
        <div className="mt-14 grid gap-x-12 gap-y-8 border-t border-zf-line pt-10 md:grid-cols-3">
          {GUARANTEES.map((g, i) => (
            <div key={g.title} className="flex gap-4">
              <span className="font-mono text-[12px] leading-7 text-zf-faint">0{i + 1}</span>
              <div>
                <h3 className="text-[16px] font-medium text-zf-ink">{g.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-zf-muted">{g.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

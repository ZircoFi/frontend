const ENTRIES = [
  {
    title: "Every fill is itemised on-chain",
    body: "The fill event carries mid, spread, skew and fee, matching the ticket.",
    check: "any fill on Blockscout against its receipt",
  },
  {
    title: "No fill outside the band",
    body: "A contract invariant, not a policy, on the vault path and RFQ alike.",
    check: "the public invariant suite",
  },
  {
    title: "Execution quality, unfiltered",
    body: "Every fill's distance from the mid, published live and downloadable raw.",
    check: "recompute it from chain events",
  },
  {
    title: "No payment for order flow",
    body: "The router settles the best verifiable price, per fill, on-chain.",
    check: "re-derive any fill's venue comparison",
  },
  {
    title: "No custody, ever",
    body: "Atomic settlement; vault inventory belongs to LPs, not the venue.",
    check: "the audits attest there is no such function",
  },
  {
    title: "Withdrawals unconditional",
    body: "In every vault state, with every pause active. Exits cannot be gated.",
    check: "halt-state withdrawals in the explorer",
  },
  {
    title: "Timelocked, published changes",
    body: "Every parameter change is scheduled with its rationale before it executes.",
    check: "the governance log, complete from block one",
  },
  {
    title: "Open source, verified bytecode",
    body: "The deployed code is the audited code, asserted in CI on every release.",
    check: "reproduce the build against the tag",
  },
] as const;

export function TransparencyLedger() {
  return (
    <section id="ledger" className="relative scroll-mt-32 py-24 md:py-32">
      <div className="container">
        <div className="max-w-3xl">
          <p className="eyebrow">The ledger</p>
          <h2 className="mt-5 text-[32px] font-medium leading-[1.1] text-zf-ink md:text-[44px] lg:text-[52px] [text-wrap:balance]">
            Eight promises, each with a verification path
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zf-muted md:text-lg">
            Transparency claims are cheap; commitments are checkable. If any
            entry below ever fails verification, that is an incident, handled
            as one, with a public post-mortem.
          </p>
        </div>

        <ol className="mt-14 grid gap-x-16 md:grid-cols-2">
          {ENTRIES.map((e, i) => (
            <li key={e.title} className="flex gap-6 border-t border-zf-line py-6">
              <span className="font-heading text-[28px] font-light leading-none text-zf-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[16.5px] font-medium leading-snug text-zf-ink">{e.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-zf-muted">{e.body}</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zf-teal">
                  check: {e.check}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

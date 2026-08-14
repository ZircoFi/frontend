const SPECS = [
  { label: "Network", value: "Robinhood Chain · ID 4663" },
  { label: "Stack", value: "Arbitrum Nitro, EVM-equivalent" },
  { label: "Settlement", value: "Ethereum, blob data availability" },
  { label: "Block time", value: "~250 ms · 100 ms preconfirms" },
  { label: "Median transaction", value: "~$0.001, gas in ETH" },
  { label: "Assets", value: "2,000+ Stock Tokens, ERC-20" },
  { label: "Issuer", value: "Robinhood Assets (Jersey) Ltd, 1:1 backed" },
  { label: "Corporate actions", value: "ERC-8056 uiMultiplier()" },
  { label: "Oracles", value: "Chainlink Feeds + Streams with market status" },
  { label: "Quote asset", value: "USDG (Paxos), MiCA-regulated, native" },
  { label: "Accounts", value: "ERC-4337 + EIP-7702, sponsored first swap" },
  { label: "Explorer", value: "Blockscout, every fill linked" },
] as const;

export function ChainSpec() {
  return (
    <section id="chain" className="relative scroll-mt-32 border-y border-zf-line bg-white/60 py-24 md:py-32">
      <div className="container">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p className="eyebrow">Why Robinhood Chain</p>
            <h2 className="mt-5 text-[32px] font-medium leading-[1.1] text-zf-ink md:text-[40px] [text-wrap:balance]">
              Built where the assets already live
            </h2>
            <p className="mt-5 text-base leading-relaxed text-zf-muted md:text-lg">
              Robinhood Chain is the only network where a regulated broker
              issues tokenized equities as ordinary ERC-20s, with Chainlink
              feeds, permissionless deployment and the broker&apos;s own
              distribution behind them. That is the exact combination an
              oracle-anchored venue needs, and no other chain has it.
            </p>
            <ul className="mt-8 space-y-4 text-[15px] leading-relaxed text-zf-slate">
              <li className="border-l-2 border-zf-teal pl-4">
                Plain ERC-20 stocks mean no issuer allowlisting stands between a
                wallet and a swap.
              </li>
              <li className="border-l-2 border-zf-blue pl-4">
                The oracle carries the session flag the regime engine runs on,
                from the same source that prices the fill.
              </li>
              <li className="border-l-2 border-zf-peri pl-4">
                Sub-cent transactions keep small swaps economic and quotes fresh
                at a hundred milliseconds.
              </li>
            </ul>
          </div>

          {/* Datasheet */}
          <div className="rounded-3xl border border-zf-line bg-white p-7 md:p-9">
            <div className="flex items-baseline justify-between">
              <h3 className="font-mono text-[12px] uppercase tracking-[0.2em] text-zf-faint">
                Datasheet
              </h3>
              <span className="font-mono text-[11px] text-zf-faint">mainnet · 1 Jul 2026</span>
            </div>
            <dl className="mt-6">
              {SPECS.map((s) => (
                <div key={s.label} className="flex items-baseline py-[9px] font-mono text-[13px]">
                  <dt className="shrink-0 text-zf-muted">{s.label}</dt>
                  <span className="spec-leader" aria-hidden="true" />
                  <dd className="shrink-0 text-right text-zf-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

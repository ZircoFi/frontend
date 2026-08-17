import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "Is ZircoFi an exchange?",
    a: "It is a non-custodial swap venue: quotes come from oracle-anchored vaults and competing makers, settlement is atomic on Robinhood Chain, and your assets never sit with the venue. There is no order book and no account to fund.",
  },
  {
    q: "Why is the spread wider tonight than this afternoon?",
    a: "The underlying market is closed. Closed-session quotes carry a x3 spread multiplier and smaller clips because liquidity providers bear the gap to the next open. The ticket's regime badge always shows the multiplier in force, before you sign.",
  },
  {
    q: "Do I own Apple shares after buying tokenized AAPL?",
    a: "No. You hold a Stock Token: an ERC-20 debt security issued by Robinhood Assets (Jersey) Ltd that tracks the share, with dividends accruing into the token through its ERC-8056 multiplier. The disclosure at your first swap spells out the difference.",
  },
  {
    q: "What do liquidity providers actually earn?",
    a: "The realised spread on their vault's fills, minus the protocol's 10% share, accruing into value per share. No emissions and no points. It is not impermanent loss in the AMM sense: anchored vaults do not bleed to reference-price arbitrage, and the real risks, inventory and weekend gaps, are stated plainly and charged for.",
  },
  {
    q: "Who sets the prices?",
    a: "A formula over public state: the guarded Chainlink mid, the tier half-spread times the session multiplier, the inventory skew, and an itemised fee. Nobody at ZircoFi can touch an individual quote or fill, and parameters change only through a timelock with a published rationale.",
  },
  {
    q: "Is there a token or an airdrop?",
    a: "There is no protocol token and none is planned. The venue's economics are a small itemised toll on real activity, which scales with exactly the thing the venue exists to maximise.",
  },
  {
    q: "What comes after Stock Tokens?",
    a: "The guarded launch runs Tier A equity markets with visible caps. Next: the long tail of Stock Tokens as feeds and reviews complete, then tokenized treasuries and gold through the same listing checklist, then the public API and SDK, then the governance handover. Each phase opens on evidence from the last.",
  },
  {
    q: "Can I integrate ZircoFi into my app?",
    a: "Yes. The router is a public contract with a stable interface, eligibility follows your users' wallets rather than your app, and the quote API and TypeScript SDK ship with the infrastructure phase of the roadmap. There is no partner tier; the reference front end has no privileged path.",
  },
] as const;

export function FaqSection() {
  return (
    <section id="faq" className="relative scroll-mt-32 py-24 md:py-32">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <p className="eyebrow">Questions</p>
            <h2 className="mt-5 text-[32px] font-medium leading-[1.1] text-zf-ink md:text-[40px] [text-wrap:balance]">
              Asked, answered, on the record
            </h2>
            <p className="mt-5 text-base leading-relaxed text-zf-muted">
              The short versions live here. The long versions, with the maths
              and the failure modes, live in the documentation.
            </p>
          </div>

          <div className="divide-y divide-zf-line border-y border-zf-line">
            {FAQS.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-left">
                  <span className="text-[16px] font-medium text-zf-ink md:text-[17px]">{f.q}</span>
                  <Plus
                    className="size-4 shrink-0 text-zf-blue transition-transform duration-300 group-open:rotate-45"
                    aria-hidden="true"
                  />
                </summary>
                <p className="pb-6 pr-10 text-[14.5px] leading-relaxed text-zf-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

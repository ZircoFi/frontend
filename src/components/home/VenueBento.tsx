import { ArrowRight } from "lucide-react";

/** The venue in one asymmetric mosaic: routing, bounds, participants, custody, fees. */
export function VenueBento() {
  return (
    <section id="venue" className="relative scroll-mt-32 py-24 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center">The venue</p>
          <h2 className="mt-5 text-[32px] font-medium leading-[1.1] text-zf-ink md:text-[44px] lg:text-[52px] [text-wrap:balance]">
            Two venues behind one router
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zf-muted md:text-lg">
            Standard size fills instantly against oracle-anchored vaults. Block
            size goes to professional makers through signed quotes. The router
            settles whichever pays you more, exactly, on-chain.
          </p>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Routing diagram: large tile */}
          <div className="panel p-7 md:col-span-2 lg:row-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zf-faint">Routing</p>
            <div className="mt-6 flex flex-col items-center gap-3">
              <DiagramNode label="Your signature" sub="amount · bound · deadline" />
              <Arrow />
              <DiagramNode label="SwapRouter" sub="eligibility · band · best price" accent />
              <Arrow />
              <div className="grid w-full grid-cols-2 gap-3">
                <DiagramNode label="Anchor vault" sub="formula price, instant" />
                <DiagramNode label="RFQ makers" sub="signed quotes, size" />
              </div>
              <Arrow />
              <DiagramNode label="Atomic settlement" sub="fee itemised · fill event on Blockscout" accent />
            </div>
            <p className="mt-6 text-[13.5px] leading-relaxed text-zf-muted">
              Token-to-token swaps run as two legs through USDG inside the same
              transaction. If either leg cannot clear inside its market&apos;s
              guards, both revert.
            </p>
          </div>

          {/* Band */}
          <div className="panel flex flex-col justify-between p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zf-faint">The hard bound</p>
            <div className="mt-4 font-heading text-[52px] font-medium leading-none text-zf-blue">75 bps</div>
            <p className="mt-3 text-[13.5px] leading-relaxed text-zf-muted">
              The Tier A oracle band. No fill settles further from the guarded
              mid, from a vault or a maker, under any parameters.
            </p>
          </div>

          {/* Fees */}
          <div className="panel flex flex-col justify-between p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zf-faint">The whole fee</p>
            <div className="mt-4 font-heading text-[52px] font-medium leading-none text-zf-teal">2 bps</div>
            <p className="mt-3 text-[13.5px] leading-relaxed text-zf-muted">
              Itemised on the ticket, recorded in the fill event. Plus 10% of
              the vault&apos;s realised spread. Nothing hidden inside a curve.
            </p>
          </div>

          {/* Participants */}
          <div className="panel p-7 md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zf-faint">Three seats</p>
            <ul className="mt-4 divide-y divide-zf-line">
              <ParticipantRow
                who="Traders"
                what="Swap 24/7 at itemised prices, with the session on the face of the ticket."
              />
              <ParticipantRow
                who="Liquidity providers"
                what="Fund a vault, earn the spread. Withdrawal is in kind and works in every state."
              />
              <ParticipantRow
                who="Market makers"
                what="Quote for free off-chain, win only by beating the vault, settle atomically."
              />
            </ul>
          </div>

          {/* Custody */}
          <div className="panel p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zf-faint">Custody</p>
            <p className="mt-4 font-heading text-[22px] font-medium leading-snug text-zf-ink">
              None. Ever.
            </p>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-zf-muted">
              Assets sit in your wallet or in LP-owned vaults. Settlement is
              atomic; there is nothing at the venue to lose.
            </p>
          </div>

          {/* Withdrawals */}
          <div className="panel p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zf-faint">Exits</p>
            <p className="mt-4 font-heading text-[22px] font-medium leading-snug text-zf-ink">
              Withdrawal is an invariant
            </p>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-zf-muted">
              Pro-rata, in kind, in every vault state: halted, paused, even
              with an expired attestation. Not a permission.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function DiagramNode({ label, sub, accent }: { label: string; sub: string; accent?: boolean }) {
  return (
    <div
      className={
        accent
          ? "w-full rounded-xl border border-zf-blue/30 bg-zf-blue/6 px-4 py-3 text-center"
          : "w-full rounded-xl border border-zf-line bg-white px-4 py-3 text-center"
      }
    >
      <div className="text-[14px] font-medium text-zf-ink">{label}</div>
      <div className="mt-0.5 font-mono text-[10.5px] text-zf-faint">{sub}</div>
    </div>
  );
}

function Arrow() {
  return <ArrowRight className="size-4 rotate-90 text-zf-faint" aria-hidden="true" />;
}

function ParticipantRow({ who, what }: { who: string; what: string }) {
  return (
    <li className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-6">
      <span className="w-44 shrink-0 text-[15px] font-medium text-zf-ink">{who}</span>
      <span className="text-[13.5px] leading-relaxed text-zf-muted">{what}</span>
    </li>
  );
}

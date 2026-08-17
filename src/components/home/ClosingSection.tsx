import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { XIcon } from "@/components/icons";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const PHASES = [
  { name: "Testnet", live: true },
  { name: "Guarded mainnet", live: true },
  { name: "Catalogue and caps", live: false },
  { name: "API and cross-chain", live: false },
  { name: "Governance", live: false },
] as const;

export function ClosingSection() {
  return (
    <section className="relative pb-28 pt-8 md:pb-36">
      <div className="container">
        {/* Flight path */}
        <div className="mx-auto max-w-4xl">
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-zf-faint">
            The flight path · each phase opens on evidence from the last
          </p>
          <div className="mt-5 flex items-center">
            {PHASES.map((p, i) => (
              <div key={p.name} className={cn("flex items-center", i > 0 && "flex-1")}>
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-px flex-1",
                      p.live ? "bg-zf-teal/60" : "border-t border-dashed border-zf-line-strong"
                    )}
                  />
                )}
                <div className="flex flex-col items-center gap-2 px-1.5">
                  <span
                    className={cn(
                      "size-3 rounded-full",
                      p.live
                        ? "bg-zf-teal shadow-[0_0_0_4px_rgba(14,143,134,0.15)]"
                        : "border-2 border-zf-peri bg-white"
                    )}
                  />
                  <span
                    className={cn(
                      "whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em]",
                      p.live ? "text-zf-teal" : "text-zf-faint"
                    )}
                  >
                    {p.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA card */}
        <div className="relative mx-auto mt-16 max-w-5xl overflow-hidden rounded-[32px] border border-zf-line shadow-[0_40px_90px_-40px_rgb(30_64_175/0.35)]">
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <Image
              src="/images/banner.png"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              quality={85}
              className="object-cover object-center"
            />
            {/* Veil behind the copy; the plane stays visible above the headline */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_75%_at_50%_62%,rgb(255_255_255/0.86),rgb(255_255_255/0.4)_60%,transparent_85%)]" />
          </div>
          <div className="flex flex-col items-center px-6 py-16 text-center md:py-20">
            <h2 className="max-w-3xl text-[36px] font-medium leading-[1.05] md:text-[54px] [text-wrap:balance]">
              <span className="text-glow">The market is open.</span>
            </h2>
            <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-zf-slate md:text-base">
              Verified traders can be swapping in minutes. LPs fund vaults and
              earn the spread. Makers quote for free. Every fill lands on
              Robinhood Chain.
            </p>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              <Link href={SITE.appHref} className="btn btn-primary">
                Launch the app
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <a
                href={SITE.xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                <XIcon className="size-4" />
                Follow {SITE.xHandle}
              </a>
            </div>
            <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.18em] text-zf-faint">
              Every asset · every hour · every fill on-chain
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

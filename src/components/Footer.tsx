import Link from "next/link";
import { Logo } from "@/components/Logo";
import { GitHubIcon, XIcon } from "@/components/icons";
import { SITE } from "@/lib/site";

const COLUMNS = [
  {
    heading: "Venue",
    links: [
      { label: "Launch app", href: SITE.appHref },
      { label: "How pricing works", href: "#pricing" },
      { label: "Sessions", href: "#sessions" },
      { label: "The venue", href: "#venue" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    heading: "Protocol",
    links: [
      { label: "Why Robinhood Chain", href: "#chain" },
      { label: "Compare", href: "#compare" },
      { label: "Transparency", href: "#ledger" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Contact", href: `mailto:${SITE.contactEmail}` },
      { label: SITE.xHandle, href: SITE.xUrl, external: true },
      { label: "GitHub", href: SITE.githubUrl, external: true },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="relative border-t border-zf-line bg-white/60">
      <div className="glow-rule absolute inset-x-0 top-0" aria-hidden="true" />
      <div className="container pb-8 pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-8">
          <div className="max-w-sm">
            <Logo size={32} />
            <p className="mt-5 text-[14.5px] leading-relaxed text-zf-muted">
              A non-custodial swap venue for tokenized real-world assets on
              Robinhood Chain. Oracle-anchored pricing, itemised fees, atomic
              settlement in USDG.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={SITE.xUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ZircoFi on X"
                className="inline-flex size-9 items-center justify-center rounded-full border border-zf-line text-zf-muted transition-colors hover:border-zf-line-strong hover:text-zf-ink"
              >
                <XIcon className="size-4" />
              </a>
              <a
                href={SITE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ZircoFi on GitHub"
                className="inline-flex size-9 items-center justify-center rounded-full border border-zf-line text-zf-muted transition-colors hover:border-zf-line-strong hover:text-zf-ink"
              >
                <GitHubIcon className="size-4" />
              </a>
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.heading}>
              <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-zf-blue">
                {column.heading}
              </h3>
              <ul className="mt-5 flex flex-col gap-3">
                {column.links.map((link) => {
                  const external = "external" in link && link.external;
                  return (
                    <li key={link.label}>
                      {external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[14px] text-zf-muted transition-colors hover:text-zf-ink"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-[14px] text-zf-muted transition-colors hover:text-zf-ink"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-zf-line pt-6">
          <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="font-mono text-[12px] text-zf-faint">
              &copy; 2026 ZircoFi · {SITE.domain}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-zf-faint">
              Every asset. Every hour. Every fill on-chain.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

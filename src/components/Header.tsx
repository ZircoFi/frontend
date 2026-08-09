"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { GitHubIcon, XIcon } from "@/components/icons";
import { NAV_LINKS, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-11 z-40 w-full transition-colors duration-300",
        scrolled || open
          ? "border-b border-zf-line bg-white/75 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container flex h-[76px] items-center justify-between">
        <Logo />

        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 lg:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] text-zf-slate transition-colors hover:text-zf-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={SITE.xUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ZircoFi on X"
            className="inline-flex size-9 items-center justify-center rounded-full text-zf-muted transition-colors hover:bg-zf-mist hover:text-zf-ink"
          >
            <XIcon className="size-4" />
          </a>
          <a
            href={SITE.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ZircoFi on GitHub"
            className="inline-flex size-9 items-center justify-center rounded-full text-zf-muted transition-colors hover:bg-zf-mist hover:text-zf-ink"
          >
            <GitHubIcon className="size-4.5" />
          </a>
          <Link href={SITE.appHref} className="btn btn-primary text-sm">
            Launch app
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="cursor-pointer inline-flex size-10 items-center justify-center rounded-full text-zf-ink transition-colors hover:bg-zf-mist lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile navigation */}
      <div
        id="mobile-nav"
        className={cn(
          "lg:hidden",
          open ? "block" : "hidden"
        )}
      >
        <div className="container flex flex-col gap-1 border-t border-zf-line bg-white/95 pb-6 pt-3 backdrop-blur-xl">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-3 text-base text-zf-slate transition-colors hover:bg-zf-mist hover:text-zf-ink"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-3">
            <Link
              href={SITE.appHref}
              className="btn btn-primary w-full"
              onClick={() => setOpen(false)}
            >
              Launch app
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <a
              href={SITE.xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost w-full"
            >
              <XIcon className="size-4" />
              Follow {SITE.xHandle}
            </a>
            <a
              href={SITE.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost w-full"
            >
              <GitHubIcon className="size-4.5" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

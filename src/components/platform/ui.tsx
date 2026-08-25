"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* Flight-deck primitives: printed sheets with mono strip headers, hairlines and dotted leaders. */

export function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("sheet p-5 md:p-6", className)}>{children}</div>;
}

/** A sheet with the mono strip header on top; content gets its own padding. */
export function Sheet({
  label,
  meta,
  className,
  children,
}: {
  label: string;
  meta?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("sheet overflow-hidden", className)}>
      <div className="sheet-head">
        <span>{label}</span>
        {meta && <span className="normal-case tracking-normal">{meta}</span>}
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

export function PanelHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 border-b border-zf-line pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zf-teal">{eyebrow}</p>
        )}
        <h2 className={cn("font-heading text-lg font-medium text-zf-ink md:text-xl", eyebrow && "mt-1.5")}>{title}</h2>
        {description && <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-zf-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/** Page header: a flight-code line, the title, and an optional action, over a hairline. */
export function PageHead({
  code,
  title,
  description,
  action,
}: {
  code: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="border-b border-zf-line pb-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-zf-teal">{code}</p>
          <h1 className="mt-2 font-heading text-[30px] font-medium leading-tight text-zf-ink md:text-[36px]">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-zf-muted">{description}</p>
          )}
        </div>
        {action}
      </div>
    </div>
  );
}

/** One sheet, many figures: a divided band instead of separate cards. */
export function StatBand({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "sheet grid divide-y divide-zf-line overflow-hidden sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: "teal" | "rose";
}) {
  return (
    <div className="px-5 py-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zf-faint">{label}</div>
      <div
        className={cn(
          "mt-2 font-heading text-[26px] font-medium leading-none [font-variant-numeric:tabular-nums]",
          accent === "teal" ? "text-zf-teal" : accent === "rose" ? "text-zf-rose" : "text-zf-ink"
        )}
      >
        {value}
      </div>
      {hint && <div className="mt-2 text-[12px] text-zf-muted">{hint}</div>}
    </div>
  );
}

export function Badge({
  tone = "muted",
  children,
}: {
  tone?: "teal" | "blue" | "peri" | "rose" | "muted";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]",
        tone === "teal" && "border-zf-teal/35 bg-zf-teal/8 text-zf-teal",
        tone === "blue" && "border-zf-blue/30 bg-zf-blue/8 text-zf-blue",
        tone === "peri" && "border-zf-peri/40 bg-zf-peri/10 text-zf-peri",
        tone === "rose" && "border-zf-rose/35 bg-zf-rose/8 text-zf-rose",
        tone === "muted" && "border-zf-line-strong bg-zf-cloud text-zf-muted"
      )}
    >
      {children}
    </span>
  );
}

/** Session badge tones: OPEN teal, EXTENDED blue, CLOSED periwinkle, HALTED rose. */
export function sessionTone(session: string): "teal" | "blue" | "peri" | "rose" {
  if (session === "regular") return "teal";
  if (session === "extended") return "blue";
  if (session === "closed") return "peri";
  return "rose";
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-zf-faint">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-[12px] text-zf-muted">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-zf-line-strong bg-white px-3.5 py-2.5 text-[14px] text-zf-ink outline-none transition-colors placeholder:text-zf-faint focus:border-zf-teal focus:ring-2 focus:ring-zf-teal/15 disabled:opacity-50";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputClass, props.type === "checkbox" || props.type === "radio" ? "cursor-pointer" : "", props.className)} />;
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className={cn("relative block", className)}>
      <select {...props} className={cn(inputClass, "cursor-pointer appearance-none pr-10")} />
      <ChevronDown
        className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-zf-teal"
        aria-hidden="true"
      />
    </span>
  );
}

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  return (
    <button
      {...props}
      className={cn("cursor-pointer",
        "btn cursor-pointer text-sm disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "btn-primary",
        variant === "ghost" && "btn-ghost",
        variant === "danger" && "border border-zf-rose/30 bg-zf-rose/8 text-zf-rose hover:bg-zf-rose/15",
        className
      )}
    />
  );
}

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: React.ReactNode }) {
  return (
    <div className="perf flex flex-col items-center justify-center px-6 pb-10 pt-8 text-center">
      <p className="text-[15px] font-medium text-zf-ink">{title}</p>
      {body && <p className="mt-1.5 max-w-md text-[13px] text-zf-muted">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "warn" | "error"; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-lg border-l-2 py-2.5 pl-4 pr-3 text-[13px] leading-relaxed",
        tone === "info" && "border-zf-teal bg-zf-teal/5 text-zf-slate",
        tone === "warn" && "border-zf-peri bg-zf-peri/8 text-zf-slate",
        tone === "error" && "border-zf-rose bg-zf-rose/8 text-zf-rose"
      )}
    >
      {children}
    </div>
  );
}

export function Table({ children, minWidth = 640 }: { children: React.ReactNode; minWidth?: number }) {
  return (
    <div className="scrollbar-none -mx-5 overflow-x-auto px-5 md:-mx-6 md:px-6">
      <table className="w-full border-collapse text-left text-[13.5px] [font-variant-numeric:tabular-nums]" style={{ minWidth }}>
        {children}
      </table>
    </div>
  );
}

export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b-2 border-zf-line-strong py-2.5 pr-4 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-zf-faint",
        className
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("border-b border-zf-line/70 py-3 pr-4 align-top text-zf-slate", className)}>{children}</td>;
}

export function Skeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2.5" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-9 animate-pulse rounded-lg bg-zf-mist" />
      ))}
    </div>
  );
}

/** A dotted-leader row, like a line on a printed manifest. */
export function LeaderRow({ label, value, sub }: { label: React.ReactNode; value: React.ReactNode; sub?: string }) {
  return (
    <div className="py-[7px] font-mono text-[13px]">
      <div className="flex items-baseline">
        <span className="shrink-0 text-zf-muted">{label}</span>
        <span className="spec-leader" aria-hidden="true" />
        <span className="shrink-0 text-right text-zf-ink [font-variant-numeric:tabular-nums]">{value}</span>
      </div>
      {sub && <div className="mt-0.5 text-[10.5px] normal-case text-zf-faint">{sub}</div>}
    </div>
  );
}

export function ExplorerLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-zf-teal underline-offset-4 hover:underline">
      {children}
    </Link>
  );
}

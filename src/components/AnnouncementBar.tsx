export function AnnouncementBar() {
  return (
    <div className="sticky top-0 z-50 h-11 w-full border-b border-zf-line bg-white/80 backdrop-blur-xl">
      <div className="container flex h-full items-center justify-center gap-3">
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-zf-teal sm:inline">
          Live
        </span>
        <p className="text-center text-[13px] text-zf-slate sm:text-sm">
          $ZIRCOFI is live on Robinhood Chain.{" "}
        </p>
      </div>
    </div>
  );
}

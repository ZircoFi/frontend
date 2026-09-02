export function AnnouncementBar() {
  return (
    <div className="sticky top-0 z-50 h-11 w-full border-b border-zf-line bg-white/80 backdrop-blur-xl">
      <div className="container flex h-full items-center justify-center gap-3">
        <p className="text-center text-[13px] text-zf-slate sm:text-sm">
          $ZIRCO is live on Robinhood Chain.{" "} 0x13a03170db84842fa4c957bad44d852c3169e1e5
        </p>
      </div>
    </div>
  );
}

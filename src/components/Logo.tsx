import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** Pixel size of the cloud mark. */
  size?: number;
  withWordmark?: boolean;
  className?: string;
  href?: string;
}

export function Logo({
  size = 36,
  withWordmark = true,
  className,
  href = "/",
}: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="ZircoFi home"
      className={cn(
        "group inline-flex items-center gap-2.5 text-zf-ink",
        className
      )}
    >
      <span
        className="relative inline-flex shrink-0 items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-zf-sky/25 blur-md opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        />
        <Image
          src="/images/logo-mark.png"
          alt=""
          width={size}
          height={size}
          priority
          className="relative h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </span>
      {withWordmark && (
        <span className="font-heading text-[19px] font-medium tracking-[-0.01em]">
          ZircoFi
        </span>
      )}
    </Link>
  );
}

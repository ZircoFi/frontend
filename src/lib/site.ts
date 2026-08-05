/** Brand constants shared across the site. */
export const SITE = {
  name: "ZircoFi",
  domain: "zircofi.com",
  url: "https://zircofi.com",
  xHandle: "@ZircoFi",
  xUrl: "https://x.com/ZircoFi",
  githubUrl: "https://github.com/ZircoFi",
  contactEmail: "hello@zircofi.com",
  chainId: 4663,
  appHref: "/platform",
} as const;

export const NAV_LINKS = [
  { label: "Pricing", href: "#pricing" },
  { label: "Sessions", href: "#sessions" },
  { label: "The venue", href: "#venue" },
  { label: "Chain", href: "#chain" },
  { label: "Transparency", href: "#ledger" },
  { label: "FAQ", href: "#faq" },
] as const;

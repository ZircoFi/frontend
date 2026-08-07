import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const SITE_URL = "https://zircofi.com";
const TITLE = "ZircoFi | Swap real-world assets on Robinhood Chain";
const DESCRIPTION =
  "ZircoFi is a non-custodial swap venue for tokenized real-world assets on Robinhood Chain. Trade Stock Tokens against USDG at prices anchored to the live Chainlink mid, with the spread and fee itemised on every ticket and every fill settled on-chain.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | ZircoFi",
  },
  description: DESCRIPTION,
  applicationName: "ZircoFi",
  keywords: [
    "ZircoFi",
    "Robinhood Chain",
    "tokenized stocks",
    "RWA swap",
    "real-world assets",
    "USDG",
    "tokenized equities",
    "DeFi",
  ],
  authors: [{ name: "ZircoFi", url: SITE_URL }],
  creator: "ZircoFi",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "ZircoFi",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ZircoFi",
    creator: "@ZircoFi",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#e9f2ff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background text-zf-ink antialiased">
        {children}
      </body>
    </html>
  );
}

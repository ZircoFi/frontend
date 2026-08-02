import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    // next/image only accepts qualities listed here; hero and banner artwork use 85.
    qualities: [75, 85],
  },
  turbopack: {
    // Pin the workspace root to this project so module resolution
    // (e.g. `@import "tailwindcss"` in globals.css) doesn't walk up to ~/Desktop.
    root: path.resolve(__dirname),
  },
};

export default nextConfig;

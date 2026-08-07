import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ZircoFi",
    short_name: "ZircoFi",
    description:
      "Swap tokenized real-world assets on Robinhood Chain, at prices anchored to the live mid.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7faff",
    theme_color: "#e9f2ff",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}

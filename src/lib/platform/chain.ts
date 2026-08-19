import { defineChain } from "viem";
import { platformEnv } from "./env";

/** Robinhood Chain, built from environment so nothing is hardcoded. */
export const robinhoodChain = defineChain({
  id: platformEnv.chainId,
  name: platformEnv.chainName,
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: platformEnv.chainRpc ? [platformEnv.chainRpc] : [] },
  },
  blockExplorers: platformEnv.chainExplorer
    ? { default: { name: "Blockscout", url: platformEnv.chainExplorer } }
    : undefined,
  testnet: false,
});

import { defineChain } from "thirdweb";

export const chain = defineChain({
  id: 56, // ✅ Binance Smart Chain Mainnet
  name: "BNB Chain",
  rpcUrls: {
    default: { http: ["https://bsc-mainnet.public.blastapi.io"] }, // ✅ Stable public RPC
  },
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  blockExplorers: {
    default: { name: "BscScan", url: "https://bscscan.com" },
  },
  testnet: false,
});

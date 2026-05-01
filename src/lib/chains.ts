import { defineChain } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { env } from "@/lib/env";

export const appChain = defineChain({
  ...arbitrumSepolia,
  rpcUrls: {
    ...arbitrumSepolia.rpcUrls,
    default: {
      http: [env.arbitrumSepoliaRpcUrl]
    },
    public: {
      http: [env.arbitrumSepoliaRpcUrl]
    }
  }
});

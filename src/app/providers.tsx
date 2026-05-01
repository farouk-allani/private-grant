"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { env } from "@/lib/env";

const config = env.walletConnectProjectId
  ? getDefaultConfig({
      appName: "PrivateGrant Vault",
      projectId: env.walletConnectProjectId,
      chains: [arbitrumSepolia],
      ssr: true
    })
  : createConfig({
      chains: [arbitrumSepolia],
      connectors: [injected({ shimDisconnect: true })],
      transports: {
        [arbitrumSepolia.id]: http()
      },
      ssr: true
    });

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#FFD800",
            accentColorForeground: "#11100B",
            borderRadius: "large",
            fontStack: "system"
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

"use client";

import { AlertTriangle, Network } from "lucide-react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function NetworkGuard() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected || chainId === arbitrumSepolia.id) return null;

  return (
    <Card className="border-warning/30 bg-warning/10">
      <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-warning" />
          <div>
            <p className="font-semibold text-white">Wrong network</p>
            <p className="text-sm text-muted">PrivateGrant Vault runs on Arbitrum Sepolia.</p>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => switchChain({ chainId: arbitrumSepolia.id })}
          disabled={isPending}
        >
          <Network className="h-4 w-4" />
          Switch network
        </Button>
      </CardContent>
    </Card>
  );
}

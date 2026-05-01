"use client";

import { AlertTriangle, Network } from "lucide-react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { appChain } from "@/lib/chains";

export function NetworkGuard() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected || chainId === appChain.id) return null;

  return (
    <Card className="border-primary-deep/40 bg-primary-pale">
      <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-primary-deep" />
          <div>
            <p className="font-black text-ink">Wrong network</p>
            <p className="text-sm text-muted">PrivateGrant Vault runs on {appChain.name}.</p>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => switchChain({ chainId: appChain.id })}
          disabled={isPending}
        >
          <Network className="h-4 w-4" />
          Switch network
        </Button>
      </CardContent>
    </Card>
  );
}

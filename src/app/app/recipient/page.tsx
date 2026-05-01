"use client";

import { ReceiptText, UserRound } from "lucide-react";
import { useAccount } from "wagmi";
import { AppShell } from "@/components/AppShell";
import { RecipientBalanceCard } from "@/components/RecipientBalanceCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { env } from "@/lib/env";
import { formatDate, shortenAddress } from "@/lib/format";
import { useCampaigns, useRecipientPayouts } from "@/lib/hooks/useCampaigns";

export default function RecipientPage() {
  const { address } = useAccount();
  const campaigns = useCampaigns();
  const payouts = useRecipientPayouts(address);
  const firstToken = campaigns.data?.find((campaign) => campaign.confidentialToken !== "0x0000000000000000000000000000000000000000")
    ?.confidentialToken;

  return (
    <AppShell
      title="Recipient dashboard"
      description="View campaign participation and decrypt your own confidential balance when Nox viewer permissions allow it."
    >
      {!address ? (
        <EmptyState title="Connect wallet" description="Connect the recipient wallet to load real payout records." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <RecipientBalanceCard confidentialToken={firstToken || env.defaultConfidentialToken} account={address} />
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <Badge variant="secondary">Recipient</Badge>
                <UserRound className="h-6 w-6 text-primary-deep" />
              </div>
              <CardTitle>My payout records</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {payouts.isLoading ? (
                <LoadingState label="Loading recipient payouts" />
              ) : payouts.isError ? (
                <ErrorState description={payouts.error.message} />
              ) : payouts.data?.length ? (
                payouts.data.map(({ campaign, payout, index }) => (
                  <div
                    key={`${campaign.id}-${index}`}
                    className="rounded-2xl border border-muted-dark bg-ink p-4 text-sm text-dark-muted"
                  >
                    <div className="mb-3 flex items-center gap-2 text-primary">
                      <ReceiptText className="h-4 w-4" />
                      <p className="technical-label">Payout #{index}</p>
                    </div>
                    <p className="font-black text-[#FFFDF3]">{campaign.name}</p>
                    <p className="mt-2">Created {formatDate(campaign.createdAt)}</p>
                    <p className="mt-2 break-all font-mono text-xs">
                      Handle {payout.confidentialTransferRef}
                    </p>
                    <p className="mt-2">Sponsor {shortenAddress(campaign.sponsor)}</p>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No recipient payouts found"
                  description="The app reads payout metadata from the deployed vault and does not invent campaign involvement."
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </AppShell>
  );
}

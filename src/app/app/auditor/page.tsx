"use client";

import { ShieldCheck } from "lucide-react";
import { useAccount } from "wagmi";
import { AppShell } from "@/components/AppShell";
import { CampaignCard } from "@/components/CampaignCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCampaigns } from "@/lib/hooks/useCampaigns";

export default function AuditorPage() {
  const { address } = useAccount();
  const campaigns = useCampaigns();
  const assigned = campaigns.data?.filter(
    (campaign) => address && campaign.auditor.toLowerCase() === address.toLowerCase()
  );

  return (
    <AppShell
      title="Auditor dashboard"
      description="Review public campaign facts and payout occurrences. Nox selective viewing is available for handles explicitly granted to your wallet."
    >
      <Card>
        <CardHeader>
          <ShieldCheck className="h-6 w-6 text-primary" />
          <CardTitle>What auditors can see</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm leading-6 text-muted">
          <p>Campaign metadata, funding events, recipients, and payout occurrence are public.</p>
          <p>
            Private amounts are not emitted by the vault. If a sponsor grants Nox viewer access, use
            the Nox handle decryption flow from the campaign detail page.
          </p>
        </CardContent>
      </Card>
      {campaigns.isLoading ? (
        <LoadingState />
      ) : campaigns.isError ? (
        <ErrorState description={campaigns.error.message} />
      ) : assigned?.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {assigned.map((campaign) => (
            <CampaignCard key={campaign.id.toString()} campaign={campaign} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No assigned audit campaigns"
          description="Connect the auditor wallet that sponsors added to campaigns, or inspect all campaigns from the main dashboard."
        />
      )}
    </AppShell>
  );
}

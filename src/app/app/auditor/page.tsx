"use client";

import { FileSearch, ShieldCheck } from "lucide-react";
import { useAccount } from "wagmi";
import { AppShell } from "@/components/AppShell";
import { CampaignCard } from "@/components/CampaignCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <Badge variant="secondary">Auditor</Badge>
            <ShieldCheck className="h-6 w-6 text-primary-deep" />
          </div>
          <CardTitle>What auditors can see</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-6 text-muted md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-background p-4">
            <FileSearch className="h-5 w-5 text-primary-deep" />
            <p className="mt-3 font-bold text-ink">Public review surface</p>
            <p className="mt-1">Campaign metadata, funding events, recipients, and payout occurrence are public.</p>
          </div>
          <div className="rounded-2xl border border-muted-dark bg-ink p-4 text-dark-muted">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <p className="mt-3 font-bold text-[#FFFDF3]">Selective private context</p>
            <p className="mt-1">
              Private amounts are not emitted by the vault. Granted Nox viewer access belongs on the
              campaign detail flow.
            </p>
          </div>
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

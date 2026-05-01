"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CampaignCard } from "@/components/CampaignCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { env } from "@/lib/env";
import { useCampaigns } from "@/lib/hooks/useCampaigns";

export default function DashboardPage() {
  const campaigns = useCampaigns();

  return (
    <AppShell
      title="Campaign dashboard"
      description="Read live campaign metadata and payout records from the deployed PrivateGrantVault contract."
    >
      <div className="flex justify-end">
        <Link
          href="/app/create"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-slate-950 transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New campaign
        </Link>
      </div>
      {!env.vaultAddress ? (
        <ErrorState
          title="Vault address missing"
          description="Deploy PrivateGrantVault and set NEXT_PUBLIC_PRIVATE_GRANT_VAULT_ADDRESS."
        />
      ) : campaigns.isLoading ? (
        <LoadingState />
      ) : campaigns.isError ? (
        <ErrorState description={campaigns.error.message} />
      ) : campaigns.data?.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.data.map((campaign) => (
            <CampaignCard key={campaign.id.toString()} campaign={campaign} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No on-chain campaigns yet"
          description="Create a campaign after deploying the vault. The dashboard does not use mock campaign data."
        />
      )}
    </AppShell>
  );
}

"use client";

import Link from "next/link";
import { EyeOff, FileSearch, Plus, ShieldCheck, WalletCards } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CampaignCard } from "@/components/CampaignCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { env } from "@/lib/env";
import { formatTokenAmount } from "@/lib/format";
import { useCampaigns } from "@/lib/hooks/useCampaigns";

export default function DashboardPage() {
  const campaigns = useCampaigns();
  const rows = campaigns.data ?? [];
  const activeCount = rows.filter((campaign) => campaign.isActive).length;
  const totalBudget = rows.reduce((sum, campaign) => sum + campaign.publicBudget, 0n);
  const auditorCount = rows.filter(
    (campaign) => campaign.auditor !== "0x0000000000000000000000000000000000000000"
  ).length;

  return (
    <AppShell
      title="Vault dashboard"
      description="Live campaign metadata, shielded payout routes, and audit surfaces from the deployed PrivateGrantVault contract."
    >
      {!env.vaultAddress ? (
        <ErrorState
          title="Vault address missing"
          description="Deploy PrivateGrantVault and set NEXT_PUBLIC_PRIVATE_GRANT_VAULT_ADDRESS."
        />
      ) : campaigns.isLoading ? (
        <LoadingState />
      ) : campaigns.isError ? (
        <ErrorState description={campaigns.error.message} />
      ) : (
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard icon={ShieldCheck} label="Active campaigns" value={activeCount.toString()} badge="Real Tx" />
            <MetricCard icon={WalletCards} label="Public budget" value={formatTokenAmount(totalBudget, 6)} badge="Public" />
            <MetricCard icon={EyeOff} label="Confidential routes" value={rows.length.toString()} badge="Nox" />
            <MetricCard icon={FileSearch} label="Auditor-enabled" value={auditorCount.toString()} badge="Auditor" />
          </div>

          <div className="flex flex-col gap-4 rounded-[36px] border border-border bg-surface p-5 shadow-[0_24px_80px_rgba(17,16,11,0.08)] md:flex-row md:items-center md:justify-between">
            <div>
              <Badge variant="secondary">Campaign registry</Badge>
              <h2 className="mt-3 text-3xl font-black uppercase leading-none text-ink">
                Active campaign surface
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                No invented campaign rows. This view renders what the vault and Arbitrum Sepolia return.
              </p>
            </div>
            <Link
              href="/app/create"
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[28px] border-b-4 border-primary-deep bg-primary px-7 text-xs font-black uppercase tracking-[0.08em] text-ink shadow-glow transition-all hover:bg-primary-hover active:translate-y-[2px] active:border-b-2"
            >
              <Plus className="h-4 w-4" />
              New campaign
            </Link>
          </div>

          {rows.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {rows.map((campaign) => (
                <CampaignCard key={campaign.id.toString()} campaign={campaign} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No on-chain campaigns yet"
              description="Create a campaign after deploying the vault. The dashboard does not use mock campaign data."
            />
          )}
        </div>
      )}
    </AppShell>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  badge
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  badge: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-primary-pale text-primary-deep">
            <Icon className="h-5 w-5" />
          </span>
          <Badge>{badge}</Badge>
        </div>
        <CardTitle className="text-4xl leading-none">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="technical-label text-muted">{label}</p>
      </CardContent>
    </Card>
  );
}

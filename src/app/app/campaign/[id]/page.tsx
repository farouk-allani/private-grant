"use client";

import { Archive, ExternalLink, LockKeyhole, ReceiptText, ShieldCheck, WalletCards } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { AppShell } from "@/components/AppShell";
import { AuditorAccessPanel } from "@/components/AuditorAccessPanel";
import { ConfidentialBadge } from "@/components/ConfidentialBadge";
import { ConfidentialPayoutForm } from "@/components/ConfidentialPayoutForm";
import { RecipientBalanceCard } from "@/components/RecipientBalanceCard";
import { ShieldTokenFlow } from "@/components/ShieldTokenFlow";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { privateGrantVaultAbi } from "@/lib/abis";
import { env } from "@/lib/env";
import { formatDate, formatTokenAmount, shortenAddress } from "@/lib/format";
import { useCampaign, usePayouts } from "@/lib/hooks/useCampaigns";

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id ? BigInt(params.id) : undefined;
  const campaign = useCampaign(id);
  const payouts = usePayouts(id);
  const { address } = useAccount();
  const close = useWriteContract();
  const closeReceipt = useWaitForTransactionReceipt({ hash: close.data });

  async function closeCampaign() {
    if (!env.vaultAddress || !id) return;
    await close.writeContractAsync({
      address: env.vaultAddress,
      abi: privateGrantVaultAbi,
      functionName: "closeCampaign",
      args: [id]
    });
  }

  return (
    <AppShell
      title="Campaign detail"
      description="Shield public ERC-20 funding, send encrypted Nox ERC-7984 payouts, and review safe payout metadata."
    >
      {campaign.isLoading ? (
        <LoadingState />
      ) : campaign.isError ? (
        <ErrorState description={campaign.error.message} />
      ) : campaign.data ? (
        <div className="grid gap-6">
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge variant={campaign.data.isActive ? "primary" : "default"}>
                      {campaign.data.isActive ? "Active" : "Closed"}
                    </Badge>
                    <Badge>{campaign.data.category}</Badge>
                    <Badge variant="secondary">Campaign #{campaign.data.id.toString()}</Badge>
                  </div>
                  <CardTitle className="text-4xl uppercase leading-none">{campaign.data.name}</CardTitle>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
                    {campaign.data.description}
                  </p>
                </div>
                <ConfidentialBadge />
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Info icon={WalletCards} label="Public budget" value={formatTokenAmount(campaign.data.publicBudget, 6)} />
                <Info icon={ReceiptText} label="Deadline" value={formatDate(campaign.data.deadline)} />
                <Info icon={ShieldCheck} label="Sponsor" value={shortenAddress(campaign.data.sponsor)} />
                <Info icon={LockKeyhole} label="Auditor" value={shortenAddress(campaign.data.auditor)} />
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-muted-dark bg-ink p-4 text-sm text-dark-muted">
                  <p className="technical-label text-primary">ERC-20 token</p>
                  <p className="mt-2 break-all font-mono text-xs text-[#FFFDF3]">{campaign.data.token}</p>
                </div>
                <div className="rounded-2xl border border-muted-dark bg-ink p-4 text-sm text-dark-muted">
                  <p className="technical-label text-primary">Nox confidential token</p>
                  <p className="mt-2 break-all font-mono text-xs text-[#FFFDF3]">
                    {campaign.data.confidentialToken}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {env.vaultAddress ? (
                  <a
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 font-mono text-xs font-bold text-primary-deep transition hover:border-primary"
                    href={`https://sepolia.arbiscan.io/address/${env.vaultAddress}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Vault contract on Arbiscan
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
                {address?.toLowerCase() === campaign.data.sponsor.toLowerCase() ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={closeCampaign}
                    disabled={!campaign.data.isActive || close.isPending || closeReceipt.isLoading}
                  >
                    <Archive className="h-4 w-4" />
                    Close campaign
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <ShieldTokenFlow campaign={campaign.data} />
            <ConfidentialPayoutForm campaign={campaign.data} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <RecipientBalanceCard
              confidentialToken={campaign.data.confidentialToken}
              account={address}
            />
            <AuditorAccessPanel campaign={campaign.data} />
          </div>

          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <Badge variant="secondary">Settlement trail</Badge>
                <ReceiptText className="h-6 w-6 text-primary-deep" />
              </div>
              <CardTitle>Public payout trail</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {payouts.isLoading ? (
                <LoadingState label="Loading payout records" />
              ) : payouts.isError ? (
                <ErrorState description={payouts.error.message} />
              ) : payouts.data?.length ? (
                payouts.data.map((payout, index) => (
                  <div
                    key={`${payout.confidentialTransferRef}-${index}`}
                    className="rounded-2xl border border-muted-dark bg-ink p-4 text-sm text-dark-muted"
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge variant="primary">Real Tx</Badge>
                      <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-primary">
                        Payout #{index}
                      </p>
                    </div>
                    <p>Recipient {shortenAddress(payout.recipient)}</p>
                    <p className="mt-2 break-all font-mono text-xs">
                      Confidential transfer handle {payout.confidentialTransferRef}
                    </p>
                    {payout.memo ? <p className="mt-2">Memo {payout.memo}</p> : null}
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No payout records"
                  description="Payout records will appear after a real vault-routed confidential transfer or sponsor-recorded confidential transfer reference."
                />
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <EmptyState title="Campaign not found" description="No campaign exists at this id." />
      )}
    </AppShell>
  );
}

function Info({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4 text-sm">
      <Icon className="h-4 w-4 text-primary-deep" />
      <p className="mt-4 technical-label text-muted">{label}</p>
      <p className="mt-1 break-words font-black text-ink">{value}</p>
    </div>
  );
}

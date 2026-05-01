"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileSearch, ShieldCheck, UserMinus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { isAddress, zeroAddress, type Address } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorMessage } from "@/components/ui/error-message";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { privateGrantVaultAbi } from "@/lib/abis";
import { appChain } from "@/lib/chains";
import { env } from "@/lib/env";
import { formatContractError } from "@/lib/errors";
import { shortenAddress } from "@/lib/format";
import type { Campaign } from "@/lib/types";

const auditorSchema = z.object({
  auditor: z.string().refine((value) => Boolean(isAddress(value)), "Enter a valid auditor address"),
  payoutIndex: z.string().regex(/^\d+$/, "Enter a payout index")
});

type AuditorValues = z.infer<typeof auditorSchema>;

export function AuditorAccessPanel({ campaign }: { campaign: Campaign }) {
  const vaultAddress = env.vaultAddress;
  const grant = useWriteContract();
  const revoke = useWriteContract();
  const grantReceipt = useWaitForTransactionReceipt({ hash: grant.data });
  const revokeReceipt = useWaitForTransactionReceipt({ hash: revoke.data });
  const form = useForm<AuditorValues>({
    resolver: zodResolver(auditorSchema),
    defaultValues: {
      auditor: campaign.auditor === zeroAddress ? "" : campaign.auditor,
      payoutIndex: "0"
    }
  });

  async function onSubmit(values: AuditorValues) {
    if (!vaultAddress) return;
    await grant.writeContractAsync({
      address: vaultAddress,
      abi: privateGrantVaultAbi,
      functionName: "grantAuditorForPayout",
      chainId: appChain.id,
      args: [campaign.id, BigInt(values.payoutIndex), values.auditor as Address]
    });
  }

  async function revokeAuditor() {
    if (!vaultAddress) return;
    await revoke.writeContractAsync({
      address: vaultAddress,
      abi: privateGrantVaultAbi,
      functionName: "revokeCampaignAuditor",
      chainId: appChain.id,
      args: [campaign.id]
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary">Auditor</Badge>
          <FileSearch className="h-6 w-6 text-primary-deep" />
        </div>
        <CardTitle>Auditor access</CardTitle>
        <CardDescription>
          Current Nox SDK exposes addViewer/viewACL. This app records revocation on the vault, while
          already-granted Nox viewer ACL cannot be removed by the current package.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="rounded-2xl border border-muted-dark bg-ink p-4 text-sm text-dark-muted">
          <p className="technical-label text-primary">Campaign auditor</p>
          <p className="mt-2 font-mono text-[#FFFDF3]">
            {campaign.auditor === zeroAddress ? "None" : shortenAddress(campaign.auditor)}
          </p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Auditor wallet" description="Wallet that can receive supported Nox viewer access." error={form.formState.errors.auditor?.message}>
              <Input placeholder="0x..." {...form.register("auditor")} />
            </Field>
            <Field label="Payout index" description="Select the payout record to grant for review." error={form.formState.errors.payoutIndex?.message}>
              <Input inputMode="numeric" {...form.register("payoutIndex")} />
            </Field>
          </div>
          <Button type="submit" disabled={!vaultAddress || grant.isPending || grantReceipt.isLoading}>
            <ShieldCheck className="h-4 w-4" />
            Grant Nox viewer access
          </Button>
        </form>
        <Button
          type="button"
          variant="ghost"
          onClick={revokeAuditor}
          disabled={!vaultAddress || revoke.isPending || revokeReceipt.isLoading}
        >
          <UserMinus className="h-4 w-4" />
          Revoke app-level auditor
        </Button>
        {grantReceipt.isSuccess ? <p className="text-sm font-bold text-primary-deep">Auditor grant confirmed.</p> : null}
        {revokeReceipt.isSuccess ? <p className="text-sm font-bold text-primary-deep">Auditor status updated.</p> : null}
        <ErrorMessage>{formatContractError(grant.error)}</ErrorMessage>
        <ErrorMessage>{formatContractError(revoke.error)}</ErrorMessage>
      </CardContent>
    </Card>
  );
}

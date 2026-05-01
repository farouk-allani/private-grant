"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, UserMinus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { isAddress, zeroAddress, type Address } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { privateGrantVaultAbi } from "@/lib/abis";
import { env } from "@/lib/env";
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
      args: [campaign.id, BigInt(values.payoutIndex), values.auditor as Address]
    });
  }

  async function revokeAuditor() {
    if (!vaultAddress) return;
    await revoke.writeContractAsync({
      address: vaultAddress,
      abi: privateGrantVaultAbi,
      functionName: "revokeCampaignAuditor",
      args: [campaign.id]
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auditor access</CardTitle>
        <CardDescription>
          Current Nox SDK exposes addViewer/viewACL. This app records revocation on the vault, while
          already-granted Nox viewer ACL cannot be removed by the current package.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="rounded-md border border-white/10 bg-white/[0.03] p-3 text-sm text-muted">
          Campaign auditor: {campaign.auditor === zeroAddress ? "None" : shortenAddress(campaign.auditor)}
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Auditor wallet" error={form.formState.errors.auditor?.message}>
              <Input placeholder="0x..." {...form.register("auditor")} />
            </Field>
            <Field label="Payout index" error={form.formState.errors.payoutIndex?.message}>
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
        {grantReceipt.isSuccess ? <p className="text-sm text-primary">Auditor grant confirmed.</p> : null}
        {revokeReceipt.isSuccess ? <p className="text-sm text-primary">Auditor status updated.</p> : null}
        {grant.error ? <p className="text-sm text-danger">{grant.error.message}</p> : null}
        {revoke.error ? <p className="text-sm text-danger">{revoke.error.message}</p> : null}
      </CardContent>
    </Card>
  );
}

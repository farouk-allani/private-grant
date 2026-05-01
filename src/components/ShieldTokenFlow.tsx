"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { parseUnits } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { TransactionTimeline } from "@/components/TransactionTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { erc20Abi, privateGrantVaultAbi } from "@/lib/abis";
import { env } from "@/lib/env";
import type { Campaign } from "@/lib/types";
import { shieldSchema, type ShieldFormValues } from "@/lib/validation";

export function ShieldTokenFlow({ campaign }: { campaign: Campaign }) {
  const vaultAddress = env.vaultAddress;
  const approve = useWriteContract();
  const shield = useWriteContract();
  const approveReceipt = useWaitForTransactionReceipt({ hash: approve.data });
  const shieldReceipt = useWaitForTransactionReceipt({ hash: shield.data });
  const form = useForm<ShieldFormValues>({
    resolver: zodResolver(shieldSchema),
    defaultValues: { amount: "" }
  });

  const amount = form.watch("amount");
  const parsedAmount = amount && /^\d+(\.\d+)?$/.test(amount) ? parseUnits(amount, 6) : 0n;

  async function approveVault() {
    if (!vaultAddress || parsedAmount === 0n) return;
    await approve.writeContractAsync({
      address: campaign.token,
      abi: erc20Abi,
      functionName: "approve",
      args: [vaultAddress, parsedAmount]
    });
  }

  async function shieldFunds() {
    if (!vaultAddress || parsedAmount === 0n) return;
    await shield.writeContractAsync({
      address: vaultAddress,
      abi: privateGrantVaultAbi,
      functionName: "shieldCampaignFunds",
      args: [campaign.id, parsedAmount]
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shield campaign funds</CardTitle>
        <CardDescription>
          Approve ERC-20 transfer, then wrap through the registered Nox ERC-7984 confidential token.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Field label="Amount to shield" error={form.formState.errors.amount?.message}>
          <Input inputMode="decimal" placeholder="1000" {...form.register("amount")} />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button type="button" variant="secondary" onClick={approveVault} disabled={!vaultAddress || parsedAmount === 0n || approve.isPending || approveReceipt.isLoading}>
            <Shield className="h-4 w-4" />
            Approve ERC-20
          </Button>
          <Button
            type="button"
            onClick={shieldFunds}
            disabled={!vaultAddress || parsedAmount === 0n || !approveReceipt.isSuccess || shield.isPending || shieldReceipt.isLoading}
          >
            <Lock className="h-4 w-4" />
            Shield into Nox token
          </Button>
        </div>
        <TransactionTimeline
          steps={[
            {
              label: "Approve ERC-20 for vault",
              state: approveReceipt.isSuccess
                ? "done"
                : approve.isPending || approveReceipt.isLoading
                  ? "pending"
                  : "idle",
              hash: approve.data
            },
            {
              label: "Wrap into Nox Confidential Token",
              state: shieldReceipt.isSuccess
                ? "done"
                : shield.isPending || shieldReceipt.isLoading
                  ? "pending"
                  : "idle",
              hash: shield.data
            }
          ]}
        />
        {approve.error ? <p className="text-sm text-danger">{approve.error.message}</p> : null}
        {shield.error ? <p className="text-sm text-danger">{shield.error.message}</p> : null}
      </CardContent>
    </Card>
  );
}

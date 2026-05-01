"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Coins, Lock, Shield, Vault } from "lucide-react";
import { useForm } from "react-hook-form";
import { parseUnits } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { TransactionTimeline } from "@/components/TransactionTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorMessage } from "@/components/ui/error-message";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { erc20Abi, privateGrantVaultAbi } from "@/lib/abis";
import { appChain } from "@/lib/chains";
import { env } from "@/lib/env";
import { formatContractError } from "@/lib/errors";
import type { Campaign } from "@/lib/types";
import { shieldSchema, type ShieldFormValues } from "@/lib/validation";

export function ShieldTokenFlow({ campaign }: { campaign: Campaign }) {
  const vaultAddress = env.vaultAddress;
  const { address } = useAccount();
  const mint = useWriteContract();
  const approve = useWriteContract();
  const shield = useWriteContract();
  const mintReceipt = useWaitForTransactionReceipt({ hash: mint.data });
  const approveReceipt = useWaitForTransactionReceipt({ hash: approve.data });
  const shieldReceipt = useWaitForTransactionReceipt({ hash: shield.data });
  const form = useForm<ShieldFormValues>({
    resolver: zodResolver(shieldSchema),
    defaultValues: { amount: "" }
  });

  const amount = form.watch("amount");
  const parsedAmount = amount && /^\d+(\.\d+)?$/.test(amount) ? parseUnits(amount, 6) : 0n;

  async function mintDemoTokens() {
    if (!address || parsedAmount === 0n) return;
    await mint.writeContractAsync({
      address: campaign.token,
      abi: erc20Abi,
      functionName: "mint",
      chainId: appChain.id,
      args: [address, parsedAmount]
    });
  }

  async function approveVault() {
    if (!vaultAddress || parsedAmount === 0n) return;
    await approve.writeContractAsync({
      address: campaign.token,
      abi: erc20Abi,
      functionName: "approve",
      chainId: appChain.id,
      args: [vaultAddress, parsedAmount]
    });
  }

  async function shieldFunds() {
    if (!vaultAddress || parsedAmount === 0n) return;
    await shield.writeContractAsync({
      address: vaultAddress,
      abi: privateGrantVaultAbi,
      functionName: "shieldCampaignFunds",
      chainId: appChain.id,
      args: [campaign.id, parsedAmount]
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary">Shield funds</Badge>
          <Vault className="h-6 w-6 text-primary-deep" />
        </div>
        <CardTitle>Shield campaign funds</CardTitle>
        <CardDescription>
          Approve ERC-20 transfer, then wrap through the registered Nox ERC-7984 confidential token.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Field
          label="Amount to shield"
          description="This moves public ERC-20 liquidity into the campaign's confidential token route."
          error={form.formState.errors.amount?.message}
        >
          <Input inputMode="decimal" placeholder="1000" {...form.register("amount")} />
        </Field>
        <div className="grid gap-3 sm:grid-cols-3">
          <Button
            type="button"
            variant="ghost"
            onClick={mintDemoTokens}
            disabled={!address || parsedAmount === 0n || mint.isPending || mintReceipt.isLoading}
          >
            <Coins className="h-4 w-4" />
            Mint demo pgUSDC
          </Button>
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
              label: "Demo token mint",
              state: mintReceipt.isSuccess
                ? "done"
                : mint.isPending || mintReceipt.isLoading
                  ? "pending"
                  : "idle",
              hash: mint.data
            },
            {
              label: "ERC-20 approval",
              state: approveReceipt.isSuccess
                ? "done"
                : approve.isPending || approveReceipt.isLoading
                  ? "pending"
                  : "idle",
              hash: approve.data
            },
            {
              label: "Shielding funds",
              state: shieldReceipt.isSuccess
                ? "done"
                : shield.isPending || shieldReceipt.isLoading
                  ? "pending"
                  : "idle",
              hash: shield.data
            },
            {
              label: "Nox confirmation",
              state: shieldReceipt.isSuccess
                ? "done"
                : shield.isPending || shieldReceipt.isLoading
                  ? "pending"
                  : "idle"
            }
          ]}
        />
        <ErrorMessage>{formatContractError(mint.error)}</ErrorMessage>
        <ErrorMessage>{formatContractError(approve.error)}</ErrorMessage>
        <ErrorMessage>{formatContractError(shield.error)}</ErrorMessage>
      </CardContent>
    </Card>
  );
}

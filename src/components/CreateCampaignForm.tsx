"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPlus, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { parseUnits, zeroAddress, type Address } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { privateGrantVaultAbi } from "@/lib/abis";
import { env } from "@/lib/env";
import { campaignSchema, type CampaignFormValues } from "@/lib/validation";

export function CreateCampaignForm() {
  const vaultAddress = env.vaultAddress;
  const { writeContractAsync, data: hash, isPending, error } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      description: "",
      token: env.defaultErc20 ?? "",
      confidentialToken: env.defaultConfidentialToken ?? "",
      category: "grant",
      publicBudget: "",
      deadline: "",
      auditor: ""
    }
  });

  async function onSubmit(values: CampaignFormValues) {
    if (!vaultAddress) return;
    const deadline = values.deadline
      ? BigInt(Math.floor(new Date(values.deadline).getTime() / 1000))
      : 0n;

    await writeContractAsync({
      address: vaultAddress,
      abi: privateGrantVaultAbi,
      functionName: "createCampaign",
      args: [
        values.name,
        values.description,
        values.token as Address,
        (values.confidentialToken || zeroAddress) as Address,
        values.category,
        parseUnits(values.publicBudget, 6),
        deadline,
        (values.auditor || zeroAddress) as Address
      ]
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create private payout campaign</CardTitle>
        <CardDescription>
          Campaign details are public; later payout amounts are encrypted through Nox handles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!vaultAddress ? (
          <p className="rounded-md border border-warning/25 bg-warning/10 p-4 text-sm text-warning">
            Set NEXT_PUBLIC_PRIVATE_GRANT_VAULT_ADDRESS after deploying the contract.
          </p>
        ) : null}
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Campaign name" error={form.formState.errors.name?.message}>
              <Input placeholder="Retroactive builder grants" {...form.register("name")} />
            </Field>
            <Field label="Category" error={form.formState.errors.category?.message}>
              <select
                className="h-11 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none focus:border-primary/70"
                {...form.register("category")}
              >
                <option value="grant">Grant</option>
                <option value="bounty">Bounty</option>
                <option value="payroll">Payroll</option>
                <option value="hackathon reward">Hackathon reward</option>
              </select>
            </Field>
          </div>
          <Field label="Description" error={form.formState.errors.description?.message}>
            <Textarea
              placeholder="What work will this campaign fund, and what remains public?"
              {...form.register("description")}
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="ERC-20 token address" error={form.formState.errors.token?.message}>
              <Input placeholder="0x..." {...form.register("token")} />
            </Field>
            <Field
              label="Nox confidential wrapper address"
              error={form.formState.errors.confidentialToken?.message}
            >
              <Input placeholder="0x..." {...form.register("confidentialToken")} />
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Public total budget" error={form.formState.errors.publicBudget?.message}>
              <Input placeholder="25000" inputMode="decimal" {...form.register("publicBudget")} />
            </Field>
            <Field label="Optional public deadline" error={form.formState.errors.deadline?.message}>
              <Input type="date" {...form.register("deadline")} />
            </Field>
          </div>
          <Field label="Optional auditor wallet" error={form.formState.errors.auditor?.message}>
            <Input placeholder="0x..." {...form.register("auditor")} />
          </Field>
          <Button type="submit" disabled={!vaultAddress || isPending || receipt.isLoading}>
            {isPending || receipt.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CalendarPlus className="h-4 w-4" />
            )}
            Create campaign
          </Button>
          {hash ? (
            <a
              href={`https://sepolia.arbiscan.io/tx/${hash}`}
              target="_blank"
              rel="noreferrer"
              className="break-all text-sm text-primary hover:underline"
            >
              {hash}
            </a>
          ) : null}
          {receipt.isSuccess ? <p className="text-sm text-primary">Campaign confirmed on-chain.</p> : null}
          {error ? <p className="text-sm text-danger">{error.message}</p> : null}
        </form>
      </CardContent>
    </Card>
  );
}

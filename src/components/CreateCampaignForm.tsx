"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPlus, FileText, Loader2, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { parseUnits, zeroAddress, type Address } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  const preview = form.watch();

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
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <CardHeader>
          <Badge variant="secondary">Sponsor</Badge>
          <CardTitle className="text-3xl">Create private payout campaign</CardTitle>
          <CardDescription>
            Campaign details are public; later payout amounts are encrypted through Nox handles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!vaultAddress ? (
            <p className="rounded-2xl border border-primary-deep/30 bg-primary-pale p-4 text-sm font-semibold text-primary-deep">
              Set NEXT_PUBLIC_PRIVATE_GRANT_VAULT_ADDRESS after deploying the contract.
            </p>
          ) : null}
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Campaign name"
              description="This is visible to builders, auditors, and public observers."
              error={form.formState.errors.name?.message}
            >
              <Input placeholder="Retroactive builder grants" {...form.register("name")} />
            </Field>
            <Field label="Category" description="Choose the public reason for this payout pool." error={form.formState.errors.category?.message}>
              <Select
                value={form.watch("category")}
                onChange={(v) => form.setValue("category", v as CampaignFormValues["category"])}
                options={[
                  { label: "Grant", value: "grant" },
                  { label: "Bounty", value: "bounty" },
                  { label: "Payroll", value: "payroll" },
                  { label: "Hackathon reward", value: "hackathon reward" },
                ]}
              />
            </Field>
          </div>
          <Field
            label="Description"
            description="Keep strategy-safe public context here. Do not include private payout amounts."
            error={form.formState.errors.description?.message}
          >
            <Textarea
              placeholder="What work will this campaign fund, and what remains public?"
              {...form.register("description")}
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="ERC-20 token address" description="The public token sponsors approve before shielding." error={form.formState.errors.token?.message}>
              <Input placeholder="0x..." {...form.register("token")} />
            </Field>
            <Field
              label="Nox confidential wrapper address"
              description="ERC-7984-compatible confidential token for shielded balances."
              error={form.formState.errors.confidentialToken?.message}
            >
              <Input placeholder="0x..." {...form.register("confidentialToken")} />
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Public total budget" description="This budget is public; individual payouts are not." error={form.formState.errors.publicBudget?.message}>
              <Input placeholder="25000" inputMode="decimal" {...form.register("publicBudget")} />
            </Field>
            <Field label="Optional public deadline" description="Leave open-ended if this campaign has no public close date." error={form.formState.errors.deadline?.message}>
              <Input type="date" {...form.register("deadline")} />
            </Field>
          </div>
          <Field label="Optional auditor wallet" description="Grant campaign-level auditor context now or later." error={form.formState.errors.auditor?.message}>
            <Input placeholder="0x..." {...form.register("auditor")} />
          </Field>
          <Button type="submit" size="lg" disabled={!vaultAddress || isPending || receipt.isLoading}>
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
          {receipt.isSuccess ? <p className="text-sm font-bold text-primary-deep">Campaign confirmed on-chain.</p> : null}
          {error ? <p className="text-sm text-danger">{error.message}</p> : null}
        </form>
      </CardContent>
      </Card>

      <Card className="h-fit overflow-hidden border-muted-dark bg-ink text-[#FFFDF3] xl:sticky xl:top-28">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <Badge variant="primary">Preview</Badge>
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-3xl text-[#FFFDF3]">
            {preview.name || "Untitled private campaign"}
          </CardTitle>
          <CardDescription className="text-dark-muted">
            Public metadata preview before the transaction is submitted.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="rounded-2xl border border-muted-dark bg-charcoal p-4">
            <div className="flex items-center gap-2 text-primary">
              <FileText className="h-4 w-4" />
              <p className="technical-label">Public brief</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-dark-muted">
              {preview.description || "Campaign description will appear here."}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <PreviewMetric label="Category" value={preview.category || "grant"} />
            <PreviewMetric label="Budget" value={preview.publicBudget || "0"} />
            <PreviewMetric label="ERC-20" value={preview.token || "0x..."} />
            <PreviewMetric label="Nox token" value={preview.confidentialToken || "0x..."} />
          </div>
          <p className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm font-semibold leading-6 text-primary">
            Payout amounts stay out of public metadata. Keep this campaign copy free of private
            compensation details.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function PreviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-muted-dark bg-charcoal p-4">
      <p className="technical-label text-dark-muted">{label}</p>
      <p className="mt-2 truncate font-mono text-xs font-bold text-[#FFFDF3]">{value}</p>
    </div>
  );
}

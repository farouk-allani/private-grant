"use client";

import { createViemHandleClient } from "@iexec-nox/handle";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2, Send, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { parseUnits, type Address, type Hex } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWalletClient,
  useWriteContract
} from "wagmi";
import { TransactionTimeline } from "@/components/TransactionTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { erc7984Abi, privateGrantVaultAbi } from "@/lib/abis";
import { appChain } from "@/lib/chains";
import { env } from "@/lib/env";
import { formatContractError } from "@/lib/errors";
import type { Campaign } from "@/lib/types";
import { payoutSchema, type PayoutFormValues } from "@/lib/validation";

const OPERATOR_DURATION_SECONDS = 30n * 24n * 60n * 60n;

export function ConfidentialPayoutForm({ campaign }: { campaign: Campaign }) {
  const vaultAddress = env.vaultAddress;
  const { address } = useAccount();
  const walletClient = useWalletClient();
  const operator = useWriteContract();
  const payout = useWriteContract();
  const operatorReceipt = useWaitForTransactionReceipt({ hash: operator.data });
  const payoutReceipt = useWaitForTransactionReceipt({ hash: payout.data });
  const [encrypting, setEncrypting] = useState(false);
  const [encryptionError, setEncryptionError] = useState<string>();
  const form = useForm<PayoutFormValues>({
    resolver: zodResolver(payoutSchema),
    defaultValues: { recipient: "", amount: "", memo: "" }
  });
  const amount = form.watch("amount");

  const operatorUntil = useMemo(() => {
    return BigInt(Math.floor(Date.now() / 1000)) + OPERATOR_DURATION_SECONDS;
  }, []);

  const isOperator = useReadContract({
    address: campaign.confidentialToken,
    abi: erc7984Abi,
    functionName: "isOperator",
    args: address && vaultAddress ? [address, vaultAddress] : undefined,
    chainId: appChain.id,
    query: { enabled: Boolean(address && vaultAddress && campaign.confidentialToken) }
  });

  async function authorizeVault() {
    if (!vaultAddress) return;
    await operator.writeContractAsync({
      address: campaign.confidentialToken,
      abi: erc7984Abi,
      functionName: "setOperator",
      chainId: appChain.id,
      args: [vaultAddress, Number(operatorUntil)]
    });
    await isOperator.refetch();
  }

  async function onSubmit(values: PayoutFormValues) {
    if (!vaultAddress || !walletClient.data) return;
    setEncryptionError(undefined);
    setEncrypting(true);
    try {
      const handleClient = await createViemHandleClient(walletClient.data);
      const { handle, handleProof } = await handleClient.encryptInput(
        parseUnits(values.amount, 6),
        "uint256",
        vaultAddress
      );
      await payout.writeContractAsync({
        address: vaultAddress,
        abi: privateGrantVaultAbi,
        functionName: "sendConfidentialPayout",
        chainId: appChain.id,
        args: [campaign.id, values.recipient as Address, handle as Hex, handleProof as Hex, values.memo || ""]
      });
    } catch (error) {
      setEncryptionError(error instanceof Error ? error.message : "Unable to encrypt payout amount");
    } finally {
      setEncrypting(false);
    }
  }

  const canSend = Boolean(vaultAddress && walletClient.data && (isOperator.data || operatorReceipt.isSuccess));

  return (
    <Card className="border-muted-dark bg-ink text-[#FFFDF3]">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <Badge variant="primary">Confidential transfer</Badge>
          <ShieldAlert className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-[#FFFDF3]">Send confidential payout</CardTitle>
        <CardDescription className="text-dark-muted">
          The plaintext amount is sent to the Nox gateway for encryption and the transaction carries only
          an encrypted uint256 handle.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button
          type="button"
          variant={canSend ? "ghost" : "secondary"}
          onClick={authorizeVault}
          disabled={!vaultAddress || operator.isPending || operatorReceipt.isLoading}
        >
          {operator.isPending || operatorReceipt.isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <KeyRound className="h-4 w-4" />
          )}
          {canSend ? "Vault authorized" : "Authorize vault operator"}
        </Button>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <Field label="Recipient wallet" description="Public recipient address for the settlement record." error={form.formState.errors.recipient?.message}>
            <Input placeholder="0x..." {...form.register("recipient")} />
          </Field>
          <Field label="Confidential amount" description="Encrypted before the vault write. Do not place this value in the memo." error={form.formState.errors.amount?.message}>
            <Input inputMode="decimal" placeholder="750" {...form.register("amount")} />
          </Field>
          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
            <p className="technical-label text-primary">Encrypted preview</p>
            <p className="mt-2 font-mono text-sm font-black text-[#FFFDF3]">
              {amount ? "•••• RLC" : "Amount hidden after encryption"}
            </p>
          </div>
          <Field label="Public memo" description="Keep memo safe for public observers." error={form.formState.errors.memo?.message}>
            <Input placeholder="Milestone accepted" {...form.register("memo")} />
          </Field>
          <p className="rounded-2xl border border-primary/20 bg-primary-pale p-4 text-sm font-bold leading-6 text-ink">
            Do not expose payout amount in public metadata.
          </p>
          <Button type="submit" size="lg" disabled={!canSend || encrypting || payout.isPending || payoutReceipt.isLoading}>
            {encrypting || payout.isPending || payoutReceipt.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Send Confidential Payout
          </Button>
        </form>
        <TransactionTimeline
          steps={[
            {
              label: "ERC-7984 operator approval",
              state: canSend ? "done" : operator.isPending || operatorReceipt.isLoading ? "pending" : "idle",
              hash: operator.data
            },
            {
              label: "Nox confirmation",
              state: payoutReceipt.isSuccess ? "done" : encrypting ? "pending" : "idle"
            },
            {
              label: "Confidential transfer",
              state: payoutReceipt.isSuccess
                ? "done"
                : payout.isPending || payoutReceipt.isLoading
                  ? "pending"
                  : "idle",
              hash: payout.data
            },
            {
              label: "Settlement recorded",
              state: payoutReceipt.isSuccess
                ? "done"
                : payout.isPending || payoutReceipt.isLoading
                  ? "pending"
                  : "idle",
              hash: payout.data
            }
          ]}
        />
        {encryptionError ? <p className="text-sm text-danger">{encryptionError}</p> : null}
        {operator.error ? <p className="text-sm text-danger">{formatContractError(operator.error)}</p> : null}
        {payout.error ? <p className="text-sm text-danger">{formatContractError(payout.error)}</p> : null}
      </CardContent>
    </Card>
  );
}

"use client";

import { createViemHandleClient } from "@iexec-nox/handle";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2, Send } from "lucide-react";
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
import { erc7984Abi, privateGrantVaultAbi } from "@/lib/abis";
import { env } from "@/lib/env";
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

  const operatorUntil = useMemo(() => {
    return BigInt(Math.floor(Date.now() / 1000)) + OPERATOR_DURATION_SECONDS;
  }, []);

  const isOperator = useReadContract({
    address: campaign.confidentialToken,
    abi: erc7984Abi,
    functionName: "isOperator",
    args: address && vaultAddress ? [address, vaultAddress] : undefined,
    query: { enabled: Boolean(address && vaultAddress && campaign.confidentialToken) }
  });

  async function authorizeVault() {
    if (!vaultAddress) return;
    await operator.writeContractAsync({
      address: campaign.confidentialToken,
      abi: erc7984Abi,
      functionName: "setOperator",
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
    <Card>
      <CardHeader>
        <CardTitle>Send confidential payout</CardTitle>
        <CardDescription>
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
          <Field label="Recipient wallet" error={form.formState.errors.recipient?.message}>
            <Input placeholder="0x..." {...form.register("recipient")} />
          </Field>
          <Field label="Private payout amount" error={form.formState.errors.amount?.message}>
            <Input inputMode="decimal" placeholder="750" {...form.register("amount")} />
          </Field>
          <Field label="Public memo" error={form.formState.errors.memo?.message}>
            <Input placeholder="Milestone accepted" {...form.register("memo")} />
          </Field>
          <Button type="submit" disabled={!canSend || encrypting || payout.isPending || payoutReceipt.isLoading}>
            {encrypting || payout.isPending || payoutReceipt.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Encrypt and send payout
          </Button>
        </form>
        <TransactionTimeline
          steps={[
            {
              label: "Authorize vault as ERC-7984 operator",
              state: canSend ? "done" : operator.isPending || operatorReceipt.isLoading ? "pending" : "idle",
              hash: operator.data
            },
            {
              label: "Encrypt amount with Nox Handle SDK",
              state: payoutReceipt.isSuccess ? "done" : encrypting ? "pending" : "idle"
            },
            {
              label: "Send confidential transfer",
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
        {operator.error ? <p className="text-sm text-danger">{operator.error.message}</p> : null}
        {payout.error ? <p className="text-sm text-danger">{payout.error.message}</p> : null}
      </CardContent>
    </Card>
  );
}

"use client";

import { createViemHandleClient } from "@iexec-nox/handle";
import { Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import { type Address, type Hex, zeroHash } from "viem";
import { useReadContract, useWalletClient } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { erc7984Abi } from "@/lib/abis";
import { formatTokenAmount, shortenAddress } from "@/lib/format";

export function RecipientBalanceCard({
  confidentialToken,
  account
}: {
  confidentialToken?: Address;
  account?: Address;
}) {
  const walletClient = useWalletClient();
  const [value, setValue] = useState<string>();
  const [error, setError] = useState<string>();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const balance = useReadContract({
    address: confidentialToken,
    abi: erc7984Abi,
    functionName: "confidentialBalanceOf",
    args: account ? [account] : undefined,
    query: { enabled: Boolean(confidentialToken && account) }
  });

  async function decryptBalance() {
    if (!walletClient.data || !balance.data || balance.data === zeroHash) return;
    setError(undefined);
    setIsDecrypting(true);
    try {
      const handleClient = await createViemHandleClient(walletClient.data);
      const decrypted = await handleClient.decrypt(balance.data as Hex);
      setValue(formatTokenAmount(BigInt(decrypted.value.toString()), 6));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to decrypt this Nox handle");
    } finally {
      setIsDecrypting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recipient confidential balance</CardTitle>
        <CardDescription>
          Nox returns a balance handle. Decryption requires wallet signature and viewer access.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm">
        <div className="rounded-md border border-white/10 bg-white/[0.03] p-3 text-muted">
          <p>Token {shortenAddress(confidentialToken)}</p>
          <p className="mt-2 break-all">Balance handle: {balance.data || "Unavailable"}</p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={decryptBalance}
          disabled={!balance.data || balance.data === zeroHash || isDecrypting}
        >
          {isDecrypting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
          Decrypt my balance
        </Button>
        {value ? <p className="text-primary">Decrypted balance: {value}</p> : null}
        {error ? <p className="text-danger">{error}</p> : null}
      </CardContent>
    </Card>
  );
}

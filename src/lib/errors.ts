const RPC_UNAVAILABLE_PATTERNS = [
  /requested resource not available/i,
  /rpc endpoint not found/i,
  /endpoint not found or unavailable/i,
  /resource unavailable/i
];

export function formatContractError(error?: Error | null): string | undefined {
  if (!error?.message) return undefined;

  if (/user rejected|user denied|denied transaction signature/i.test(error.message)) {
    return "You rejected the wallet request. Open the wallet popup and confirm the transaction to continue.";
  }

  if (/insufficient funds/i.test(error.message)) {
    return "This wallet does not have enough funds for the transaction. Add test ETH for gas or demo tokens for the amount.";
  }

  if (/max fee per gas less than block base fee/i.test(error.message)) {
    return [
      "The wallet offered a gas fee below the current Arbitrum Sepolia base fee.",
      "Retry the transaction, or edit the wallet gas settings and raise the max fee."
    ].join(" ");
  }

  if (/transaction failed|transaction was reverted|execution reverted/i.test(error.message)) {
    return "The transaction failed on-chain. Check the amount, wallet permissions, and available shielded balance, then try again.";
  }

  if (RPC_UNAVAILABLE_PATTERNS.some((pattern) => pattern.test(error.message))) {
    return [
      "The wallet could not reach the Arbitrum Sepolia RPC endpoint.",
      "Update the wallet's Arbitrum Sepolia RPC URL, then reconnect or switch networks and try again."
    ].join(" ");
  }

  return error.message;
}

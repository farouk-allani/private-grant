const RPC_UNAVAILABLE_PATTERNS = [
  /requested resource not available/i,
  /rpc endpoint not found/i,
  /endpoint not found or unavailable/i,
  /resource unavailable/i
];

export function formatContractError(error?: Error | null): string | undefined {
  if (!error?.message) return undefined;

  if (RPC_UNAVAILABLE_PATTERNS.some((pattern) => pattern.test(error.message))) {
    return [
      "The wallet could not reach the Arbitrum Sepolia RPC endpoint.",
      "Update the wallet's Arbitrum Sepolia RPC URL, then reconnect or switch networks and try again."
    ].join(" ");
  }

  return error.message;
}

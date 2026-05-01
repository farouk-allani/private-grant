import { formatUnits, type Address } from "viem";

export function shortenAddress(address?: Address | string, chars = 4) {
  if (!address) return "Not connected";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatTokenAmount(value: bigint, decimals = 18) {
  const formatted = formatUnits(value, decimals);
  const [whole, fraction = ""] = formatted.split(".");
  return fraction ? `${whole}.${fraction.slice(0, 4).replace(/0+$/, "")}` : whole;
}

export function formatDate(timestamp: bigint | number) {
  const n = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  if (!n) return "Open-ended";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(n * 1000));
}

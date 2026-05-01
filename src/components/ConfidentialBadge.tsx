import { Badge } from "@/components/ui/badge";

export function ConfidentialBadge() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="primary">Confidential</Badge>
      <Badge variant="secondary">TEE-backed</Badge>
      <Badge>Nox ERC-7984</Badge>
      <Badge variant="primary">Arbitrum Sepolia</Badge>
    </div>
  );
}

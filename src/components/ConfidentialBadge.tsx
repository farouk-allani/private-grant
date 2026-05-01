import { Badge } from "@/components/ui/badge";

export function ConfidentialBadge() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">Confidential</Badge>
      <Badge variant="primary">TEE-backed</Badge>
      <Badge>Nox</Badge>
      <Badge>ERC-7984</Badge>
      <Badge variant="warning">Arbitrum Sepolia</Badge>
    </div>
  );
}

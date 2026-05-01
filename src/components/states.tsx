import { AlertTriangle, Loader2, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function LoadingState({ label = "Loading on-chain data" }: { label?: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-8 text-muted">
        <Loader2 className="h-5 w-5 animate-spin text-primary-deep" />
        <span className="font-semibold">{label}</span>
      </CardContent>
    </Card>
  );
}

export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="flex gap-4 py-8">
        <Search className="mt-1 h-5 w-5 text-primary-deep" />
        <div>
          <p className="font-black text-ink">{title}</p>
          <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ErrorState({
  title = "Something failed",
  description
}: {
  title?: string;
  description: string;
}) {
  return (
    <Card className="border-danger/25">
      <CardContent className="flex gap-4 py-8">
        <AlertTriangle className="mt-1 h-5 w-5 text-danger" />
        <div>
          <p className="font-black text-ink">{title}</p>
          <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

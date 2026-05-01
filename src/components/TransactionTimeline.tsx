import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineStep = {
  label: string;
  state: "idle" | "pending" | "done";
  hash?: string;
};

export function TransactionTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="grid gap-3">
      {steps.map((step) => (
        <div
          key={step.label}
          className={cn(
            "flex items-start gap-3 rounded-md border border-white/10 bg-white/[0.03] p-3 text-sm",
            step.state === "done" && "border-primary/25 bg-primary/8",
            step.state === "pending" && "border-secondary/25 bg-secondary/10"
          )}
        >
          {step.state === "done" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
          ) : step.state === "pending" ? (
            <Loader2 className="mt-0.5 h-4 w-4 animate-spin text-secondary" />
          ) : (
            <Circle className="mt-0.5 h-4 w-4 text-muted" />
          )}
          <div>
            <p className="font-medium text-white">{step.label}</p>
            {step.hash ? (
              <a
                className="mt-1 block break-all text-xs text-primary hover:underline"
                href={`https://sepolia.arbiscan.io/tx/${step.hash}`}
                target="_blank"
                rel="noreferrer"
              >
                {step.hash}
              </a>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

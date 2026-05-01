import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineStep = {
  label: string;
  state: "idle" | "pending" | "done";
  hash?: string;
};

export function TransactionTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="relative grid gap-3 rounded-[28px] border border-muted-dark bg-ink p-4">
      <div className="absolute bottom-6 left-[31px] top-6 w-px bg-primary/25" />
      {steps.map((step, index) => (
        <div
          key={step.label}
          className={cn(
            "relative flex items-start gap-3 rounded-2xl border border-muted-dark bg-charcoal p-3 text-sm",
            step.state === "done" && "border-primary/35 bg-primary/10",
            step.state === "pending" && "border-info/35 bg-info/10"
          )}
        >
          {step.state === "done" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          ) : step.state === "pending" ? (
            <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-info" />
          ) : (
            <Circle className="mt-0.5 h-4 w-4 shrink-0 text-dark-muted" />
          )}
          <div className="min-w-0">
            <p className="font-mono text-[0.65rem] font-black uppercase tracking-[0.14em] text-dark-muted">
              Step {index + 1}
            </p>
            <p className="mt-1 font-bold text-[#FFFDF3]">{step.label}</p>
            {step.hash ? (
              <a
                className="mt-2 block break-all font-mono text-xs text-primary hover:underline"
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

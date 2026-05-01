import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ErrorMessage({
  children,
  className
}: {
  children?: ReactNode;
  className?: string;
}) {
  if (!children) return null;

  return (
    <p
      className={cn(
        "max-w-full overflow-hidden rounded-2xl border border-danger/30 bg-danger/10 p-3 text-sm leading-6 text-danger [overflow-wrap:anywhere]",
        className
      )}
    >
      {children}
    </p>
  );
}

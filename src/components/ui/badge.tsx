import * as React from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "border-border bg-surface text-muted",
  primary: "border-primary-deep/35 bg-primary text-ink",
  secondary: "border-muted-dark bg-ink text-primary",
  warning: "border-primary-deep/35 bg-primary-pale text-primary-deep",
  danger: "border-danger/30 bg-danger/10 text-danger"
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-2 rounded-full border px-3 font-mono text-[0.68rem] font-extrabold uppercase tracking-[0.14em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-current before:content-['']",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

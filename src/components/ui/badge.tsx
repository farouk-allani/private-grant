import * as React from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "border-white/10 bg-white/8 text-slate-200",
  primary: "border-primary/25 bg-primary/10 text-primary",
  secondary: "border-secondary/25 bg-secondary/15 text-violet-200",
  warning: "border-warning/25 bg-warning/10 text-warning",
  danger: "border-danger/25 bg-danger/10 text-red-200"
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

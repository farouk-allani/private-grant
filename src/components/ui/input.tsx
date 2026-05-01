import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-primary/70 focus:ring-2 focus:ring-primary/15",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

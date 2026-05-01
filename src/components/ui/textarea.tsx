import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-28 w-full rounded-md border border-white/10 bg-white/[0.04] px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-primary/70 focus:ring-2 focus:ring-primary/15",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

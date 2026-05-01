"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-11 items-center justify-center gap-2 rounded-[28px] px-5 text-xs font-black uppercase tracking-[0.08em] transition-all focus:outline-none focus:ring-2 focus:ring-primary/55 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-b-4 border-primary-deep bg-primary text-ink shadow-[0_0_0_1px_rgba(255,216,0,0.35),0_20px_60px_rgba(255,216,0,0.12)] hover:bg-primary-hover active:translate-y-[2px] active:border-b-2",
        secondary:
          "border-2 border-ink bg-transparent text-ink hover:bg-ink hover:text-primary",
        ghost:
          "border border-border bg-surface text-ink hover:border-primary hover:bg-primary-pale",
        danger: "border-b-4 border-red-900/45 bg-danger text-white hover:bg-red-500 active:translate-y-[2px] active:border-b-2",
        outline:
          "border border-muted-dark bg-ink text-primary hover:bg-charcoal"
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3 text-[0.68rem]",
        lg: "h-[52px] min-h-[52px] px-7 py-4",
        icon: "h-11 w-11 px-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
);
Button.displayName = "Button";

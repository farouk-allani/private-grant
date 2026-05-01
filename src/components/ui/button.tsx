"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/70 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-slate-950 hover:bg-primary/90",
        secondary: "bg-secondary text-white hover:bg-secondary/90",
        ghost: "bg-white/5 text-slate-100 hover:bg-white/10",
        danger: "bg-danger text-white hover:bg-danger/90",
        outline: "border border-white/12 bg-transparent text-slate-100 hover:bg-white/8"
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3",
        lg: "h-12 px-5",
        icon: "h-10 w-10 px-0"
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

import type React from "react"
import { cn } from "@/lib/utils"

interface NeutronBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "accent" | "success" | "warning" | "destructive"
  children: React.ReactNode
}

export function NeutronBadge({ variant = "primary", className, children, ...props }: NeutronBadgeProps) {
  const variantStyles = {
    primary: "bg-primary/20 text-primary border border-primary/50",
    accent: "bg-accent/20 text-accent border border-accent/50",
    success: "bg-green-500/20 text-green-400 border border-green-500/50",
    warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50",
    destructive: "bg-destructive/20 text-destructive border border-destructive/50",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

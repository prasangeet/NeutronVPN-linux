import type React from "react"
import { cn } from "@/lib/utils"

interface NeutronButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export function NeutronButton({ variant = "primary", size = "md", className, children, ...props }: NeutronButtonProps) {
  const baseStyles = "relative overflow-hidden group transition-all duration-300"

  const variantStyles = {
    primary: "bg-primary hover:bg-primary/90 text-primary-foreground",
    secondary: "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
    accent: "bg-accent hover:bg-accent/90 text-accent-foreground",
    outline: "border-2 border-primary text-primary hover:bg-primary/10",
  }

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], "rounded-lg font-semibold", className)}
      {...props}
    >
      {/* Neutron glow effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-500"></span>
      <span className="relative z-10">{children}</span>
    </button>
  )
}

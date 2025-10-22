import type React from "react"
import { cn } from "@/lib/utils"

interface NeutronCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  glow?: boolean
}

export function NeutronCard({ children, glow = false, className, ...props }: NeutronCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-primary/20 bg-card/50 backdrop-blur overflow-hidden",
        glow && "shadow-lg shadow-primary/20",
        className,
      )}
      {...props}
    >
      {/* Animated border glow */}
      {glow && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 animate-pulse pointer-events-none"></div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

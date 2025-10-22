"use client"

export default function VPNToggle({ isConnected, onToggle }) {
  return (
    <div className="relative">
      <button
        onClick={() => onToggle(!isConnected)}
        className={`relative w-40 h-40 rounded-full transition-all duration-500 ${
          isConnected
            ? "bg-gradient-to-br from-primary via-accent to-secondary shadow-2xl shadow-primary/50"
            : "bg-gradient-to-br from-muted to-muted/50 shadow-lg"
        }`}
      >
        {/* Outer ring */}
        <div
          className={`absolute inset-0 rounded-full border-4 transition-all duration-500 ${
            isConnected ? "border-accent/50 animate-pulse" : "border-border/30"
          }`}
        />

        {/* Inner content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-foreground mb-2">{isConnected ? "✓" : "○"}</div>
            <p className="text-sm font-semibold text-primary-foreground">{isConnected ? "CONNECTED" : "CONNECT"}</p>
          </div>
        </div>

        {/* Animated particles around button */}
        {isConnected && (
          <>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-accent animate-pulse" />
            <div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-accent animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
            <div
              className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-accent animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-accent animate-pulse"
              style={{ animationDelay: "1.5s" }}
            />
          </>
        )}
      </button>
    </div>
  )
}

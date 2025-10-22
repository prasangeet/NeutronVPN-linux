export default function NeutronBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/80" />

      {/* Animated neutron particles */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 blur-3xl animate-float" />
      <div
        className="absolute top-40 right-20 w-40 h-40 rounded-full bg-gradient-to-br from-accent/20 to-secondary/10 blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-20 left-1/3 w-36 h-36 rounded-full bg-gradient-to-br from-secondary/20 to-primary/10 blur-3xl animate-float"
        style={{ animationDelay: "4s" }}
      />

      {/* Orbital rings */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-primary/10 rounded-full animate-orbit" />
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-accent/10 rounded-full animate-orbit"
        style={{ animationDirection: "reverse", animationDuration: "30s" }}
      />

      {/* Particle dots */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary/40 animate-pulse-glow" />
      <div
        className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-accent/40 animate-pulse-glow"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-1/3 left-1/2 w-2.5 h-2.5 rounded-full bg-secondary/40 animate-pulse-glow"
        style={{ animationDelay: "2s" }}
      />
    </div>
  )
}

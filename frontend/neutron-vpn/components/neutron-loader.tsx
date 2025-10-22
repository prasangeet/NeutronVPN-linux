export function NeutronLoader() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-12 h-12">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary animate-spin"></div>

        {/* Middle ring */}
        <div
          className="absolute inset-2 rounded-full border-2 border-transparent border-b-accent border-l-accent animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        ></div>

        {/* Inner particle */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary to-accent animate-pulse"></div>
      </div>
    </div>
  )
}

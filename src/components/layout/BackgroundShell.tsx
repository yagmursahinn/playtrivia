export function BackgroundShell() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-pink/10 sm:h-80 sm:w-80" />
      <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-blue/10 sm:h-72 sm:w-72" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,100,208,0.04),transparent_45%)]" />
    </div>
  );
}

import { Link } from "@tanstack/react-router";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = size === "sm" ? "size-8 text-base" : size === "lg" ? "size-12 text-2xl" : "size-10 text-lg";
  const text = size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : "text-lg";
  return (
    <Link to="/" className={`inline-flex rounded-md ${focusRing}`} aria-label="ArenaIQ home">
      <div className="flex items-center gap-2.5 group">
        <div className={`${dims} rounded-xl flex items-center justify-center font-bold text-primary-foreground shrink-0 relative overflow-hidden`}
             style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
          <span className="relative z-10">🏟</span>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        </div>
        <div className="flex flex-col leading-none">
          <span className={`${text} font-bold tracking-tight`}>
            Arena<span className="text-gradient">IQ</span>
          </span>
          {size !== "sm" && <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">Stadium Intelligence</span>}
        </div>
      </div>
    </Link>
  );
}

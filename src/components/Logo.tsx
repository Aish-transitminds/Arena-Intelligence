import { Link } from "@tanstack/react-router";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const iconSize = size === "sm" ? "size-7" : size === "lg" ? "size-11" : "size-9";
  const textSize = size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base";

  return (
    <Link to="/" className={`inline-flex rounded-md ${focusRing}`} aria-label="Arena Intelligence home">
      <div className="flex items-center gap-3 group">
        {/* Shield / Crest mark */}
        <div
          className={`${iconSize} rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden`}
          style={{
            background: "linear-gradient(145deg, #0E9F6E 0%, #3CB371 100%)",
            boxShadow: "0 4px 16px rgba(14, 159, 110, 0.30)",
          }}
        >
          <svg viewBox="0 0 32 32" fill="none" className="size-5 relative z-10">
            {/* Stylised pitch lines forming a shield */}
            <path d="M16 2L4 8V17C4 22.5 9.5 27.5 16 30C22.5 27.5 28 22.5 28 17V8L16 2Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.60)" strokeWidth="1.2" strokeLinejoin="round" />
            <circle cx="16" cy="17" r="5.5" fill="none" stroke="rgba(255,255,255,0.80)" strokeWidth="1.2" />
            <line x1="16" y1="11.5" x2="16" y2="22.5" stroke="rgba(255,255,255,0.80)" strokeWidth="1.2" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent" />
        </div>

        <div className="flex flex-col leading-none">
          <span className={`${textSize} font-extrabold tracking-tight text-foreground`}>
            Arena <span style={{ color: "#0E9F6E" }}>Intelligence</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

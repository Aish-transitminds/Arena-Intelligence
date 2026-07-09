import { Link, useRouterState } from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";
import {
  LayoutDashboard,
  ShieldAlert,
  Trophy,
  User,
  Settings,
  Bell,
  Search,
  Home,
  Radio,
  FileText,
} from "lucide-react";
import { Logo } from "./Logo";
import { AIAssistant } from "./AIAssistant";
import { canAccessRoute, getStoredRole, persistRole } from "@/lib/security";

type NavItem = {
  to: "/fan" | "/admin" | "/tournament" | "/emergency" | "/assistant" | "/security" | "/audit";
  label: string;
  icon: typeof User;
  hint?: string;
};

const navSections: { label: string; items: NavItem[] }[] = [
  {
    label: "Fan Experience",
    items: [
      { to: "/fan", label: "Fan Dashboard", icon: User, hint: "Ticket & seat" },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/admin", label: "Admin Console", icon: LayoutDashboard, hint: "Live KPIs" },
      { to: "/tournament", label: "Tournament", icon: Trophy, hint: "Fixtures" },
      { to: "/emergency", label: "Emergency Center", icon: ShieldAlert, hint: "SOS" },
      { to: "/security", label: "Security", icon: Settings, hint: "Platform" },
      { to: "/audit", label: "Audit Log", icon: FileText, hint: "Events" },
    ],
  },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function AppShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeItem = navSections.flatMap((s) => s.items).find((i) => pathname.startsWith(i.to));
  const role = getStoredRole();

  useEffect(() => {
    if (role === "guest") {
      persistRole("fan");
    }
  }, [role]);

  if (!canAccessRoute(pathname, role)) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background px-6 text-center">
        <div className="glass-strong max-w-md rounded-3xl border border-destructive/20 p-8">
          <p className="text-xs uppercase tracking-[0.32em] text-destructive">Access Denied</p>
          <h1 className="mt-4 text-2xl font-semibold text-white">You do not have permission to view this area.</h1>
          <p className="mt-3 text-sm" style={{ color: "#AAB8C2" }}>Please sign in with the correct role to continue.</p>
          <Link to="/login" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white">
            Return to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex relative bg-background">
      {/* Global Stadium Backdrop */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/stadium-hero.png"
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.18, mixBlendMode: "luminosity" }}
        />
        {/* Dark radial gradient overlay for focus and text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(7,20,28,0.75) 0%, rgba(7,20,28,0.95) 80%, rgba(7,20,28,0.98) 100%)",
            backdropFilter: "blur(3px)",
          }}
        />
      </div>

      <div className="relative z-10 flex w-full">
      {/* Sidebar */}
      <aside
        aria-label="Primary navigation"
        className="hidden md:flex w-[260px] shrink-0 flex-col glass-sidebar sticky top-0 h-dvh"
      >
        {/* Logo area */}
        <div className="px-5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <Logo />
        </div>

        {/* Live status ticker */}
        <div className="px-5 py-3 border-b flex items-center gap-2.5" style={{ borderColor: "rgba(255,255,255,0.04)", background: "rgba(14,159,110,0.05)" }}>
          <Radio className="size-3 text-primary animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#0E9F6E" }}>
            Live Operations
          </span>
          <span className="ml-auto text-[10px]" style={{ color: "#AAB8C2" }}>
            12:10 IST
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6" aria-label="Sections">
          {navSections.map((section) => (
            <div key={section.label}>
              <div
                className="px-3 pb-2.5 text-[9px] font-bold uppercase tracking-[0.22em]"
                style={{ color: "rgba(170,184,194,0.50)" }}
              >
                {section.label}
              </div>
              <ul className="space-y-0.5">
                {section.items.map(({ to, label, icon: Icon, hint }) => {
                  const active = pathname === to || pathname.startsWith(to + "/");
                  return (
                    <li key={to}>
                      <Link
                        to={to}
                        aria-current={active ? "page" : undefined}
                        className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${focusRing} ${
                          active
                            ? "text-white"
                            : "hover:text-white"
                        }`}
                        style={
                          active
                            ? {
                                background: "linear-gradient(135deg, rgba(14,159,110,0.15), rgba(60,179,113,0.08))",
                                border: "1px solid rgba(14,159,110,0.18)",
                              }
                            : { color: "#AAB8C2" }
                        }
                      >
                        {/* Active indicator rail */}
                        <span
                          aria-hidden="true"
                          className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full transition-opacity`}
                          style={{
                            background: "#0E9F6E",
                            opacity: active ? 1 : 0,
                          }}
                        />
                        <Icon
                          className="size-4 shrink-0 transition-colors"
                          style={{ color: active ? "#0E9F6E" : undefined }}
                          aria-hidden="true"
                        />
                        <span className="flex-1 font-medium">{label}</span>
                        {hint && (
                          <span className="text-[10px] transition-colors" style={{ color: "rgba(170,184,194,0.50)" }}>
                            {hint}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User card at bottom */}
        <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="glass rounded-xl p-3 flex items-center gap-3">
            <div
              className="size-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #0E9F6E, #3CB371)" }}
            >
              AI
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate text-white">Aishwarya</div>
              <div className="text-[10px] truncate uppercase tracking-[0.16em]" style={{ color: "#AAB8C2" }}>Ops Manager</div>
            </div>
            <button
              type="button"
              aria-label="Account settings"
              className={`size-8 rounded-md flex items-center justify-center transition-colors hover:text-white ${focusRing}`}
              style={{ color: "#AAB8C2" }}
            >
              <Settings className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header
          className="sticky top-0 z-30 backdrop-blur-2xl"
          style={{
            background: "rgba(7,20,28,0.85)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.20)",
          }}
        >
          <div className="flex items-center gap-4 px-6 py-3.5">
            {/* Breadcrumb + title */}
            <div className="flex-1 min-w-0">
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs" style={{ color: "#AAB8C2" }}>
                <Link to="/" className={`inline-flex items-center gap-1 rounded hover:text-white transition-colors ${focusRing}`}>
                  <Home className="size-3" aria-hidden="true" />
                  <span>Arena Intelligence</span>
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-white/80">{activeItem?.label ?? title}</span>
              </nav>
              <h1 className="mt-0.5 text-xl font-bold tracking-tight truncate text-white">{title}</h1>
              {subtitle && <p className="text-xs mt-0.5 truncate" style={{ color: "#AAB8C2" }}>{subtitle}</p>}
            </div>

            {/* Search */}
            <label className="hidden lg:flex items-center gap-2 glass rounded-xl px-3 py-2 w-72 transition" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              <Search className="size-4 shrink-0" style={{ color: "#AAB8C2" }} aria-hidden="true" />
              <span className="sr-only">Search</span>
              <input
                type="search"
                placeholder="Search fixtures, sections, alerts…"
                className="bg-transparent text-sm outline-none flex-1 placeholder:text-[#AAB8C2]/60 text-white"
              />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded" style={{ border: "1px solid rgba(255,255,255,0.10)", color: "#AAB8C2" }}>⌘K</kbd>
            </label>

            {/* Notifications */}
            <button
              type="button"
              aria-label="Notifications, 1 unread"
              className={`relative size-10 rounded-xl glass flex items-center justify-center transition ${focusRing}`}
              style={{ color: "#AAB8C2" }}
            >
              <Bell className="size-4" aria-hidden="true" />
              <span
                aria-hidden="true"
                className="absolute top-2 right-2 size-2 rounded-full"
                style={{ background: "#D92D20", boxShadow: "0 0 6px rgba(217,45,32,0.60)", outline: "2px solid #07141C" }}
              />
            </button>
          </div>

          {/* Mobile nav strip */}
          <nav
            aria-label="Primary"
            className="md:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto scrollbar-none"
          >
            {navSections.flatMap((s) => s.items).map(({ to, label, icon: Icon }) => {
              const active = pathname === to || pathname.startsWith(to + "/");
              return (
                <Link
                  key={to}
                  to={to}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${focusRing}`}
                  style={
                    active
                      ? { background: "rgba(14,159,110,0.15)", color: "#fff", border: "1px solid rgba(14,159,110,0.30)" }
                      : { color: "#AAB8C2", border: "1px solid transparent" }
                  }
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="flex-1 min-w-0 p-6 lg:p-8">{children}</main>
      </div>
      </div>

      <AIAssistant />
    </div>
  );
}


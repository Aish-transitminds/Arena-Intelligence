import { Link, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import {
  LayoutDashboard,
  ShieldAlert,
  Trophy,
  User,
  Sparkles,
  Settings,
  Bell,
  Search,
  Home,
} from "lucide-react";
import { Logo } from "./Logo";
import { AIAssistant } from "./AIAssistant";

type NavItem = {
  to: "/fan" | "/admin" | "/tournament" | "/emergency" | "/assistant";
  label: string;
  icon: typeof User;
  hint?: string;
};

const navSections: { label: string; items: NavItem[] }[] = [
  {
    label: "Experience",
    items: [
      { to: "/fan", label: "Fan Dashboard", icon: User, hint: "Ticket & seat" },
      { to: "/assistant", label: "AI Assistant", icon: Sparkles, hint: "Copilot" },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/admin", label: "Admin Console", icon: LayoutDashboard, hint: "Live KPIs" },
      { to: "/tournament", label: "Tournament", icon: Trophy, hint: "Fixtures" },
      { to: "/emergency", label: "Emergency", icon: ShieldAlert, hint: "SOS" },
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

  return (
    <div className="min-h-dvh flex">
      {/* Sidebar */}
      <aside
        aria-label="Primary navigation"
        className="hidden md:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/70 backdrop-blur-xl sticky top-0 h-dvh"
      >
        <div className="px-5 py-5 border-b border-sidebar-border">
          <Logo />
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6" aria-label="Sections">
          {navSections.map((section) => (
            <div key={section.label}>
              <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
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
                        className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${focusRing} ${
                          active
                            ? "bg-primary/12 text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/70"
                        }`}
                      >
                        {/* active rail */}
                        <span
                          aria-hidden="true"
                          className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-primary transition-opacity ${
                            active ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        <Icon
                          className={`size-4 shrink-0 transition-colors ${
                            active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                          }`}
                          aria-hidden="true"
                        />
                        <span className="flex-1 font-medium">{label}</span>
                        {hint && (
                          <span className="text-[10px] text-muted-foreground/60 group-hover:text-muted-foreground">
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

        <div className="p-3 border-t border-sidebar-border">
          <div className="glass rounded-xl p-3 flex items-center gap-3">
            <div className="size-9 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-sm font-semibold text-primary-foreground">
              AR
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">Alex Reyes</div>
              <div className="text-xs text-muted-foreground truncate">Ops Manager</div>
            </div>
            <button
              type="button"
              aria-label="Account settings"
              className={`size-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-accent ${focusRing}`}
            >
              <Settings className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 glass-strong border-b border-border">
          <div className="flex items-center gap-4 px-6 py-3.5">
            {/* Breadcrumb + title */}
            <div className="flex-1 min-w-0">
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Link to="/" className={`inline-flex items-center gap-1 rounded hover:text-foreground ${focusRing}`}>
                  <Home className="size-3" aria-hidden="true" />
                  <span>ArenaIQ</span>
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-foreground/80">{activeItem?.label ?? title}</span>
              </nav>
              <h1 className="mt-0.5 text-xl font-semibold tracking-tight truncate">{title}</h1>
              {subtitle && <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>}
            </div>

            {/* Search */}
            <label className="hidden lg:flex items-center gap-2 glass rounded-lg px-3 py-2 w-72 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/30 transition">
              <Search className="size-4 text-muted-foreground" aria-hidden="true" />
              <span className="sr-only">Search</span>
              <input
                type="search"
                placeholder="Search fixtures, sections, alerts…"
                className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground"
              />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground">⌘K</kbd>
            </label>

            {/* Notifications */}
            <button
              type="button"
              aria-label="Notifications, 1 unread"
              className={`relative size-10 rounded-lg glass flex items-center justify-center hover:border-primary/40 transition ${focusRing}`}
            >
              <Bell className="size-4" aria-hidden="true" />
              <span
                aria-hidden="true"
                className="absolute top-2 right-2 size-2 rounded-full bg-destructive ring-2 ring-background"
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${focusRing} ${
                    active
                      ? "bg-primary/15 text-foreground border border-primary/40"
                      : "text-muted-foreground border border-transparent hover:text-foreground hover:bg-sidebar-accent"
                  }`}
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

      <AIAssistant />
    </div>
  );
}

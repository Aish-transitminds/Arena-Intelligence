const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, '../src/styles.css');
let content = fs.readFileSync(stylesPath, 'utf8');

// Replace the entire :root block with the new multi-theme architecture
const rootRegex = /:root\s*{[\s\S]*?}(?=\s*\/\* ===================================================\s*BASE STYLES)/;
const newThemes = `/* ===================================================
   ARENA INTELLIGENCE — MULTI-THEME ARCHITECTURE
=================================================== */
/* Theme 1: Enterprise Ops (Linear/Palantir-lite) */
[data-theme="enterprise"] {
  --background: #0B0E14;
  --surface: #12161F;
  --card-bg: #12161F;
  --foreground: #F8FAFC;
  --card: #12161F;
  --card-foreground: #F8FAFC;
  --popover: #1A1F2B;
  --popover-foreground: #F8FAFC;
  --primary: #00E5FF;
  --primary-foreground: #0B0E14;
  --primary-glow: #00E5FF;
  --secondary: #1E293B;
  --secondary-foreground: #F8FAFC;
  --accent: #F4B400;
  --accent-foreground: #0B0E14;
  --warning: #F4B400;
  --warning-foreground: #0B0E14;
  --destructive: #EF4444;
  --destructive-foreground: #FFFFFF;
  --success: #00E5FF;
  --muted: #1E293B;
  --muted-foreground: #94A3B8;
  --border: rgba(255, 255, 255, 0.08);
  --input: rgba(255, 255, 255, 0.08);
  --ring: #00E5FF;
  --chart-1: #00E5FF;
  --chart-2: #F4B400;
  --chart-3: #94A3B8;
  --chart-4: #EF4444;
  --chart-5: #1E293B;
  --sidebar: #0B0E14;
  --sidebar-foreground: #F8FAFC;
  --sidebar-primary: #00E5FF;
  --sidebar-primary-foreground: #0B0E14;
  --sidebar-accent: #12161F;
  --sidebar-accent-foreground: #F8FAFC;
  --sidebar-border: rgba(255, 255, 255, 0.08);
  --sidebar-ring: #00E5FF;
  --gradient-primary: #00E5FF;
  --gradient-gold: #F4B400;
  --gradient-glass: #12161F;
  --gradient-hero: #0B0E14;
  --shadow-glow: none;
  --shadow-gold-glow: none;
  --shadow-elevation: none;
  --glass-border: rgba(255, 255, 255, 0.08);
}

/* Theme 2: Public Safety (Emergency Center) */
[data-theme="public-safety"] {
  --background: #111111;
  --surface: #1A1A1A;
  --card-bg: #1A1A1A;
  --foreground: #E5E5E5;
  --card: #1A1A1A;
  --card-foreground: #E5E5E5;
  --popover: #222222;
  --popover-foreground: #E5E5E5;
  --primary: #525252;
  --primary-foreground: #FFFFFF;
  --primary-glow: #525252;
  --secondary: #262626;
  --secondary-foreground: #E5E5E5;
  --accent: #F59E0B;
  --accent-foreground: #000000;
  --warning: #F59E0B;
  --warning-foreground: #000000;
  --destructive: #DC2626;
  --destructive-foreground: #FFFFFF;
  --success: #16A34A;
  --muted: #262626;
  --muted-foreground: #A3A3A3;
  --border: rgba(255, 255, 255, 0.15);
  --input: rgba(255, 255, 255, 0.15);
  --ring: #525252;
  --chart-1: #16A34A;
  --chart-2: #F59E0B;
  --chart-3: #DC2626;
  --chart-4: #525252;
  --chart-5: #A3A3A3;
  --sidebar: #0A0A0A;
  --sidebar-foreground: #E5E5E5;
  --sidebar-primary: #525252;
  --sidebar-primary-foreground: #FFFFFF;
  --sidebar-accent: #1A1A1A;
  --sidebar-accent-foreground: #E5E5E5;
  --sidebar-border: rgba(255, 255, 255, 0.15);
  --sidebar-ring: #525252;
  --gradient-primary: #525252;
  --gradient-gold: #F59E0B;
  --gradient-glass: #1A1A1A;
  --gradient-hero: #111111;
  --shadow-glow: none;
  --shadow-gold-glow: none;
  --shadow-elevation: none;
  --glass-border: rgba(255, 255, 255, 0.15);
}

/* Theme 3: Consumer (Fan Dashboard) */
[data-theme="consumer"], :root {
  --background: #F8FAFC;
  --surface: #F1F5F9;
  --card-bg: #FFFFFF;
  --foreground: #0F172A;
  --card: rgba(255, 255, 255, 0.90);
  --card-foreground: #0F172A;
  --popover: rgba(255, 255, 255, 0.98);
  --popover-foreground: #0F172A;
  --primary: #3B82F6;
  --primary-foreground: #FFFFFF;
  --primary-glow: #60A5FA;
  --secondary: #10B981;
  --secondary-foreground: #FFFFFF;
  --accent: #F43F5E;
  --accent-foreground: #FFFFFF;
  --warning: #F59E0B;
  --warning-foreground: #FFFFFF;
  --destructive: #EF4444;
  --destructive-foreground: #FFFFFF;
  --success: #10B981;
  --muted: rgba(241, 245, 249, 0.80);
  --muted-foreground: #64748B;
  --border: rgba(0, 0, 0, 0.08);
  --input: rgba(0, 0, 0, 0.08);
  --ring: #3B82F6;
  --chart-1: #3B82F6;
  --chart-2: #10B981;
  --chart-3: #F43F5E;
  --chart-4: #F59E0B;
  --chart-5: #64748B;
  --sidebar: rgba(255, 255, 255, 0.97);
  --sidebar-foreground: #0F172A;
  --sidebar-primary: #3B82F6;
  --sidebar-primary-foreground: #FFFFFF;
  --sidebar-accent: rgba(59, 130, 246, 0.08);
  --sidebar-accent-foreground: #0F172A;
  --sidebar-border: rgba(0, 0, 0, 0.06);
  --sidebar-ring: #3B82F6;
  --gradient-primary: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
  --gradient-gold: linear-gradient(135deg, #F59E0B 0%, #EF4444 100%);
  --gradient-glass: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4));
  --gradient-hero: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.85) 100%);
  --shadow-glow: 0 0 30px rgba(59, 130, 246, 0.25);
  --shadow-gold-glow: 0 0 30px rgba(245, 158, 11, 0.25);
  --shadow-elevation: 0 20px 60px rgba(0, 0, 0, 0.08);
  --glass-border: rgba(0, 0, 0, 0.06);
}
`;

content = content.replace(rootRegex, newThemes);

const overrides = `
/* ===================================================
   MULTI-THEME OVERRIDES
=================================================== */
/* Public Safety: Kill all animations and transitions */
[data-theme="public-safety"] *,
[data-theme="public-safety"] *::before,
[data-theme="public-safety"] *::after {
  animation: none !important;
  transition: none !important;
}

/* Enterprise: Use Monospace for data */
[data-theme="enterprise"] .tabular-nums,
[data-theme="enterprise"] .font-mono,
[data-theme="enterprise"] table,
[data-theme="enterprise"] text {
  font-family: "JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
}
`;

content += overrides;

fs.writeFileSync(stylesPath, content);
console.log('styles.css updated with multi-theme architecture');

// Now update AppShell.tsx to accept themeVariant
const appShellPath = path.join(__dirname, '../src/components/AppShell.tsx');
let appShellContent = fs.readFileSync(appShellPath, 'utf8');

// Add themeVariant to props
appShellContent = appShellContent.replace(
  /export function AppShell\(\{\n  children,\n  title,\n  subtitle,\n\}: \{\n  children: ReactNode;\n  title: string;\n  subtitle\?: string;\n\}\) \{/,
  `export function AppShell({
  children,
  title,
  subtitle,
  themeVariant = 'enterprise',
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  themeVariant?: 'enterprise' | 'public-safety' | 'consumer';
}) {`
);

// Apply data-theme to the root div of AppShell
appShellContent = appShellContent.replace(
  /<div className="min-h-dvh flex relative bg-background">/,
  '<div className="min-h-dvh flex relative bg-background" data-theme={themeVariant}>'
);

// We need to restore stadium background logic for consumer theme only
appShellContent = appShellContent.replace(
  /\{\/\* Global Backdrop \*\/\}\n\s*<div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-background">\n\s*<\/div>/,
  `{/* Global Backdrop */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-background">
        {themeVariant === 'consumer' && (
          <>
            <div
              className="absolute inset-0 scale-[1.04]"
              style={{
                backgroundImage: 'url("/stadium-hero.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.9,
                filter: "saturate(1.2) contrast(1.1) brightness(0.7)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0.75) 100%)",
                backdropFilter: "blur(2px)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.14) 0%, transparent 48%, transparent 100%)",
              }}
            />
          </>
        )}
      </div>`
);

fs.writeFileSync(appShellPath, appShellContent);
console.log('AppShell.tsx updated with themeVariant');

// Now inject themeVariant into the routes
const routes = [
  { file: 'admin.tsx', variant: 'enterprise' },
  { file: 'security.tsx', variant: 'enterprise' },
  { file: 'tournament.tsx', variant: 'enterprise' },
  { file: 'emergency.tsx', variant: 'public-safety' },
];

routes.forEach(({ file, variant }) => {
  const p = path.join(__dirname, '../src/routes', file);
  if (fs.existsSync(p)) {
    let rc = fs.readFileSync(p, 'utf8');
    // Replace <AppShell title="..." subtitle="..."> with <AppShell themeVariant="..." title="..." ...>
    rc = rc.replace(/<AppShell\s+title=/, `<AppShell themeVariant="${variant}" title=`);
    fs.writeFileSync(p, rc);
    console.log(`Updated ${file} to use ${variant} theme`);
  }
});

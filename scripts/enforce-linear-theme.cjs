const fs = require('fs');
const path = require('path');

const routesToUpdate = ['admin.tsx', 'emergency.tsx', 'tournament.tsx', 'security.tsx'];

routesToUpdate.forEach(route => {
  const filePath = path.join(__dirname, '../src/routes', route);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace hardcoded inline backgrounds with bg-card class
    content = content.replace(/style={{ background: "rgba\(255,255,255,0\.90\)", border: "1px solid rgba\(0,0,0,0\.06\)" }}/g, 'className="bg-card border border-border"');
    content = content.replace(/style={{ background: "rgba\(255,255,255,0\.90\)", border: "1px solid rgba\(0,0,0,0\.06\)", borderLeft: "4px solid #0E9F6E" }}/g, 'className="bg-card border border-border border-l-4 border-l-primary"');
    content = content.replace(/style={{ background: "rgba\(255,255,255,0\.90\)", border: isRedirected \? "1px solid rgba\(14,159,110,0\.25\)" : "1px solid rgba\(0,0,0,0\.06\)", borderLeft: "4px solid #0E9F6E" }}/g, 'className={`bg-card border-l-4 border-l-primary ${isRedirected ? "border-primary/25" : "border-border"}`}');
    
    // Convert text colors
    content = content.replace(/text-slate-900/g, 'text-foreground');
    content = content.replace(/color: "#64748B"/g, 'color: "var(--muted-foreground)"');
    content = content.replace(/color: "rgba\(100,116,139,0\.50\)"/g, 'color: "var(--muted-foreground)"');

    // Recharts colors
    content = content.replace(/stroke="#64748B"/g, 'stroke="var(--muted-foreground)"');
    
    // Other inline backgrounds
    content = content.replace(/background: "rgba\(0,0,0,0\.03\)", border: "1px solid rgba\(0,0,0,0\.06\)"/g, 'background: "var(--surface)", border: "1px solid var(--border)"');
    content = content.replace(/background: "rgba\(0,0,0,0\.04\)", border: "1px solid rgba\(0,0,0,0\.08\)"/g, 'background: "var(--surface)", border: "1px solid var(--border)"');
    content = content.replace(/background: "rgba\(0,0,0,0\.05\)", border: "1px solid rgba\(0,0,0,0\.08\)"/g, 'background: "var(--surface)", border: "1px solid var(--border)"');

    fs.writeFileSync(filePath, content);
    console.log(`Enforced Linear theme on ${route}`);
  }
});

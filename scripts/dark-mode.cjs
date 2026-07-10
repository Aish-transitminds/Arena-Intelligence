const fs = require('fs');
const path = require('path');

const routesToUpdate = ['admin.tsx', 'emergency.tsx', 'tournament.tsx', 'security.tsx'];

routesToUpdate.forEach(route => {
  const filePath = path.join(__dirname, '../src/routes', route);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace backgrounds
    content = content.replace(/rgba\(255,255,255,0\.90\)/g, 'rgba(2,6,23,0.70)');
    content = content.replace(/rgba\(255,255,255,0\.85\)/g, 'rgba(2,6,23,0.70)');
    content = content.replace(/bg-white/g, 'bg-slate-950/60');
    
    // Replace borders
    content = content.replace(/rgba\(0,0,0,0\.06\)/g, 'rgba(255,255,255,0.10)');
    content = content.replace(/rgba\(0,0,0,0\.04\)/g, 'rgba(255,255,255,0.05)');
    content = content.replace(/rgba\(0,0,0,0\.05\)/g, 'rgba(255,255,255,0.08)');
    content = content.replace(/rgba\(0,0,0,0\.08\)/g, 'rgba(255,255,255,0.12)');
    content = content.replace(/rgba\(0,0,0,0\.03\)/g, 'rgba(255,255,255,0.04)');

    // Replace text colors
    content = content.replace(/text-slate-900/g, 'text-white');
    content = content.replace(/color: "#64748B"/g, 'color: "#94A3B8"');

    // Add tabular-nums to KPIs
    content = content.replace(/font-extrabold text-white tracking-tight/g, 'font-extrabold text-white tracking-tight tabular-nums');
    content = content.replace(/text-2xl font-extrabold text-white/g, 'text-2xl font-extrabold text-white tabular-nums');
    content = content.replace(/text-5xl font-extrabold text-white/g, 'text-5xl font-extrabold text-white tabular-nums');

    // Recharts tooltip backgrounds
    content = content.replace(/rgba\(255,255,255,0\.97\)/g, 'rgba(2,6,23,0.95)');

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${route}`);
  }
});

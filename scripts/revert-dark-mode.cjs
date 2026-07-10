const fs = require('fs');
const path = require('path');

const routesToUpdate = ['admin.tsx', 'emergency.tsx', 'tournament.tsx', 'security.tsx'];

routesToUpdate.forEach(route => {
  const filePath = path.join(__dirname, '../src/routes', route);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Revert backgrounds
    content = content.replace(/rgba\(2,6,23,0\.70\)/g, 'rgba(255,255,255,0.90)');
    content = content.replace(/bg-slate-950\/60/g, 'bg-white');
    
    // Revert borders
    content = content.replace(/rgba\(255,255,255,0\.10\)/g, 'rgba(0,0,0,0.06)');
    content = content.replace(/rgba\(255,255,255,0\.05\)/g, 'rgba(0,0,0,0.04)');
    content = content.replace(/rgba\(255,255,255,0\.08\)/g, 'rgba(0,0,0,0.05)');
    content = content.replace(/rgba\(255,255,255,0\.12\)/g, 'rgba(0,0,0,0.08)');
    content = content.replace(/rgba\(255,255,255,0\.04\)/g, 'rgba(0,0,0,0.03)');

    // Revert text colors
    content = content.replace(/text-white/g, 'text-slate-900');
    // Important: we previously changed color: "#64748B" to "#94A3B8"
    content = content.replace(/color: "#94A3B8"/g, 'color: "#64748B"');

    // Tabular nums can stay, they are good!
    // But we need to fix the text color next to tabular nums
    content = content.replace(/text-slate-900 tracking-tight tabular-nums/g, 'text-slate-900 tracking-tight tabular-nums');
    
    // Recharts tooltip backgrounds
    content = content.replace(/rgba\(2,6,23,0\.95\)/g, 'rgba(255,255,255,0.97)');

    fs.writeFileSync(filePath, content);
    console.log(`Reverted ${route}`);
  }
});

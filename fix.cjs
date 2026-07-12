const fs = require('fs');
const path = require('path');

const tsxFiles = [
  'src/routes/admin.tsx',
  'src/routes/emergency.tsx',
  'src/routes/security.tsx',
  'src/routes/tournament.tsx'
];

tsxFiles.forEach(file => {
  const filepath = path.join(process.cwd(), file);
  let content = fs.readFileSync(filepath, 'utf8');
  
  // Replace duplicate classNames
  let oldContent;
  do {
    oldContent = content;
    content = content.replace(/className="([^"]+)"\s*\n*\s*className="([^"]+)"/g, 'className="$1 $2"');
  } while (oldContent !== content);
  
  // Some might be formatting issues with type errors:
  // e.g. Formatter<ValueType, NameType>
  content = content.replace(/value: number, name: string/g, 'value: any, name: any');
  content = content.replace(/value: number/g, 'value: any');
  
  fs.writeFileSync(filepath, content, 'utf8');
});

const appShellPath = path.join(process.cwd(), 'src/components/AppShell.tsx');
let appShell = fs.readFileSync(appShellPath, 'utf8');
appShell = appShell.replace(/ \| "\/audit"/g, '');
appShell = appShell.replace(/"\/audit" \| /g, '');
fs.writeFileSync(appShellPath, appShell, 'utf8');

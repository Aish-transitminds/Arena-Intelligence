const fs = require('fs');

let chatTest = fs.readFileSync('src/actions/chat.server.test.ts', 'utf8');
chatTest = chatTest.replace('// @ts-expect-error', '');
fs.writeFileSync('src/actions/chat.server.test.ts', chatTest);

let adminTest = fs.readFileSync('src/routes/-admin.test.tsx', 'utf8');
adminTest = adminTest.replace('import AdminPage from "./admin";', 'import { Route } from "./admin";\nconst AdminPage = Route.component;');
fs.writeFileSync('src/routes/-admin.test.tsx', adminTest);

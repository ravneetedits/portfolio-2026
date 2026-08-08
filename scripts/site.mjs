import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import readline from 'node:readline';

const appPath = path.resolve('src', 'App.jsx');
const flagRegex = /const MAINTENANCE_MODE = (true|false);/;

function getSource() {
  if (!fs.existsSync(appPath)) { console.error('src/App.jsx not found'); process.exit(1); }
  return fs.readFileSync(appPath, 'utf8');
}

function setMaintenanceFlag(value) {
  const source = getSource();
  if (!flagRegex.test(source)) { console.error('MAINTENANCE_MODE flag not found in src/App.jsx'); process.exit(1); }
  fs.writeFileSync(appPath, source.replace(flagRegex, `const MAINTENANCE_MODE = ${value};`), 'utf8');
}

function deploy() {
  console.log('\n🚀 Building and deploying...\n');
  execSync('npm run deploy', { stdio: 'inherit' });
}

const MENU = `
┌─────────────────────────────────┐
│       ravneetedits · site       │
├─────────────────────────────────┤
│  1  Redeploy                    │
│  2  Maintenance ON  + redeploy  │
│  3  Maintenance OFF + redeploy  │
│  q  Quit                        │
└─────────────────────────────────┘
`;

console.log(MENU);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('Choose: ', (answer) => {
  rl.close();
  const choice = answer.trim().toLowerCase();

  if (choice === '1') {
    deploy();
  } else if (choice === '2') {
    setMaintenanceFlag(true);
    console.log('✓ Maintenance mode ON');
    deploy();
  } else if (choice === '3') {
    setMaintenanceFlag(false);
    console.log('✓ Maintenance mode OFF');
    deploy();
  } else if (choice === 'q') {
    console.log('Bye.');
  } else {
    console.error('Invalid choice.');
    process.exit(1);
  }
});

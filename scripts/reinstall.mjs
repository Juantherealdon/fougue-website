import { execSync } from 'child_process';
import { unlinkSync, existsSync } from 'fs';

const lockfile = '/vercel/share/v0-project/bun.lock';

if (existsSync(lockfile)) {
  unlinkSync(lockfile);
  console.log('Deleted bun.lock');
} else {
  console.log('No bun.lock found');
}

console.log('Running bun install...');
execSync('bun install --no-frozen-lockfile', {
  cwd: '/vercel/share/v0-project',
  stdio: 'inherit'
});
console.log('Done!');

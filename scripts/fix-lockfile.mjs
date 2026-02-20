import { execSync } from 'child_process'

try {
  console.log('Running bun install to regenerate lockfile...')
  const result = execSync('cd /vercel/share/v0-project && bun install --no-frozen-lockfile', { 
    encoding: 'utf-8',
    timeout: 60000 
  })
  console.log(result)
  console.log('Lockfile regenerated successfully.')
} catch (error) {
  console.error('Error:', error.message)
  if (error.stdout) console.log('stdout:', error.stdout)
  if (error.stderr) console.log('stderr:', error.stderr)
}

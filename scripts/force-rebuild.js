import { rmSync, existsSync } from 'fs'
import { join } from 'path'

const dirsToDelete = [
  '.next',
  '.turbo', 
  'node_modules/.cache',
  '.tsbuildinfo'
]

const projectRoot = process.cwd()

console.log('Force rebuild: Cleaning all caches...')

for (const dir of dirsToDelete) {
  const fullPath = join(projectRoot, dir)
  if (existsSync(fullPath)) {
    try {
      rmSync(fullPath, { recursive: true, force: true })
      console.log(`Deleted: ${dir}`)
    } catch (e) {
      console.log(`Could not delete ${dir}: ${e.message}`)
    }
  } else {
    console.log(`Not found: ${dir}`)
  }
}

// Also delete any .tsbuildinfo files
const tsbuildinfo = join(projectRoot, 'tsconfig.tsbuildinfo')
if (existsSync(tsbuildinfo)) {
  try {
    rmSync(tsbuildinfo)
    console.log('Deleted: tsconfig.tsbuildinfo')
  } catch (e) {
    console.log(`Could not delete tsconfig.tsbuildinfo: ${e.message}`)
  }
}

console.log('Cache cleanup complete. Server will rebuild from scratch.')

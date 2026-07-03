import { execSync } from 'child_process'
import { readdirSync } from 'fs'

const hasBinary = readdirSync(process.cwd()).some((file) => file.endsWith('.node'))

if (!hasBinary) {
  console.log('No native binary found, building napi-pallas...')
  execSync('napi build --platform --release', { stdio: 'inherit' })
} else {
  console.log('Native binary found, skipping napi-pallas build.')
}

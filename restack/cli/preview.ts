import { preview } from 'vite'
import config from '../vite.config'

main()

async function main() {
  const server = await preview(config)
  server.printUrls()
}

import { createServer } from 'vite'
import config from '../vite.config'

main()

async function main() {
  const server = await createServer(config)
  await server.listen()
  server.printUrls()
}

import { build } from 'vite'
import config from '../vite.config'
// import { prerender } from 'vite-plugin-ssr/prerender'

main()

async function main() {
  await build(config)
  await build({ ...config, build: { ssr: true } })
  // await prerender({ viteConfig: config as any })
}

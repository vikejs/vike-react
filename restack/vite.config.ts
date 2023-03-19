import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'
import { UserConfig } from 'vite'

const root = process.cwd()

const config: UserConfig = {
  root,
  plugins: [
    react(),
    ssr({
      extensions: [
        {
          npmPackageName: 'restack',
          pageFilesDist: ['restack/renderer/_default.page.server.js', 'restack/renderer/_default.page.client.js']
        }
      ],
      disableAutoFullBuild: true
    })
  ],
  optimizeDeps: { include: ['react', 'react-dom'] },
  ssr: {
    external: ['restack']
  }
}

export default config

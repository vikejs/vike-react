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
          pageConfigsDistFiles: [
            'restack/renderer/+onRenderHtml.js',
            'restack/renderer/+onRenderClient.js',
            'restack/renderer/+config.js',
            'restack/renderer/+passToClient.js',
            'restack/renderer/+onPageTransitionStart.js',
            'restack/renderer/+onPageTransitionEnd.js'
          ]
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

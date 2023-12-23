import react from '@vitejs/plugin-react'
import ssr from 'vike/plugin'
import { UserConfig } from 'vite'

export default {
  plugins: [react(), ssr()],
  optimizeDeps: { include: ['cross-fetch', 'react/jsx-runtime', 'vike-react/renderer/onRenderClient'] }
} satisfies UserConfig

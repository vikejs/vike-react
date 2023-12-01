import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'

export default {
  plugins: [react(), vike()],
  optimizeDeps: {
    include: ['cross-fetch', 'react/jsx-runtime', 'vike-react/renderer/onRenderClient'],
    // Workaround until Vike patch is released
    exclude: ['react-streaming']
  }
} satisfies UserConfig

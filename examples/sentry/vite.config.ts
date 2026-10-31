import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react(), vike()],
  resolve: {
    alias: {
      '#sentry-env': fileURLToPath(new URL('./sentry-env.ts', import.meta.url)),
    },
  },
})

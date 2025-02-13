import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'

export default {
  plugins: [react(), vike()],
  // Seems like Apollo is heavy? Or is there a way to reduce the size of our Apollo imports?
  build: { chunkSizeWarningLimit: 600 },
} satisfies UserConfig

import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'

export default {
  plugins: [
    react({
      babel: {
        plugins: [['styled-jsx/babel']],
      },
    }),
    vike(),
  ],
  optimizeDeps: {
    include: ['styled-jsx/style'],
  },
} satisfies UserConfig

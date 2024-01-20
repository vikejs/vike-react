import react from '@vitejs/plugin-react'
import ssr from 'vike/plugin'
import { UserConfig } from 'vite'

export default {
  plugins: [react(), ssr()]
} satisfies UserConfig

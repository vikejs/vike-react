import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import type { UserConfig } from 'vite'
import { vikeReactZustand } from 'vike-react-zustand/plugin'

export default {
  plugins: [react(), vike(), vikeReactZustand()]
} satisfies UserConfig

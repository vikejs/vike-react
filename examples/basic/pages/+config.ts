import type { Config } from 'restack'

import logoUrl from '../assets/logo.svg'

// Default config (can be overriden by pages)
export default {
  // <title>
  title: 'My Restack App',
  // <meta name="description">
  description: 'Demo showcasing Restack',
  // <link rel="icon" href="${favicon}" />
  favicon: logoUrl
} satisfies Config

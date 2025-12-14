export { config }

import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'
import vikePhoton from 'vike-photon/config'
import vikeReactSentry from 'vike-react-sentry/config'

const config = {
  title: 'Vike + React + Sentry Example',
  
  extends: [vikeReact, vikePhoton, vikeReactSentry],
  
  // Photon configuration
  photon: {
    server: '../server/index.ts'
  },
  
  // Sentry configuration
  sentry: {
    // ⚠️ Replace with your actual Sentry DSN
    // Get it from: https://sentry.io/settings/[your-org]/projects/[your-project]/keys/
    dsn: 'https://8de66fe8dda3a86d986df8ee3aa09f72@o4510438936412161.ingest.de.sentry.io/4510438941655120',
    
    // Common options for both client and server
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0,
    
    // Client-specific configuration (browser)
    client: {
      // You can add custom beforeSend, integrations, etc.
      // These will override the defaults
    },
    
    // Server-specific configuration (Node.js)
    server: {
      // Server-specific options
    },
    
    // Vite plugin configuration for sourcemap uploads (optional)
    // Uncomment and configure for production builds
    // vitePlugin: {
    //   org: 'your-sentry-org',
    //   project: 'your-sentry-project',
    //   authToken: process.env.SENTRY_AUTH_TOKEN,
    // }
  }
} satisfies Config

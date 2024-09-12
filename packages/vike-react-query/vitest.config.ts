export { config as default }

import { defineConfig } from 'vitest/config'

const config = defineConfig({
  test: {
    // test/**/*.test.ts => @brillout/test-e2e
    include: ['**/*.spec.*'],
    environment: 'jsdom',
  },
})

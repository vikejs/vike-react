import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // test/**/*.test.ts => @brillout/test-e2e
    include: ['**/*.spec.*'],
    environment: 'jsdom'
  }
})

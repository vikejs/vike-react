import type { ViteUserConfig } from 'vitest/config'

export default {
  test: {
    // `.test.ts` => @brillout/test-e2e
    // `.spec.ts` => Vitest
    include: ['**/*.spec.*'],
    environment: 'jsdom',
  },
} satisfies ViteUserConfig

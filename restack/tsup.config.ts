import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    './renderer/_default.page.client.tsx',
    './renderer/_default.page.server.tsx',
    './components/usePageContext.tsx',
    './cli/index.ts',
    './index.ts'
  ],
  format: 'esm',
  clean: true,
  // sourcemap: true,
  dts: true
})

import { describe, it, expect } from 'vitest'
import { transformCode } from './babelTransformer.js'

describe('babelTransformer', () => {
  it('should transform transfer calls and remove unreferenced code', async () => {
    const testCode = `
import { create, transfer } from 'vike-react-zustand'
import { immer } from 'zustand/middleware/immer'

// This is a server-only import that should be removed
import { readFileSync } from 'fs'

// This is a server-only variable that should be removed
const serverOnlyData = readFileSync('/etc/passwd', 'utf-8')

const useStore = create()(
  immer((set, get) => ({
    counter: 0,
    setCounter(value) {
      set((state) => {
        state.counter = value
      })
    },

    // This should be transformed to an empty function
    ...transfer(() => ({
      nodeVersion: process.version,
      // This uses server-only data and should be removed
      serverData: serverOnlyData
    }))
  }))
)

export { useStore }
`

    const result = await transformCode(testCode, {
      id: 'test.ts',
      stripTransfer: true,
      addStoreKeys: true
    })

    // Verify the transformation
    expect(result.hasVikeReactZustand).toBe(true)
    expect(result.storeKeys.size).toBe(1)

    // The transformed code should:
    // 1. Have a store key added to create()
    // 2. Have transfer() replaced with an empty function
    // 3. Not contain the fs import
    // 4. Not contain the serverOnlyData variable

    const transformedCode = result.code
    expect(transformedCode).toContain('create("')
    expect(transformedCode).toContain("() => ({})")
    expect(transformedCode).not.toContain("import { readFileSync } from 'fs'")
    expect(transformedCode).not.toContain("serverOnlyData")
  })
})

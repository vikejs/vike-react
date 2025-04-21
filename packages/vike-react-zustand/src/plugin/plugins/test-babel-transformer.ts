import { transformCode } from './babelTransformer.js'

// Test code with transfer function
const testCode = `
import { create, transfer } from 'vike-react-zustand'
import { immer } from 'zustand/middleware/immer'

// This is a server-only import that should be removed
import { readFileSync } from 'fs'

// This is a server-only variable that should be removed
const serverOnlyData = readFileSync('/etc/passwd', 'utf-8')

interface Store {
  counter: number
  setCounter: (value: number) => void
  nodeVersion: string
  serverData: string
}

const useStore = create<Store>()(
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

async function runTest() {
  console.log('Original code:')
  console.log(testCode)
  console.log('\n----------------------------\n')

  const result = await transformCode(testCode, {
    id: 'test.ts',
    stripTransfer: true,
    addStoreKeys: true
  })

  console.log('Transformed code:')
  console.log(result.code)
  console.log('\n----------------------------\n')

  console.log('Store keys:', [...result.storeKeys])
  console.log('Has vike-react-zustand:', result.hasVikeReactZustand)
}

runTest().catch(console.error)

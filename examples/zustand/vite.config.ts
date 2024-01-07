import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'

export default {
  plugins: [
    {
      enforce: 'pre',
      transform(code, id) {
        const start_time = process.hrtime()
        if (id.includes('node_modules')) {
          return
        }
        // Playground: https://regex101.com/r/1RThko/1
        const hasCreate = /import(?:[\s\w,]*\{[\s\w,]*)create(?:[\s\w,]*\}[\s\w,]*)from\s*["']vike-react-zustand["']/.test(code)
        if (!hasCreate) {
          return
        }
        // Playground: https://regex101.com/r/RLUfaE/1
        code = code.replace(/create(?:<[\s\w<>:{}]*)?\((?!\s*['"`])\)?/g, (match, position) => {
          const key = simpleHash(`${id}:${position}`)

          if (match.at(-1) === ')') {
            // code: create<Store>()...
            // replacement: create<Store>('key')...
            return `${match.slice(0, -1)}'${key}')`
          } else {
            // code: create<Store>(...
            // replacement: create<Store>('key')(...
            return `${match}'${key}')(`
          }
        })

        let end_time = process.hrtime(start_time)
        // Print the Execution time.
        console.log('End Time:', end_time)
        return code
      }
    },
    react(),
    vike()
  ]
} satisfies UserConfig

function simpleHash(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return (hash >>> 0).toString(36)
}

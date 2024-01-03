import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'

export default {
  plugins: [
    {
      enforce: 'pre',
      transform(code, id, options) {
        if (id.includes('node_modules')) {
          return
        }
        const start_time = process.hrtime()

        const result = /import([{}\s\w,]*)from\s*["']vike-react-zustand["']/.exec(code)
        if (!result?.length) {
          return
        }

        // { create, serverOnly, createWithPageContext }
        const imports = result[1]

        // [ 'create', 'serverOnly', 'createWithPageContext' ]
        const importNames = imports
          .replaceAll(/[{}]/g, '')
          .split(',')
          .map((s) => s.trim())

        const hasCreate = importNames.includes('create')
        const hasWithPageContext = importNames.includes('createWithPageContext')

        if (hasCreate) {
          code = code.replace(/create(?:<[\s\w<>:{}]*)?(?:\(\))?\(/gm, (match, position) => {
            const key = simpleHash(`${id}:${position}`)
            return `${match}'${key}',`
          })
        }

        if (hasWithPageContext) {
          code = code.replace(/createWithPageContext(?:<[\s\w<>:{}]*)?(?:\(\))?\(/gm, (match, position) => {
            const key = simpleHash(`${id}:${position}`)
            return `${match}'${key}',`
          })
        }

        // The context provider needs to re-run in dev
        code =
          code +
          `if (import.meta.hot) {
            import.meta.hot.accept(() => {
              window.location.reload()
            })
          }`

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

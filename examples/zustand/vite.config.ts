import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'

export default {
  plugins: [
    {
      enforce: 'pre',
      transform(code, id, options) {
        const result = /import([{}\s\w,]*)from\s*["']vike-react-zustand["']/.exec(code)
        if (!result?.length) {
          return
        }

        // { create, serverOnly, withPageContext }
        const imports = result[1]

        // [ 'create', 'serverOnly', 'withPageContext' ]
        const importNames = imports
          .replaceAll(/[{}]/g, '')
          .split(',')
          .map((s) => s.trim())

        const hasCreate = importNames.includes('create')
        const hasWithPageContext = importNames.includes('withPageContext')

        if (hasCreate) {
          code = code.replace(/create(?:<[\s\w<>:{}]*)?(?:\(\))?\(/gm, (match, position) => {
            const key = simpleHash(`${id}:${position}`)
            return `${match}'${key}',`
          })
        }

        if (hasWithPageContext) {
          code = code.replace(/withPageContext(?:<[\s\w<>:{}]*)?(?:\(\))?\(/gm, (match, position) => {
            const key = simpleHash(`${id}:${position}`)
            return `${match}'${key}',`
          })
        }

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

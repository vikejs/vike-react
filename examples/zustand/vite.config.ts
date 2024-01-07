import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import type { Plugin, UserConfig } from 'vite'

const ids = new Set()
export default {
  plugins: [react(), vike(), vikeReactZustandPlugin()]
} satisfies UserConfig

function vikeReactZustandPlugin(): Plugin {
  return {
    name: 'vikeReactZustand',
    enforce: 'pre',
    transform(code, id) {
      const start_time = process.hrtime()
      if (id.includes('node_modules')) {
        return
      }
      // Playground: https://regex101.com/r/1RThko/1
      const hasCreate =
        /import(?:[\s\w,]*\{[\s\w,]*)create(?:[\s\w,]*\}[\s\w,]*)from\s*["']vike-react-zustand["']/.test(code)
      if (!hasCreate) {
        return
      }

      // Playground: https://regex101.com/r/2XhdOg/1
      code = code.replace(/create\s*(?:<[\s\w<>:{}[\]]*)?(?:\([\w'"`{}()\s]*?\))?\s*?\(/g, (match, position) => {
        const key = simpleHash(`${id}:${position}`)
        return `${match}'${key}',`
      })

      ids.add(id)
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
    },
    handleHotUpdate(ctx) {
      if (ctx.modules.some((m) => ids.has(m.id))) {
        //@ts-ignore
        if (globalThis.__vite_plugin_ssr?.['VikeReactZustandContext.ts']) {
          //@ts-ignore
          globalThis.__vite_plugin_ssr['VikeReactZustandContext.ts'].initializers = {}
        }
      }
    }
  }
}

function simpleHash(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return (hash >>> 0).toString(36)
}

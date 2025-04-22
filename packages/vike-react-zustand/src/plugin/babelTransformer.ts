import { transformAsync, type PluginItem } from '@babel/core'
import * as t from '@babel/types'

type TransformResult = {
  code: string
  map: any
} | null

type State = {
  modified: boolean
  hasVikeReactZustand: boolean
  storeKeyCounter: number
  createNames: Set<string>
  isStoreFile: boolean
}

/**
 * Main code transformer that handles:
 * 1. Adding unique keys to create() calls
 * 2. Stripping transfer() calls on client-side
 * 3. Removing unreferenced code
 * 4. Adding HMR code to store files
 */
export async function transformCode(code: string, id: string): Promise<TransformResult> {
  try {
    const state: State = {
      modified: false,
      hasVikeReactZustand: false,
      storeKeyCounter: 0,
      createNames: new Set<string>(),
      isStoreFile: false,
    }

    const result = await transformAsync(code, {
      filename: id,
      ast: true,
      sourceMaps: true,
      plugins: [
        // Plugin to analyze imports and track local names
        analyzeImportsPlugin(state),
        // Plugin to add keys to create() calls
        addStoreKeysPlugin(state, id),
      ].filter(Boolean) as PluginItem[],
    })

    if (!result?.code || !state.hasVikeReactZustand || !state.modified) {
      return null
    }

    // Add HMR code to store files
    let finalCode = result.code
    if (state.isStoreFile) {
      const hmrCode = `
// HMR for store
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    window.location.reload()
  })
}`
      finalCode += hmrCode
    }

    return {
      code: finalCode,
      map: result.map,
    }
  } catch (error) {
    console.error(`Error transforming code from ${id}:`, error)
    return null
  }
}

/**
 * Plugin to analyze imports and track local names
 */
function analyzeImportsPlugin(state: State): PluginItem {
  return {
    visitor: {
      ImportDeclaration(path) {
        if (path.node.source.value !== 'vike-react-zustand') {
          return
        }
        state.hasVikeReactZustand = true

        // Process import specifiers
        for (const specifier of path.node.specifiers) {
          if (t.isImportSpecifier(specifier) && t.isIdentifier(specifier.imported)) {
            const importedName = specifier.imported.name
            const localName = specifier.local.name

            if (importedName === 'create') {
              state.createNames.add(localName)
            }
          }
        }
      },
    },
  }
}

/**
 * Plugin to add keys to create() calls
 */
function addStoreKeysPlugin(state: State, moduleId: string): PluginItem {
  return {
    visitor: {
      CallExpression(path) {
        if (!t.isIdentifier(path.node.callee) || !state.createNames.has(path.node.callee.name)) {
          return
        }

        // Mark this as a store file for HMR plugin
        state.isStoreFile = true

        // Skip if first argument is already a string literal
        if (path.node.arguments.length > 0 && t.isStringLiteral(path.node.arguments[0])) {
          return
        }

        // Generate a unique key
        const key = simpleHash(`${moduleId}:${state.storeKeyCounter++}`)

        // Add the key as the first argument
        path.node.arguments.unshift(t.stringLiteral(key))
        state.modified = true
      },
    },
  }
}

/**
 * Simple hash function for generating store keys
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return (hash >>> 0).toString(36)
}

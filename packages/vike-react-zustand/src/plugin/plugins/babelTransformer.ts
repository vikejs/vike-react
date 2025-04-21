import { transformAsync, type PluginItem, type NodePath } from '@babel/core'
import * as t from '@babel/types'

// Types
type TransformOptions = {
  stripTransfer?: boolean
  addStoreKeys?: boolean
  id: string
}

type TransformResult = {
  code: string
  map: any
  hasVikeReactZustand: boolean
  storeKeys: Set<string>
}

/**
 * Main code transformer that handles:
 * 1. Adding unique keys to create() calls
 * 2. Stripping transfer() calls on client-side
 * 3. Removing unreferenced code
 */
export async function transformCode(code: string, options: TransformOptions): Promise<TransformResult> {
  try {
    // Track if we've made any changes
    const state = {
      modified: false,
      hasVikeReactZustand: false,
      storeKeys: new Set<string>(),
      storeKeyCounter: 0,
      createNames: new Set<string>(),
      transferNames: new Set<string>(),
    }

    // Apply Babel transformations
    const result = await transformAsync(code, {
      filename: options.id,
      ast: true,
      sourceMaps: true,
      plugins: [
        // Plugin to analyze imports and track local names
        analyzeImportsPlugin(state),
        // Plugin to add keys to create() calls
        options.addStoreKeys ? addStoreKeysPlugin(state, options.id) : null,
        // Plugin to strip transfer() calls
        options.stripTransfer ? stripTransferPlugin(state) : null,
        // Plugin to remove unreferenced code
        removeUnreferencedPlugin(state),
      ].filter(Boolean) as PluginItem[],
    })

    if (!result || !state.hasVikeReactZustand || !state.modified) {
      return {
        code,
        map: null,
        hasVikeReactZustand: state.hasVikeReactZustand,
        storeKeys: new Set(),
      }
    }

    return {
      code: result.code || code,
      map: result.map,
      hasVikeReactZustand: state.hasVikeReactZustand,
      storeKeys: state.storeKeys,
    }
  } catch (error) {
    console.error(`Error transforming code from ${options.id}:`, error)
    return {
      code,
      map: null,
      hasVikeReactZustand: false,
      storeKeys: new Set(),
    }
  }
}

/**
 * Plugin to analyze imports and track local names
 */
function analyzeImportsPlugin(state: any): PluginItem {
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
            } else if (importedName === 'transfer') {
              state.transferNames.add(localName)
            }
          }
        }
      }
    }
  }
}

/**
 * Plugin to add keys to create() calls
 */
function addStoreKeysPlugin(state: any, moduleId: string): PluginItem {
  return {
    visitor: {
      CallExpression(path) {
        if (
          !t.isIdentifier(path.node.callee) ||
          !state.createNames.has(path.node.callee.name)
        ) {
          return
        }

        // Skip if first argument is already a string literal
        if (
          path.node.arguments.length > 0 &&
          t.isStringLiteral(path.node.arguments[0])
        ) {
          return
        }

        // Generate a unique key
        const key = simpleHash(`${moduleId}:${state.storeKeyCounter++}`)
        state.storeKeys.add(key)

        // Add the key as the first argument
        path.node.arguments.unshift(t.stringLiteral(key))
        state.modified = true
      }
    }
  }
}

/**
 * Plugin to strip transfer() calls
 */
function stripTransferPlugin(state: any): PluginItem {
  return {
    visitor: {
      CallExpression(path) {
        if (
          !t.isIdentifier(path.node.callee) ||
          !state.transferNames.has(path.node.callee.name)
        ) {
          return
        }

        // Replace the function argument with an empty function
        if (path.node.arguments.length > 0) {
          path.node.arguments = [t.arrowFunctionExpression([], t.objectExpression([]))]
          state.modified = true
        }
      }
    }
  }
}

/**
 * Plugin to remove unreferenced code
 */
function removeUnreferencedPlugin(state: any): PluginItem {
  return {
    visitor: {
      Program: {
        exit(program) {
          // Only run if we've made modifications
          if (!state.modified) {
            return
          }

          const alreadyUnreferenced = getAlreadyUnreferenced(program)
          removeUnreferenced(program, alreadyUnreferenced)
        }
      }
    }
  }
}

/**
 * Get bindings that are already unreferenced before transformations
 */
function getAlreadyUnreferenced(program: NodePath<t.Program>) {
  const alreadyUnreferenced = new Set<string>()

  for (const [name, binding] of Object.entries(program.scope.bindings)) {
    if (!binding.referenced) {
      alreadyUnreferenced.add(name)
    }
  }

  return alreadyUnreferenced
}

/**
 * Remove unreferenced bindings recursively
 */
function removeUnreferenced(
  program: NodePath<t.Program>,
  alreadyUnreferenced: Set<string>
) {
  for (;;) {
    program.scope.crawl()
    let removed = false
    
    for (const [name, binding] of Object.entries(program.scope.bindings)) {
      if (binding.referenced || alreadyUnreferenced.has(name)) {
        continue
      }

      const parent = binding.path.parentPath
      if (
        parent?.isImportDeclaration() &&
        parent.node.specifiers.length === 1
      ) {
        parent.remove()
      } else {
        binding.path.remove()
      }

      removed = true
    }

    if (!removed) break
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

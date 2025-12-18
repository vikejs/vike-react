import { transformAsync, type PluginItem, type NodePath } from '@babel/core'
import * as t from '@babel/types'

// Types
type TransformResult = {
  code: string
  map: any
} | null

type State = {
  modified: boolean
  hasClientOnly: boolean
  clientOnlyNames: Set<string>
  alreadyUnreferenced: Set<string>
}

/**
 * Main code transformer that handles:
 * 1. Stripping children from <ClientOnly> components on server-side
 * 2. Removing unreferenced code (imports, bindings)
 */
export async function transformCode(code: string, id: string): Promise<TransformResult> {
  try {
    const state: State = {
      modified: false,
      hasClientOnly: false,
      clientOnlyNames: new Set<string>(),
      alreadyUnreferenced: new Set<string>(),
    }

    // Determine which syntax plugins to use based on file extension
    const isTypeScript = /\.tsx?$/.test(id)
    const parserPlugins: PluginItem[] = isTypeScript
      ? [['@babel/plugin-syntax-typescript', { isTSX: true }]]
      : ['@babel/plugin-syntax-jsx']

    const result = await transformAsync(code, {
      filename: id,
      ast: true,
      sourceMaps: true,
      plugins: [
        ...parserPlugins,
        analyzeImportsPlugin(state),
        stripClientOnlyChildrenPlugin(state),
        removeUnreferencedPlugin(state),
      ],
    })

    if (!result?.code || !state.hasClientOnly || !state.modified) {
      return null
    }

    return {
      code: result.code,
      map: result.map,
    }
  } catch (error) {
    console.error(`Error transforming code from ${id}:`, error)
    return null
  }
}

/**
 * Plugin to analyze imports and track local names for ClientOnly
 */
function analyzeImportsPlugin(state: State): PluginItem {
  return {
    visitor: {
      ImportDeclaration(path) {
        if (path.node.source.value !== 'vike-react/ClientOnly') {
          return
        }
        state.hasClientOnly = true

        for (const specifier of path.node.specifiers) {
          if (t.isImportSpecifier(specifier) && t.isIdentifier(specifier.imported)) {
            if (specifier.imported.name === 'ClientOnly') {
              state.clientOnlyNames.add(specifier.local.name)
            }
          }
        }
      },
    },
  }
}

/**
 * Plugin to strip children from <ClientOnly> JSX elements on server-side.
 * Transforms: <ClientOnly fallback={...}><Heavy /></ClientOnly>
 * To: <ClientOnly fallback={...}>{null}</ClientOnly>
 */
function stripClientOnlyChildrenPlugin(state: State): PluginItem {
  return {
    visitor: {
      JSXElement(path) {
        const openingElement = path.node.openingElement

        if (!t.isJSXIdentifier(openingElement.name) || !state.clientOnlyNames.has(openingElement.name.name)) {
          return
        }

        // Replace children with null
        if (path.node.children.length > 0) {
          path.node.children = [t.jsxExpressionContainer(t.nullLiteral())]
          state.modified = true
        }
      },
    },
  }
}

/**
 * Plugin to remove unreferenced code
 */
function removeUnreferencedPlugin(state: State): PluginItem {
  return {
    visitor: {
      Program: {
        enter(program) {
          // Capture bindings that are already unreferenced before transformations
          state.alreadyUnreferenced = getAlreadyUnreferenced(program)
        },
        exit(program) {
          // Only run if we've made modifications
          if (!state.modified) {
            return
          }

          removeUnreferenced(program, state.alreadyUnreferenced)
        },
      },
    },
  }
}

/**
 * Get bindings that are already unreferenced before transformations
 */
function getAlreadyUnreferenced(program: NodePath<t.Program>): Set<string> {
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
function removeUnreferenced(program: NodePath<t.Program>, alreadyUnreferenced: Set<string>) {
  for (;;) {
    program.scope.crawl()
    let removed = false

    for (const [name, binding] of Object.entries(program.scope.bindings)) {
      if (binding.referenced || alreadyUnreferenced.has(name)) {
        continue
      }

      const parent = binding.path.parentPath
      if (parent?.isImportDeclaration() && parent.node.specifiers.length === 1) {
        parent.remove()
      } else {
        binding.path.remove()
      }

      removed = true
    }

    if (!removed) break
  }
}

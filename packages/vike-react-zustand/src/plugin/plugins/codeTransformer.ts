import { walk, type Node } from 'estree-walker'
import MagicString from 'magic-string'
import { assert } from '../../utils.js'
import { parseAstAsync } from 'vite'

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
 */
export async function transformCode(code: string, options: TransformOptions): Promise<TransformResult> {
  try {
    const ast = await parseAstAsync(code)
    const transformer = new CodeTransformer(code, ast, options)
    return transformer.transform()
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
 * Class that handles code transformation using AST
 */
class CodeTransformer {
  private magicString: MagicString
  private storeKeys = new Set<string>()
  private storeKeyCounter = 0
  private createNames = new Set<string>()
  private transferNames = new Set<string>()
  private hasVikeReactZustand = false

  constructor(
    private code: string,
    private ast: Node,
    private options: TransformOptions,
  ) {
    this.magicString = new MagicString(code)
  }

  /**
   * Main transform method
   */
  transform(): TransformResult {
    // Analyze imports first
    this.analyzeImports()

    // If no vike-react-zustand import, return early
    if (!this.hasVikeReactZustand) {
      return this.createEmptyResult()
    }

    // If no relevant imports for the requested transformations, return early
    const needsCreateProcessing = this.options.addStoreKeys && this.hasCreateImport()
    const needsTransferProcessing = this.options.stripTransfer && this.hasTransferImport()

    if (!needsCreateProcessing && !needsTransferProcessing) {
      return this.createEmptyResult()
    }

    // Apply transformations
    this.applyTransformations()

    // If no changes were made, return the original code
    if (!this.magicString.hasChanged()) {
      return this.createEmptyResult()
    }

    // Return the transformed code with source map
    return {
      code: this.magicString.toString(),
      map: this.magicString.generateMap({
        source: this.options.id,
        includeContent: true,
      }),
      hasVikeReactZustand: this.hasVikeReactZustand,
      storeKeys: this.storeKeys,
    }
  }

  /**
   * Analyze imports to find vike-react-zustand imports and track local names
   */
  private analyzeImports(): void {
    walk(this.ast, {
      enter: (node: Node) => {
        if (this.isVikeReactZustandImport(node)) {
          assert(node.type === 'ImportDeclaration')
          this.hasVikeReactZustand = true
          this.processImportSpecifiers(node.specifiers)
        }
      },
    })
  }

  /**
   * Check if node is a vike-react-zustand import
   */
  private isVikeReactZustandImport(node: Node): boolean {
    return (
      node.type === 'ImportDeclaration' &&
      typeof node.source.value === 'string' &&
      node.source.value === 'vike-react-zustand'
    )
  }

  /**
   * Process import specifiers to track local names
   */
  private processImportSpecifiers(specifiers: Node[]): void {
    for (const specifier of specifiers) {
      if (
        specifier.type === 'ImportSpecifier' &&
        specifier.imported.type === 'Identifier' &&
        specifier.local.type === 'Identifier'
      ) {
        const importedName = specifier.imported.name
        const localName = specifier.local.name

        if (importedName === 'create') {
          this.createNames.add(localName)
        } else if (importedName === 'transfer') {
          this.transferNames.add(localName)
        }
      }
    }
  }

  /**
   * Check if create is imported
   */
  private hasCreateImport(): boolean {
    return this.createNames.size > 0
  }

  /**
   * Check if transfer is imported
   */
  private hasTransferImport(): boolean {
    return this.transferNames.size > 0
  }

  /**
   * Apply transformations to the AST
   */
  private applyTransformations(): void {
    walk(this.ast, {
      enter: (node: Node) => {
        // Add keys to create() calls if enabled
        if (this.options.addStoreKeys && this.isCreateCall(node)) {
          this.addKeyToCreateCall(node)
        }

        // Strip transfer calls if enabled
        if (this.options.stripTransfer && this.isTransferSpreadElement(node)) {
          this.stripTransferCall(node)
        }
      },
    })
  }

  /**
   * Check if node is a create() call
   */
  private isCreateCall(node: Node): boolean {
    return node.type === 'CallExpression' && node.callee.type === 'Identifier' && this.createNames.has(node.callee.name)
  }

  /**
   * Check if node is a spread element with a transfer() call
   */
  private isTransferSpreadElement(node: Node): boolean {
    return node.type === 'SpreadElement' && this.isTransferCall(node.argument)
  }

  /**
   * Check if node is a transfer() call
   */
  private isTransferCall(node: Node): boolean {
    return (
      node.type === 'CallExpression' && node.callee.type === 'Identifier' && this.transferNames.has(node.callee.name)
    )
  }

  /**
   * Add a unique key to a create() call
   */
  private addKeyToCreateCall(node: Node): void {
    assert(node.type === 'CallExpression' && node.callee.type === 'Identifier')
    // Skip if first argument is already a string literal
    if (this.hasStringLiteralArg(node)) {
      return
    }

    const key = this.generateStoreKey()
    this.storeKeys.add(key)

    // Insert the key as first argument
    const argsStart = node.start + node.callee.name.length + 1
    this.magicString.appendLeft(argsStart, `'${key}', `)
  }

  /**
   * Check if node has a string literal as first argument
   */
  private hasStringLiteralArg(node: any): boolean {
    return (
      node.arguments.length > 0 && node.arguments[0].type === 'Literal' && typeof node.arguments[0].value === 'string'
    )
  }

  /**
   * Generate a unique store key
   */
  private generateStoreKey(): string {
    return simpleHash(`${this.options.id}:${this.storeKeyCounter++}`)
  }

  /**
   * Strip a transfer() call
   */
  private stripTransferCall(node: Node): void {
    this.magicString.remove(node.start, node.end)
  }

  /**
   * Create an empty result object
   */
  private createEmptyResult(): TransformResult {
    return {
      code: this.code,
      map: null,
      hasVikeReactZustand: this.hasVikeReactZustand,
      storeKeys: new Set(),
    }
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

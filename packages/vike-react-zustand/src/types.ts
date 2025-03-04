export type { StoreApiAndHook, StoreApiOnly, StoreHookOnly, Create }

import type { StateCreator, StoreApi, StoreMutatorIdentifier } from 'zustand'

/**
 * The store hook function that is returned by createWrapped
 */
type StoreHookOnly<T> = {
  (): T
  <U>(selector: (state: T) => U): U
}

/**
 * Just the store API without the hook functionality
 */
type StoreApiOnly<T> = StoreApi<T>

/**
 * Combined type used in the React context
 */
type StoreApiAndHook<T = any> = StoreApiOnly<T> & {
  (): any
  <U>(selector: (state: any) => U): U
}

/**
 * The create function type with support for the key parameter
 */
type Create = {
  // Direct call with initializer
  <T, Mos extends [StoreMutatorIdentifier, unknown][] = []>(initializer: StateCreator<T, [], Mos>): StoreHookOnly<T>

  // Direct call with key and initializer
  <T, Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    key: string,
    initializer: StateCreator<T, [], Mos>,
  ): StoreHookOnly<T>

  // Curried call with no arguments
  <T>(): <Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>,
  ) => StoreHookOnly<T>

  // Curried call with key
  <T>(
    key: string,
  ): <Mos extends [StoreMutatorIdentifier, unknown][] = []>(initializer: StateCreator<T, [], Mos>) => StoreHookOnly<T>
}

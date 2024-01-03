export type { StoreApiAndHook, StoreApiOnly, StoreHookOnly, Create, CreateWithPageContext }

import { PageContext } from 'vike/types'
import type { StateCreator, StoreApi, StoreMutatorIdentifier, create } from 'zustand'

type StoreApiAndHook = ReturnType<typeof create>
type StoreApiOnly<T> = StoreApi<T>
type StoreHookOnly<T> = {
  (): T
  <U>(selector: (state: T) => U): U
  /**
   * @deprecated Use `createWithEqualityFn` from 'zustand/traditional'
   */
  <U>(selector: (state: T) => U, equalityFn: (a: U, b: U) => boolean): U
}
type Create = {
  <T, Mos extends [StoreMutatorIdentifier, unknown][] = []>(initializer: StateCreator<T, [], Mos>): StoreHookOnly<T>
  <T>(): <Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>
  ) => StoreHookOnly<T>
}

type CreateWithPageContext = {
  <T, Mos extends [StoreMutatorIdentifier, unknown][] = []>(initializer: StateCreator<T, [], Mos>): StoreHookOnly<T>
  <T>(): <Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: (pageContext: PageContext) => StateCreator<T, [], Mos>
  ) => StoreHookOnly<T>
}

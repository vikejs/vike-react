export {}

import type { StateCreator, StoreApi, StoreMutatorIdentifier, create } from 'zustand'

export type StoreApiAndHook = ReturnType<typeof create>
export type StoreApiOnly<T> = StoreApi<T>
export type StoreHookOnly<T> = {
  (): T
  <U>(selector: (state: T) => U): U
  /**
   * @deprecated Use `createWithEqualityFn` from 'zustand/traditional'
   */
  <U>(selector: (state: T) => U, equalityFn: (a: U, b: U) => boolean): U
}
export type Create = {
  <T, Mos extends [StoreMutatorIdentifier, unknown][] = []>(initializer: StateCreator<T, [], Mos>): StoreHookOnly<T>
  <T>(): <Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>
  ) => StoreHookOnly<T>
}

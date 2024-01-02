import type { Mutate, StateCreator, StoreMutatorIdentifier, create, StoreApi } from 'zustand'

type ExtractState<S> = S extends {
  getState: () => infer T
}
  ? T
  : never
export type StoreApiAndHook = ReturnType<typeof create>
export type StoreApiOnly<Store extends StoreApiAndHook> = Pick<Store, keyof StoreApi<unknown>>

// Copied from zustand, but removed the store api
export type StoreHookOnly<Store> = {
  (): ExtractState<Store>
  <U>(selector: (state: ExtractState<Store>) => U): U
  /**
   * @deprecated Use `createWithEqualityFn` from 'zustand/traditional'
   */
  <U>(selector: (state: ExtractState<Store>) => U, equalityFn: (a: U, b: U) => boolean): U
} // & S <-- removed the store api, because it's misleading in an SSR app
export type Create = {
  <T, Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>
  ): StoreHookOnly<Mutate<StoreApi<T>, Mos>>
  <T>(): <Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>
  ) => StoreHookOnly<Mutate<StoreApi<T>, Mos>>
  /**
   * @deprecated Use `useStore` hook to bind store
   */
  <Store extends StoreApi<unknown>>(store: Store): StoreHookOnly<Store>
}

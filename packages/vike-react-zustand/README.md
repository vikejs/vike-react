<!-- WARNING: keep links absolute in this file so they work on NPM too -->

[![npm version](https://img.shields.io/npm/v/vike-react-zustand)](https://www.npmjs.com/package/vike-react-zustand)

# `vike-react-zustand`

Integrates [Zustand](https://zustand-demo.pmnd.rs/) state management into your [`vike-react`](https://vike.dev/vike-react) app with SSR support.

> [!NOTE]
> Includes:
> - Automatic state hydration on the client
> - Access to pageContext in store initializers
> - Built-in devtools integration

[Installation](#installation)
[Basic usage](#basic-usage)
[`withPageContext()`](#withpagecontext)
[`useStoreApi()`](#usestoreapi)
[How it works](#how-it-works)
[Version history](https://github.com/vikejs/vike-react/blob/main/packages/vike-react-zustand/CHANGELOG.md)
[See also](#see-also)

<br/>


## Installation

1. `npm install zustand vike-react-zustand`
2. Extend `+config.js`:
   ```js
   // pages/+config.js

   import vikeReact from 'vike-react/config'
   import vikeReactZustand from 'vike-react-zustand/config'

   export default {
     // ...
     extends: [vikeReact, vikeReactZustand]
   }
   ```

> [!NOTE]
> The `vike-react-zustand` extension requires [`vike-react`](https://vike.dev/vike-react).

<br/>


## Basic usage

Create a store with the `create` function from `vike-react-zustand`:

```ts
// store.ts
import { create } from 'vike-react-zustand'

interface Store {
  counter: number
  increment: () => void
}

export const useStore = create<Store>()((set) => ({
  counter: 0,
  increment: () => set((state) => ({ counter: state.counter + 1 })),
}))
```

Use the store in your components:

```jsx
import { useStore } from './store'

function Counter() {
  const counter = useStore((state) => state.counter)
  const increment = useStore((state) => state.increment)

  return (
    <button onClick={increment}>Counter {counter}</button>
  )
}
```

<br/>

## `withPageContext()`

The `withPageContext` middleware gives your store access to the Vike `pageContext` during initialization:

```ts
import { create, withPageContext } from 'vike-react-zustand'

interface Store {
  user: any
  nodeVersion: string
}

export const useStore = create<Store>()(
  withPageContext((pageContext) => (set) => ({
    // Access server-only data during SSR
    nodeVersion: import.meta.env.SSR ? process.version : undefined,
    // Access pageContext data
    user: pageContext.user
  }))
)
```

<br/>

## `useStoreApi()`

Sometimes you need to access state in a non-reactive way or act upon the store. For these cases, `useStoreApi` can be used:

```tsx
import { useStoreApi } from 'vike-react-zustand'
import { useStore } from './store'

function Component() {
  const storeApi = useStoreApi(useStore)

  // Subscribe to store changes
  useEffect(
    () => storeApi.subscribe(
      state => console.log('Store changed:', state)
    ),
    []
  )

  // Get current state without subscribing to changes
  const handleClick = () => {
    const currentState = storeApi.getState()
    storeApi.setState({ counter: currentState.counter + 5 })
  }

  return <button onClick={handleClick}>Add 5</button>
}
```

> [!NOTE]
> Middlewares that modify `set` or `get` are not applied to `getState` and `setState`.

<br/>

## How it works

The `vike-react-zustand` extension enables Zustand stores to work seamlessly with server-side rendering:

1. During SSR, store state is captured and serialized
2. The serialized state is injected into the HTML response
3. On the client, the store is hydrated with the server state
4. The `devtools` middleware is included by default for easier debugging

The extension handles all the complexities of state transfer between server and client, ensuring your React components have access to the same state during both server rendering and client hydration.

<br/>

## See also

- [Example](https://github.com/vikejs/vike-react/tree/main/examples/zustand)
- [Vike Docs > State Management](https://vike.dev/state-management)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Zustand GitHub](https://github.com/pmndrs/zustand)

<!-- WARNING: keep links absolute in this file so they work on NPM too -->

[<img src="https://vike.dev/vike-readme.svg" align="right" height="90">](https://vike.dev)
[![npm version](https://img.shields.io/npm/v/vike-react-zustand-experimental)](https://www.npmjs.com/package/vike-react-zustand-experimental)

# `vike-react-zustand-experimental`

Experimental [Zustand](https://github.com/pmndrs/zustand) integration for [Vike](https://vike.dev) with React.

## Features

- **Server-Side State Transfer**: Run code on the server and make the resulting state available on the client
- **Page Context Access**: Use Vike's page context in your stores
- **Redux DevTools**: Enabled by default for debugging
- **TypeScript Support**: Type safety for your stores
- **Async Support**: Handle async operations in store initialization

## Installation

```bash
npm install zustand vike-react-zustand-experimental
```

## Setup

Extend your Vike configuration:

```js
// pages/+config.ts
import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'
import vikeReactZustandExperimental from 'vike-react-zustand-experimental/config'

export default {
  // ...
  extends: [vikeReact, vikeReactZustandExperimental]
} satisfies Config
```

## Basic Usage

### Creating a Store

```ts
// store.ts
import { create } from 'vike-react-zustand-experimental'

interface Store {
  counter: number
  setCounter: (value: number) => void
}

const useStore = create<Store>()((set) => ({
  counter: 0,
  setCounter(value) {
    set((state) => ({
      ...state,
      counter: value
    }))
  }
}))

export { useStore }
```

### Using the Store in Components

```tsx
// Component.tsx
import { useStore } from './store'

function Counter() {
  const { counter, setCounter } = useStore()
  
  return (
    <button onClick={() => setCounter(counter + 1)}>
      Counter {counter}
    </button>
  )
}
```

## Advanced Features

### `withPageContext` - Access Page Context in Stores

The `withPageContext` middleware makes Vike's page context available to your store:

```ts
import { create, withPageContext } from 'vike-react-zustand-experimental'

interface Store {
  user: {
    id: string
    email: string
  }
}

const useStore = create<Store>()(
  withPageContext((pageContext) => (set) => ({
    user: pageContext.user
  }))
)
```

### `transfer` - Server-Only Code with Client Access

The `transfer` function allows you to run code only on the server while making the results available on both server and client:

```ts
import { create, transfer } from 'vike-react-zustand-experimental'

const useStore = create<{ nodeVersion: string; serverData: any }>()((set) => ({
  // This function only runs on the server
  ...transfer(async () => ({
    // Access server-only APIs
    nodeVersion: process.version,
    // Can be async and fetch data
    serverData: await fetchDataFromDatabase()
  }))
}))
```

### `initialize` - Run Code After Store Creation

The `initialize` function runs after the store is created and can be used to perform initialization logic:

```ts
import { create, initialize } from 'vike-react-zustand-experimental'

const useStore = create<Store>()((set, get) => ({
  counter: 0,
  setCounter: (value) => set({ counter: value }),
  
  // Runs after store creation on both client and server
  ...initialize(async () => {
    console.log('Store initialized with:', get())
    // Can return values to merge into the store
    return { initialized: true }
  })
}))
```

### `useStoreApi` - Non-Reactive Store Access

For cases where you need non-reactive access to the store:

```tsx
import { useStoreApi } from 'vike-react-zustand-experimental'
import { useStore } from './store'

function Component() {
  const api = useStoreApi(useStore)
  
  // Access store methods without causing re-renders
  function handleClick() {
    api.setState({ counter: 100 })
  }
  
  // Subscribe to store changes
  useEffect(() => {
    const unsubscribe = api.subscribe(
      state => console.log('Store changed:', state)
    )
    return unsubscribe
  }, [])
  
  return <button onClick={handleClick}>Set to 100</button>
}
```

> ⚠️ Note: Middlewares that modify `set` or `get` are not applied to `getState` and `setState`.

## Using with Immer

Zustand's Immer middleware works seamlessly with vike-react-zustand-experimental:

```ts
import { create } from 'vike-react-zustand-experimental'
import { immer } from 'zustand/middleware/immer'

interface Store {
  counter: number
  setCounter: (value: number) => void
}

const useStore = create<Store>()(
  immer((set) => ({
    counter: 0,
    setCounter(value) {
      set((state) => {
        state.counter = value
      })
    }
  }))
)
```

## Multiple Stores

You can create and use multiple stores in your application:

```ts
// userStore.ts
export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  setUser: (user) => set({ user })
}))

// cartStore.ts
export const useCartStore = create<CartStore>()((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  }))
}))
```

## How It Works

vike-react-zustand-experimental integrates Zustand with Vike's SSR lifecycle:

1. **Server-Side**:
   - Creates stores needed for the current page
   - Executes `transfer()` functions to get server-only data
   - Runs `initialize()` functions
   - Serializes and attaches state to the page context

2. **Client-Side**:
   - Creates client-side stores
   - Hydrates them with the server state
   - Runs `initialize()` functions
   - Provides access to server-generated data

## Examples

See the [example project](https://github.com/vikejs/vike-react/tree/main/examples/zustand-experimental) for a complete implementation.

## Related Packages

- [vike-react](https://github.com/vikejs/vike-react) - React integration for Vike
- [vike-react-query](https://github.com/vikejs/vike-react/tree/main/packages/vike-react-query) - React Query integration for Vike

> See also other [Vike extensions](https://vike.dev/vike-packages).

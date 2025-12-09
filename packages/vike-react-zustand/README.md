<!-- WARNING: keep links absolute in this file so they work on NPM too -->

[![npm version](https://img.shields.io/npm/v/vike-react-zustand)](https://www.npmjs.com/package/vike-react-zustand)

# `vike-react-zustand`

Integrates [Zustand](https://zustand-demo.pmnd.rs/) state management into your [`vike-react`](https://vike.dev/vike-react) app with SSR support.

> [!NOTE]
> If you don't use any of your Zustand store during [SSR](https://vike.dev/ssr), then **you don't need `vike-react-zustand`** — you can use Zustand without any Vike integration.
>
> The `vike-react-zustand` extension is about enabling you to use stores with SSR. See [How it works](#how-it-works).

[Installation](#installation)  
[Basic usage](#basic-usage)  
[`withPageContext()`](#withpagecontext)  
[`useStoreVanilla()`](#usestorevanilla)  
[Example](#example)  
[Populate store with `+data`](#populate-store-with-data)  
[Version history](#version-history)  
[How it works](#how-it-works)  
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

Create a store using the `create()` function from `vike-react-zustand`:

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

> [!NOTE]
> The API is the same as [Zustand's `create()`](https://zustand.docs.pmnd.rs/apis/create#reference).
>
> (Extra parentheses `()` are required only when using TypeScript, as explained [here](https://zustand.docs.pmnd.rs/guides/typescript#basic-usage).)

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

The `withPageContext` middleware gives your store access to the Vike [`pageContext`](https://vike.dev/pageContext) during initialization:

```ts
import { create, withPageContext } from 'vike-react-zustand'

interface Store {
  user: any
  nodeVersion: string
}

export const useStore = create<Store>()(
  withPageContext((pageContext) => (set, get, store) => ({
    // Access pageContext data
    user: pageContext.user
  }))
)
```

**API Reference**

```ts
const nextStateCreatorFn = withPageContext((pageContext) => stateCreatorFn)
```

- [`pageContext`](https://vike.dev/pageContext)
- `stateCreatorFn`: A state creator function that takes `set` function, `get` function and `store` as arguments. Usually, you will return an object with the methods you want to expose.
- Returns: a state creator function.

<br/>

## `useStoreVanilla()`

Sometimes you need to access state in a non-reactive way or act upon the store. For these cases, you can use `useStoreVanilla` to directly access the [vanilla store](https://zustand.docs.pmnd.rs/apis/create-store).

```tsx
import { useStoreVanilla } from 'vike-react-zustand'
import { useStore } from './store'

function Component() {
  const storeVanilla = useStoreVanilla(useStore)

  // Subscribe to store changes
  useEffect(
    () => storeVanilla.subscribe(
      state => console.log('Store changed:', state)
    ),
    []
  )

  // Get current state without subscribing to changes
  const handleClick = () => {
    const currentState = storeVanilla.getState()
    storeVanilla.setState({ counter: currentState.counter + 5 })
  }

  return <button onClick={handleClick}>Add 5</button>
}
```

> [!NOTE]
> Middlewares that modify `set` or `get` are not applied to `getState` and `setState`.

<br/>

## Example

See [examples/zustand/](https://github.com/vikejs/vike-react/tree/main/examples/zustand).

<br/>

## Populate store with `+data`

To populate your store with data fetched via the [`+data`](https://vike.dev/data) hook, use the [`withPageContext()`](#withpagecontext) middleware.

```ts
import { create, withPageContext } from 'vike-react-zustand'
import { immer } from 'zustand/middleware/immer'
import type { Data } from './+data'

type Todo = { text: string }
interface TodoStore {
  todoItems: Todo[]
  addTodo: (todo: Todo) => void
}
export const useTodoStore = create<TodoStore>()(
  withPageContext((pageContext) =>
    immer((set, get) => ({
      todoItems: (pageContext.data as Data).todoItemsInitial,
      addTodo(todo) {
        set((state) => {
          state.todoItems.push(todo)
        })
      },
    })),
  ),
)
```

See the To-Do List example at [examples/zustand/](https://github.com/vikejs/vike-react/tree/main/examples/zustand).

<br/>

## Version history

See [CHANGELOG.md](https://github.com/vikejs/vike-react/blob/main/packages/vike-react-zustand/CHANGELOG.md).

<br/>

## How it works

The `vike-react-zustand` extension enables Zustand stores to work seamlessly with [SSR](https://vike.dev/ssr):

1. During SSR, store state is captured and serialized
2. The serialized state is passed to the client
3. On the client, the store is hydrated using the server-side state

The extension handles all the complexities of state transfer between server and client, ensuring your React components have access to the same state during both serer-side rendering and client-side hydration.

<br/>

## See also

- [Vike Docs > State Management](https://vike.dev/store)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)

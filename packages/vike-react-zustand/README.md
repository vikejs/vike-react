<!-- WARNING: keep links absolute in this file so they work on NPM too -->

[<img src="https://vike.dev/vike-readme.svg" align="right" height="90">](https://vike.dev)
[![npm version](https://img.shields.io/npm/v/vike-react-zustand)](https://www.npmjs.com/package/vike-react-zustand)

# `vike-react-zustand`

# This package is not ready for use.


[Zustand](https://github.com/pmndrs/zustand) integration for [Vike](https://vike.dev).

See [example](https://github.com/vikejs/vike-react/tree/main/examples/zustand).

> See also other [Vike extensions](https://vike.dev/vike-packages).


# [Introduction](https://docs.pmnd.rs/zustand/getting-started/introduction)
### How to use vike-react-zustand

Vike-react-zustand is just a wrapper around Zustand, with a few additional features. Redux devtools are enabled by default.

---

### `create`
Create a store:
```ts
import { create } from 'vike-react-zustand'

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
```

### `withPageContext`
Middleware to make pageContext available to the store.
```ts
import { create, withPageContext } from 'vike-react-zustand'

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

### `serverOnly`
The function passed to serverOnly() only runs on the server-side, while the state returned by it is available on both the server- and client-side.

```ts
import { create, serverOnly } from 'vike-react-zustand'

// We use serverOnly() because process.version is only available on the server-side but we want to be able to access it everywhere (client- and server-side).
const useStore = create<{ nodeVersion: string }>()({
  ...serverOnly(() => ({
    // This function is called only on the server-side, but nodeVersion is available on both the server- and client-side.
    nodeVersion: process.version
  }))
})
```

### `useStoreApi`
Sometimes you need to access state in a non-reactive way or act upon the store. For these cases, `useStoreApi` can be used.

⚠️ Note that middlewares that modify set or get are not applied to getState and setState.

```ts
import { useStoreApi } from 'vike-react-zustand'
import { useStore } from './store'

function Component() {
  const api = useStoreApi(useStore)
  function onClick() {
    api.setState({ ... })
  }
}
```

## With immer
```ts
import { create } from 'vike-react-zustand'
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

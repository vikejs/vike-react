<!-- WARNING: keep links absolute in this file so they work on NPM too -->

[![npm version](https://img.shields.io/npm/v/vike-react-redux)](https://www.npmjs.com/package/vike-react-redux)

# `vike-react-redux`

Integrates [Redux](https://react-redux.js.org) into your [`vike-react`](https://vike.dev/vike-react) app.

[Installation](#installation)  
[Example](#example)  
[Settings](#settings)  
[Populate store with `+data`](#populate-store-with-data)  
[Version history](#version-history)  
[What it does](#what-it-does)  
[See Also](#see-also)  


<br/>

## Installation

1. `npm install vike-react-redux react-redux @reduxjs/toolkit`
2. Extend `+config.js`:
   ```js
   // pages/+config.js

   import vikeReact from "vike-react/config"
   import vikeReactRedux from "vike-react-redux/config"

   export default {
     // ...
     extends: [vikeReact, vikeReactRedux]
   }
   ```
3. Create `+redux.js` file:
   ```js
    // pages/+redux.js
    // Environemnt: client, server

    import { createStore } from '../store/createStore'
    export default { createStore }
    ```
    ```ts
    // store/createStore.ts

    export { createStore }
    export type AppStore = ReturnType<typeof createStore>
    export type RootState = ReturnType<AppStore['getState']>
    export type AppDispatch = AppStore['dispatch']

    import { combineReducers, configureStore } from '@reduxjs/toolkit'
    import { countReducer } from './slices/count'
    import { todosReducer } from './slices/todos'
    const reducer = combineReducers({ count: countReducer, todos: todosReducer })

    function createStore(pageContext) {
      const preloadedState = pageContext.isClientSide ? pageContext.redux.ssrState : undefined
      return configureStore({ reducer, preloadedState })
    }
   ```
   ```ts
   // store/hooks.ts

   // This file serves as a central hub for re-exporting pre-typed Redux hooks.
   import { useDispatch, useSelector, useStore } from 'react-redux'
   import type { AppDispatch, AppStore, RootState } from './createStore'

   // Use throughout your app instead of plain `useDispatch` and `useSelector`
   export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
   export const useAppSelector = useSelector.withTypes<RootState>()
   export const useAppStore = useStore.withTypes<AppStore>()
   ```
4. You can now use Redux at any of your components.
   ```tsx
   // components/Counter.tsx

   export { Counter }

   import React from 'react'
   import { useAppDispatch, useAppSelector } from '../store/hooks'
   import { increment, selectCount } from '../store/slices/count'

   function Counter() {
     const dispatch = useAppDispatch()
     const count = useAppSelector(selectCount)
     return (
       <button type="button" onClick={() => dispatch(increment())}>
         Counter {count}
       </button>
     )
   }
   ```


<br/>

## Example

See [examples/redux](https://github.com/vikejs/vike-react/tree/main/examples/redux).


<br/>

## Settings

The only `+redux` setting is `createStore()` as documented at [Installation](#installation).

**Install only for some pages**

You can remove the `vike-react-redux` integration for [some of your pages](https://vike.dev/config#inheritance):

```js
// pages/about/+redux.js

export const redux = null
```

**Custom integration**

For full customization consider [ejecting](https://vike.dev/eject).

> [!NOTE]
> Consider making a [Pull Request before ejecting](https://vike.dev/eject#when-to-eject).


<br/>

## Populate store with `+data`

To populate your store with data fetched via the [`+data`](https://vike.dev/data) hook, use [`+onData`](https://vike.dev/onData) and [`pageContext.data`](https://vike.dev/pageContext#data).

```ts
// pages/todos/+onData.ts
// Environment: server, client

export { onData }

import type { PageContext } from 'vike/types'
import type { Data } from './+data'
import { initializeTodos } from '../../store/slices/todos'

function onData(pageContext: PageContext & { data?: Data }) {
  const { store } = pageContext
  store.dispatch(initializeTodos(pageContext.data!.todoItemsInitial))

  // Saving KBs: we don't need pageContext.data (we use the store instead)
  // - If we don't delete pageContext.data then Vike sends pageContext.data to the client-side
  // - This optimization only works if the page is SSR'd: if the page is pre-rendered then don't do this
  delete pageContext.data
}
```

See To-Do List example at [examples/redux/](https://github.com/vikejs/vike-react/tree/main/examples/redux).

> [!NOTE]
> During [SSR](https://vike.dev/ssr), `+onData` is called only on the server. That's because the store state is sent to the client, so that when the page hydrates, the client has the exact same state as the server — preventing [hydration mismatches](https://vike.dev/hydration-mismatch).
>
> As a result, the store doesn't need to be populated on the client: it's already populated on the server and then sent to the client.
>
> See also: [What it does](#what-it-does).

<br/>

## Version history

See [CHANGELOG.md](https://github.com/vikejs/vike-react/blob/main/packages/vike-react-redux/CHANGELOG.md).


<br/>

## What it does

`vike-react-redux` does the following:
 - Initializes the store. (Using [`+onCreatePageContext.server`](https://vike.dev/onCreatePageContext), [`+onAfterRenderHtml.server`](https://vike.dev/onAfterRenderHtml), and [`+onBeforeRenderClient.client`](https://vike.dev/onBeforeRenderClient).)
 - Installs Redux's [`<Provider>`](https://react-redux.js.org/api/provider).
 - Passes the initial state (`pageContext.redux.ssrState`) used during [SSR](https://vike.dev/ssr) to the client. (To ensure that the same state is used for hydration, preventing hydration mismatches.)

For more details, have a look at the source code of `vike-react-redux` (it's tiny!).

You can learn more at:
 - [Vike > Store (State Management) > SSR](https://vike.dev/store#ssr)
 - [Redux > Server Side Rendering](https://redux.js.org/usage/server-rendering)


<br/>

## See also

- [Example](https://github.com/vikejs/vike-react/tree/main/examples/redux)
- [Vike Docs > Redux](https://vike.dev/redux)
- [Vike Docs > Store](https://vike.dev/store)
- [React Redux](https://react-redux.js.org)

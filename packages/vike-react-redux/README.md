# `vike-react-redux`

Integrates [React Redux](https://react-redux.js.org) to your [`vike-react`](https://vike.dev/vike-react) app.

[Installation](#installation)  
[Settings](#settings)  
[Version history](https://github.com/vikejs/vike-react/blob/main/packages/vike-react-redux/CHANGELOG.md)  
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

3. Create `+redux.ts` file with the following code format/example:
   ```ts
    export const redux = {
        createStore
    }
    
    export type AppStore = ReturnType<typeof createStore>
    export type RootState = ReturnType<AppStore['getState']>
    export type AppDispatch = AppStore['dispatch']
    
    // Set up your reducers and import them
    import counterReducer from '../lib/features/counter/counterSlice'
    import { combineReducers, configureStore } from '@reduxjs/toolkit'
    
    const rootReducer = combineReducers({ counter: counterReducer })
    
    function createStore(preloadedState?: Record<string, unknown>) {
        return configureStore({
            reducer: rootReducer,
            preloadedState
        })
    }
   ```

4. Optionally, update your `global.d.ts` like this:
   ```ts
    import { AppStore, RootState } from "./pages/+redux";

    declare global {
        namespace Vike {
            interface PageContext {
                // Refine type of pageContext.reduxStore (it's `Store` by default)
                reduxStore?: AppStore
                // Refine type of pageContext.reduxState (it's `unknown` by default)
                reduxState?: RootState
            }
        }
    }

    export {};
   ```

5. You can now use React Redux at any of your components.
   ```tsx
    import React from "react"
    import { increment, selectCount } from "../../lib/features/counter/counterSlice"
    import { useDispatch, useSelector } from "react-redux"
    import type { AppDispatch } from "../+redux"

    export function Counter() {
        const dispatch = useDispatch<AppDispatch>()
        const count = useSelector(selectCount)

        return (
            <button type="button" onClick={() => dispatch(increment())}>
                Counter {count}
            </button>
        )
    }
   ```

<br/>

## Settings
You can remove the `vike-react-redux` integration from [some of your pages](https://vike.dev/config#inheritance):

```js
// pages/about/+redux.js

export const redux = null
```

For full customization consider [ejecting](https://vike.dev/eject).

> [!NOTE]
> Consider making a [Pull Request before ejecting](https://vike.dev/eject#when-to-eject).

<br/>

## What it does

The `vike-react-redux` extension simplifies SSR with React-Redux by ensuring the server's Redux state is sent to the client. 

It creates a fresh store per request, optionally dispatches actions, extracts the state, and includes it in the HTML response. On the client, the Redux store is initialized with this state, ensuring consistent markup between server and client.

You can learn more at:
 - [Vike > Store (State Management) > SSR](https://vike.dev/store#ssr)
 - [Redux > Server Side Rendering](https://redux.js.org/usage/server-rendering)


<br/>

## See also

- [Vike Docs > Redux](https://vike.dev/redux)
- [Vike Docs > Store](https://vike.dev/store)
- [React Redux](https://react-redux.js.org)

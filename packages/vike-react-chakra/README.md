<!-- WARNING: keep links absolute in this file so they work on NPM too -->

[<img src="https://vike.dev/vike-readme.svg" align="right" height="90">](https://vike.dev)
[![npm version](https://img.shields.io/npm/v/vike-react-chakra)](https://www.npmjs.com/package/vike-react-chakra)

# `vike-react-chakra`

[Installation](#installation)  
[Basic usage](#basic-usage)  
[`+chakra` Setting](#chakra-setting)  
[See also](#see-also)  

<br/>

## Installation

1. npm install @chakra-ui/react @emotion/react vike-react-chakra
2. Extend `+config.js`:
   ```js
   // pages/+config.js

   import vikeReact from 'vike-react/config'
   import vikeReactChakra from 'vike-react-chakra/config'

   export default {
     // ...
     extends: [vikeReact, vikeReactChakra]
   }
   ```

> [!NOTE]
> The `vike-react-chakra` extension requires [`vike-react`](https://vike.dev/vike-react).

<br/>

## Basic usage
```jsx
import { HStack, Button } from '@chakra-ui/react'

const Demo = () => {
  return (
    <HStack>
      <Button>Click me</Button>
      <Button>Click me</Button>
    </HStack>
  )
}
```

> [!NOTE]
> Chakra UI provides a cli tool to add snippets.  
> Snippets are pre-built components that you can use to build your UI faster.  
> Using the `@chakra-ui/cli` you can add snippets to your project.

```
npx @chakra-ui/cli snippet add
```

<br/>

## `+chakra` Setting
`vike-react-chakra` provides a custom setting, `+chakra`, for configuring custom theme system, custom locale to adds `LocaleProvider` and can be used to disable Chakra UI for specific pages.
```js
// pages/+chakra.js
import React, { ReactNode } from 'react'
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const customConfig = defineConfig({
  globalCss: {
    "html, body": {
      margin: 0,
      padding: 0,
    },
  },
})

const system = createSystem(defaultConfig, customConfig)

export const chakra = {
  system,
  locale: "ar-BH"
}
```

To disable Chakra UI for specific page:
```js
// pages/about/+chakra.js
export const chakra = null
```

<br/>

## See also

- [Chakra UI Components](https://www.chakra-ui.com/docs/components/concepts/overview)
- [Chakra UI Styling](https://www.chakra-ui.com/docs/styling/overview)
- [Chakra UI Theming](https://www.chakra-ui.com/docs/theming/overview)

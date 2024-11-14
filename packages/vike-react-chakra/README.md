[![npm version](https://img.shields.io/npm/v/vike-react-chakra)](https://www.npmjs.com/package/vike-react-chakra)

# `vike-react-chakra`

[Installation](#installation)  
[`+chakra` Setting](#chakra-setting)  

<br/>

## Installation

1. `npm install vike-react-chakra @chakra-ui/react @emotion/react`
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


3. That's it! You can now use Chakra UI components in any of your components.
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

<br/>

## `+chakra` Setting

`vike-react-chakra` provides a configuration `+chakra` for setting a custom theme system and custom locale.
```js
// pages/+chakra.js

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
  locale: "fr-FR"
}
```

You can remove Chakra UI [for some of your pages](https://vike.dev/config#inheritance):
```js
// pages/about/+chakra.js

export const chakra = null
```
# `vike-react-chakra`

[Installation](#installation)  
[Settings](#settings)  

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
3. That's it! You can now use Chakra at any of your components.
   ```jsx
   import { HStack, Button } from '@chakra-ui/react'

   function SomeComponent() {
     return (
       <HStack>
         <Button>Click me</Button>
         <Button>Click me</Button>
       </HStack>
     )
   }
   ```

<br/>

## Settings

`vike-react-chakra` provides a configuration `+chakra` for setting the theme system and locale.
```js
// pages/+chakra.js

export { chakra }

import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const customConfig = defineConfig({
  globalCss: {
    "html, body": {
      margin: 0,
      padding: 0
    }
  }
})

const system = createSystem(defaultConfig, customConfig)

const chakra = {
  system,
  locale: "fr-FR"
}
```

You can remove Chakra UI [for some of your pages](https://vike.dev/config#inheritance):
```js
// pages/about/+chakra.js

export const chakra = null
```

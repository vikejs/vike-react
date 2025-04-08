# `vike-react-chakra`

Integrates [Chakra UI](https://www.chakra-ui.com/) into your [`vike-react`](https://vike.dev/vike-react) app.

[Installation](#installation)  
[Settings](#settings)  
[Version history](https://github.com/vikejs/vike-react/blob/main/packages/vike-react-chakra/CHANGELOG.md)  
[See also](#see-also)  

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
3. You can now use Chakra in any of your components.
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

> [!NOTE]
> The `vike-react-chakra` extension requires [`vike-react`](https://vike.dev/vike-react).

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

You can remove Chakra from [some of your pages](https://vike.dev/config#inheritance):

```js
// pages/about/+chakra.js

export const chakra = null
```

For full customization consider [ejecting](https://vike.dev/eject).

> [!NOTE]
> Consider making a [Pull Request before ejecting](https://vike.dev/eject#when-to-eject).

<br/>

## See also

- [Vike Docs > Chakra UI](https://vike.dev/chakra)

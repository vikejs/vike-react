# `vike-react-antd`

Integrates [Ant Design](https://ant.design) to your [`vike-react`](https://vike.dev/vike-react) app.

[Installation](#installation)  
[Settings](#settings)  
[Version history](https://github.com/vikejs/vike-react/blob/main/packages/vike-react-antd/CHANGELOG.md)  
[What it does](#what-it-does)  
[See Also](#see-also)  

<br/>

## Installation

1. `npm install vike-react-antd antd @ant-design/cssinjs`
2. Extend `+config.js`:
   ```js
   // pages/+config.js

   import vikeReact from "vike-react/config"
   import vikeReactAntd from "vike-react-antd/config"

   export default {
     // ...
     extends: [vikeReact, vikeReactAntd]
   }
   ```
3. You can now use Ant Design at any of your components.
   ```jsx
   import { Button, Flex } from "antd";

   function SomeComponent() {
     return (
       <Flex gap="small" wrap>
        <Button type="primary">Primary Button</Button>
        <Button>Default Button</Button>
      </Flex>
     )
   }
   ```

> [!NOTE]
> The `vike-react-antd` extension requires [`vike-react`](https://vike.dev/vike-react).

<br/>

## Settings

`vike-react-antd` provides a configuration `+antd` for customizing Ant Design [Style Compatibility](https://ant.design/docs/react/compatible-style).

```ts
// pages/+antd.ts
export { antd }

import { legacyLogicalPropertiesTransformer, px2remTransformer, type StyleProviderProps } from "@ant-design/cssinjs"

const px2rem = px2remTransformer({
  rootValue: 32, // 32px = 1rem; @default 16
})

const antd: Omit<StyleProviderProps, "children" | "cache"> = {
  hashPriority: "high",
  layer: true,
  transformers: [legacyLogicalPropertiesTransformer, px2rem],
}
```

You can remove the `vike-react-antd` integration from [some of your pages](https://vike.dev/config#inheritance):

```js
// pages/about/+antd.js

export const antd = null
```

For full customization consider [ejecting](https://vike.dev/eject).

> [!NOTE]
> Consider making a [Pull Request before ejecting](https://vike.dev/eject#when-to-eject).

<br/>

## What it does

The `vike-react-antd` extension allows you to use Ant Design without [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content).

It collects the page's styles during SSR and injects them in the HTML, ensuring that styles are applied early (before even JavaScript starts loading).

You can learn more at:
 - [Vike > CSS-in-JS > Collect styles](https://vike.dev/css-in-js#collect-styles)
 - [Antd Design > Server Side Rendering](https://ant.design/docs/react/server-side-rendering)

For more details, have a look at the source code of `vike-react-styled-jsx` (which is small).

<br/>

## See also

- [Vike Docs > Ant Design](https://vike.dev/antd)
- [Vike Docs > CSS-in-JS](https://vike.dev/css-in-js)
- [Antd Design](https://ant.design)

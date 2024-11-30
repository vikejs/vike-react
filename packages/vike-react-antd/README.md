# `vike-react-antd`

[Installation](#installation)  
[Settings](#settings)  
[Version history](https://github.com/vikejs/vike-react/blob/main/packages/vike-react-antd/CHANGELOG.md)  
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

> [!NOTE]
> The main purpose of this extension is to simplify the integration of Ant Design with [Server Side Rendering](https://ant.design/docs/react/server-side-rendering).

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

const antd: Omit<StyleProviderProps, "children"> = {
  hashPriority: "high",
  layer: true,
  transformers: [legacyLogicalPropertiesTransformer, px2rem],
}
```

You can remove Ant Design from [some of your pages](https://vike.dev/config#inheritance):
```js
// pages/about/+antd.js

export const antd = null
```

<br/>

## See also

- [Vike Docs > Ant Design](https://vike.dev/antd)

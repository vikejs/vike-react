# `vike-react-styled-components`

[Installation](#installation)  
[Settings](#settings)  
[Version history](https://github.com/vikejs/vike-react/blob/main/packages/vike-react-styled-components/CHANGELOG.md)  
[See also](#see-also)  

<br/>

Integrates [styled-components](https://styled-components.com) to your [`vike-react`](https://vike.dev/vike-react) app.

## Installation

1. ```
   npm install vike-react-styled-components styled-components
   npm install --save-dev babel-plugin-styled-components
   ```
   
2. Extend `+config.js`:
   ```js
   // pages/+config.js

   import vikeReact from "vike-react/config"
   import vikeReactStyledComponents from "vike-react-styled-components/config"

   export default {
     // ...
     extends: [vikeReact, vikeReactStyledComponents]
   }
   ```

3. Install `babel-plugin-styled-components`:
   ```js
   // vite.config.js
   import { defineConfig } from "vite"
   import react from "@vitejs/plugin-react"
   import vike from "vike/plugin"
   
   export default defineConfig({
     plugins: [
      vike(),
      react({
        babel: {
          plugins: [["babel-plugin-styled-components"]],
        },
      }),
    ],
   });
   ```

4. You can now use styled-components at any of your components.
   ```jsx
   import { styled } from "styled-components";

   const Title = styled.h1`
      font-size: 1.5em;
      text-align: center;
      color: #BF4F74;
    `;

   const Wrapper = styled.section`
      padding: 4em;
      background: papayawhip;
    `;

   function SomeComponent() {
     return (
       <Wrapper>
        <Title>Hello World!</Title>
      </Wrapper>
     )
   }
   ```

> [!NOTE]
> The `vike-react-styled-components` extension requires [`vike-react`](https://vike.dev/vike-react).

<br/>

## Settings

`vike-react-styled-components` provides a configuration `+styledComponents` for customizing the [StyleSheetManager](https://styled-components.com/docs/api#stylesheetmanager).

```ts
// pages/+styledComponents.ts
export { styledComponents }

import type { IStyleSheetManager } from "styled-components"

const styledComponents = {
  styleSheetManager: {
    enableVendorPrefixes: true,
  } as Omit<IStyleSheetManager, "sheet" | "children">,
}
```

You can remove the styled-components SSR integration from [some of your pages](https://vike.dev/config#inheritance):

```js
// pages/about/+styledComponents.js

export const styledComponents = null
```

For full customization consider [ejecting](https://vike.dev/eject).

> [!NOTE]
> Consider making a [Pull Request before ejecting](https://vike.dev/eject#when-to-eject).

<br/>

## See also

- [Vike Docs > styled-components](https://vike.dev/styled-components)

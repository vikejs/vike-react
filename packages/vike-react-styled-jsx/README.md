# `vike-react-styled-jsx`

[Installation](#installation)  
[Settings](#settings)  
[Version history](https://github.com/vikejs/vike-react/blob/main/packages/vike-react-styled-jsx/CHANGELOG.md)  
[See also](#see-also)  

<br/>

Integrates [styled-jsx](https://github.com/vercel/styled-jsx) to your [`vike-react`](https://vike.dev/vike-react) app.

## Installation

1. `npm install vike-react-styled-jsx styled-jsx`
2. Extend `+config.js`:
   ```js
   // pages/+config.js

   import vikeReact from "vike-react/config"
   import vikeReactStyledJsx from "vike-react-styled-jsx/config"

   export default {
     // ...
     extends: [vikeReact, vikeReactStyledJsx]
   }
   ```

3. Add the `styled-jsx`'s Babel plugin:
   ```js
   // vite.config.js
   import react from "@vitejs/plugin-react"
   import vike from "vike/plugin"
   
   export default {
     plugins: [
      vike(),
      react({
        babel: {
          plugins: [["styled-jsx/babel"]],
        },
      }),
    ],
   };
   ```

4. You can now use styled-jsx at any of your components.
   ```jsx
   function SomeComponent() {
     return (
       <div>
        <p>Only this paragraph will get the style.</p>
        
        <style jsx>{`
          p {
            color: red;
          }
        `}</style>
       </div>
     )
   }
   ```

> [!NOTE]
> The `vike-react-styled-jsx` extension requires [`vike-react`](https://vike.dev/vike-react).

<br/>

## Settings

`vike-react-styled-jsx` provides a configuration `+styledJsx` to set the [CSP nonce for `styled-jsx`](https://github.com/vercel/styled-jsx#content-security-policy).

> [!NOTE]
> You also need to set a `<meta property="csp-nonce" content={nonce} />` tag with the same nonce.
> See [Vike Docs > head-tags](https://vike.dev/head-tags).

```ts
// pages/+styledJsx.js
export { styledJsx }

import nanoid from 'nanoid'

const styledJsx = {
  nonce: Buffer.from(nanoid()).toString('base64') //ex: N2M0MDhkN2EtMmRkYi00MTExLWFhM2YtNDhkNTc4NGJhMjA3
}
```

You can remove the styled-jsx SSR integration from [some of your pages](https://vike.dev/config#inheritance):

```js
// pages/about/+styledJsx.js

export const styledJsx = null
```

For full customization consider [ejecting](https://vike.dev/eject).

> [!NOTE]
> Consider making a [Pull Request before ejecting](https://vike.dev/eject#when-to-eject).

<br/>

## See also

- [Vike Docs > styled-jsx](https://vike.dev/styled-jsx)

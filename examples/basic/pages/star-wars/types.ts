import type { AdditionalData as VikeReactAdditionalData } from 'vike-react/types'

export type Movie = {
  id: string
  title: string
  release_date: string
}
export type MovieDetails = {
  id: string
  title: string
  release_date: string
  director: string
  producer: string
}

// A page's onBeforeRender() hook can fetch data and return it as additional
// page context. By default onBeforeRender() runs only on the server (see
// https://github.com/brillout/vite-plugin-ssr/blob/3334463/vite-plugin-ssr/node/plugin/plugins/importUserCode/v1-design/getVikeConfig/configDefinitionsBuiltIn.ts#L35 )
// however this data will also be passed to the client (see `passToClient` in
// /vike-react/renderer/+config.ts).
export type AdditionalPageContext<PageProps = {}, UserDefinedAdditionalData = {}> = {
  pageContext: {
    // Properties of the page's root React component.
    pageProps: PageProps

    // Additional data that is not passed to the page's root React component, but
    // can e.g. be used by the renderer, e.g. see
    // * /vike-react/renderer/onRenderClient.tsx
    // * /vike-react/renderer/getTitle.ts
    additionalData: VikeReactAdditionalData & UserDefinedAdditionalData
  }
}

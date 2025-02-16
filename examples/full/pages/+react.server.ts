import type { Config, PageContextServer } from 'vike/types'

export default (_pageContext: PageContextServer) =>
  ({
    renderToStringOptions: {
      identifierPrefix: 'some-id-prefix',
    },
  }) satisfies Config['react']

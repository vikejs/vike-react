export { Page }

import React from 'react'
import { Head } from 'vike-react/Head'
import logoOld from '../../assets/logo.svg'
import logoNew from '../../assets/logo-new.svg'

function Page() {
  return (
    <>
      <p>
        Page showcasing <code>{'<Image>'}</code> component, with structured data (see HTML).
      </p>
      <div>
        New logo: <Image src={logoNew} author="brillout" />
      </div>
      <br />
      <div>
        Old logo: <Image src={logoOld} author="Romuald Brillout" />
      </div>
    </>
  )
}

function Image({ src, author }: { src: string; author: string }) {
  return (
    <>
      <img src={src} height={48} style={{ verticalAlign: 'middle', marginLeft: 10 }} />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org/',
              contentUrl: { src },
              creator: {
                '@type': 'Person',
                name: author
              }
            })
          }}
        ></script>
      </Head>
    </>
  )
}

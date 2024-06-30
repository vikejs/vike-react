export { StreamedHydration }

import { ApolloClient, ApolloLink, InMemoryCache, Observable, from } from '@apollo/client/index.js'
import { uneval } from 'devalue'
import type { ReactNode } from 'react'
import { useStream } from 'react-streaming'

declare global {
  interface Window {
    _rad_?: { push: (entry: any) => void } | any[]
    _rac_?: () => void
  }
}

/**
 * This component is responsible for:
 * - dehydrating the apollo client on the server
 * - hydrating the apollo client on the client
 * - if react-streaming is not used, it doesn't do anything
 */
function StreamedHydration({ client, children }: { client: ApolloClient<any>; children: ReactNode }) {
  const stream = useStream()

  // stream is only avaiable in SSR
  const isSSR = !!stream

  if (isSSR) {
    stream.injectToStream(
      `<script class="_rad_">_rad_=[];_rac_=()=>{Array.from(
        document.getElementsByClassName("_rad_")
      ).forEach((e) => e.remove())};_rac_()</script>`
    )
    if (client.cache instanceof InMemoryCache) {
      const hydrationLink = new ApolloLink((operation, forward) => {
        return new Observable((observer) => {
          const observable = forward(operation)
          const subscription = observable.subscribe({
            next(value) {
              stream.injectToStream(
                `<script class="_rad_">_rad_.push(${uneval({
                  data: value.data,
                  variables: operation.variables,
                  query: {
                    definitions: operation.query.definitions,
                    kind: operation.query.kind,
                    ...(operation.query.loc && {
                      loc: {
                        start: operation.query.loc.start,
                        end: operation.query.loc.end,
                        ...(operation.query.loc.source && {
                          source: {
                            body: operation.query.loc.source.body,
                            name: operation.query.loc.source.name,
                            locationOffset: operation.query.loc.source.locationOffset
                          }
                        })
                      }
                    })
                  }
                })});_rac_()</script>`
              )
              observer.next(value)
            },
            error(e) {
              observer.error(e)
            },
            complete() {
              observer.complete()
            }
          })

          return () => subscription.unsubscribe()
        })
      })

      client.setLink(from([hydrationLink, client.link]))
    }
  }

  if (!isSSR && Array.isArray(window._rad_)) {
    const onEntry = (entry: any) => {
      client.cache.writeQuery(entry)
    }
    for (const entry of window._rad_) {
      onEntry(entry)
    }
    window._rad_ = { push: onEntry }
  }
  return children
}

export { useNavigate, type NavigateFn }

import { navigate } from 'vike/client/router'
import { useStream } from 'react-streaming'
import { redirect } from 'vike/abort'

type NavigateOptionsClient = Parameters<typeof navigate>[1]
type NavigateOptionsServer = { statusCode?: 301 | 302 }
type NavigateOptions = NavigateOptionsClient & NavigateOptionsServer
type NavigateFn = (url: string, options?: NavigateOptions) => Promise<void>

function useNavigate(): NavigateFn {
  // @ts-expect-error
  import.meta.env ??= { SSR: true }
  if (!import.meta.env.SSR) {
    return navigate
  }

  let stream: ReturnType<typeof useStream> | null = null
  try {
    stream = useStream()
  } catch (error) {
    // Don't throw if streaming is disabled
    // The redirect will be sent in the location header
  }
  const navigateFn: NavigateFn = (url, options) => {
    if (stream) {
      // TODO: If the headers are already sent, make sure this is flushed before aborting on the server
      // Otherwise the client will render the tree again, and navigate client-side at a later point
      stream.injectToStream(`<script>window.location.href="${url}"</script>`)
    }

    throw redirect(url, options?.statusCode)
  }

  return navigateFn
}

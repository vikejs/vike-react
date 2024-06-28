export { useNavigate }
import { useStream } from 'react-streaming'
import { redirect } from 'vike/abort'

type NavigateOptionsServer = { statusCode?: 301 | 302 | undefined }

function useNavigate() {
  const stream = useStream()
  const navigateFn = (url: string, options?: NavigateOptionsServer) => {
    if (stream) {
      //TODO: If the headers are already sent, make sure this is flushed before aborting on the server
      // Otherwise the client will render the tree again, and navigate client-side at a later point
      stream.injectToStream(`<script>window.location.href="${url}"</script>`)
    }

    throw redirect(url, options?.statusCode)
  }

  return navigateFn
}

export { useNavigate }
import { useStream } from 'react-streaming'
import { redirect } from 'vike/abort'

function useNavigate() {
  const stream = useStream()
  const navigateFn = (to: string) => {
    if (stream) {
      //TODO: If the headers are already sent, make sure this is flushed before aborting on the server
      // Otherwise the client will render the tree again, and navigate client-side at a later point
      stream.injectToStream(`<script>window.location.href="${to}"</script>`)
    }

    throw redirect(to)
  }

  return navigateFn
}

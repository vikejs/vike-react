export { Page }

import { redirect } from 'vike/abort'

function Page() {
  throw redirect('/')
}

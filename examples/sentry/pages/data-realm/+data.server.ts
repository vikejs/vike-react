export { data }

import vm from 'node:vm'

// An error from another realm: `instanceof Error` is false
function data() {
  throw vm.runInNewContext("new Error('REALM_ERR')")
}

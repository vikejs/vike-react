// https://vike.dev/data
export { data }

import { useConfig } from 'vike-react/useConfig'

function data() {
  const config = useConfig()
  // Overridden by <Image>, as useConfig() inside UI components has precedence over useConfig() inside Vike hooks
  config({ title: 'Images' })
}

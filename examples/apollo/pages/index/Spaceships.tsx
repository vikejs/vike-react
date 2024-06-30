export { Movies }

import { withFallback } from 'vike-react-apollo'
import { useSuspenseQuery, gql } from '@apollo/client/index.js'

const q = gql`
  query Dragons {
    dragons {
      name
      first_flight
      diameter {
        feet
      }
      launch_payload_mass {
        lb
      }
    }
  }
`

const q2 = gql`
  query Ships {
    ships {
      id
      model
      name
      type
      status
    }
  }
`

const Movies = withFallback(() => {
  const result = useSuspenseQuery(q)
  const result2 = useSuspenseQuery(q2)

  return 'Loaded'
}, 'Loading spaceships...')

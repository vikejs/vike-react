export { Countries }

import { gql, useSuspenseQuery } from '@apollo/client/index.js'
import React from 'react'
import { withFallback } from 'vike-react-apollo'

const Countries = withFallback(() => {
  const { data } = useSuspenseQuery<{ countries: { code: string; name: string }[] }>(gql`
    {
      countries {
        code
        name
      }
    }
  `)

  return (
    <ul>
      {data.countries.map((country) => (
        <li key={country.code}>{country.name}</li>
      ))}
    </ul>
  )
})

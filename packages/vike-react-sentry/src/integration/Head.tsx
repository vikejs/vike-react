export { Head }

import React from 'react'
import * as Sentry from '@sentry/node'

// Inject Sentry trace meta tags into the HTML head for distributed tracing
// This allows the client-side SDK to continue the trace started on the server
function Head() {
  if (!Sentry.getClient()) {
    return null
  }

  // Get trace data from Sentry
  const traceData = Sentry.getTraceData()

  // Return the meta tags as proper React elements
  // Fields may include:
  // - sentry-trace: Sentry's proprietary trace header
  // - baggage: Dynamic sampling context
  // - traceparent: W3C Trace Context header
  return (
    <>
      {traceData['sentry-trace'] && <meta name="sentry-trace" content={traceData['sentry-trace']} />}
      {traceData.baggage && <meta name="baggage" content={traceData.baggage} />}
      {traceData.traceparent && <meta name="traceparent" content={traceData.traceparent} />}
    </>
  )
}

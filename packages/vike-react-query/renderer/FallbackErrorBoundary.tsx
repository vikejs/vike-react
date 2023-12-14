import { QueryErrorResetBoundary } from '@tanstack/react-query'
import React, { CSSProperties, ReactElement } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'

export default ({ children }: { children: ReactElement }) =>
  /* TODO: either remove this or properly check whether env is DEV:
   *  - Safe check against process.env.NODE_ENV for server-side
   *  - Safe check against import.meta.env.DEV for client-side
   */
  (false as boolean) /*import.meta.env.DEV*/ ? (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={Fallback}>
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  ) : (
    children
  )

const Fallback = ({ resetErrorBoundary, error }: FallbackProps) => {
  return (
    <div style={pageStyle}>
      <div style={textStyle}>There was an error.</div>
      <button style={buttonStyle} onClick={() => resetErrorBoundary()}>
        Try again
      </button>
      {
        /* TODO: either remove this or properly check whether env is DEV:
         *  - Safe check against process.env.NODE_ENV for server-side
         *  - Safe check against import.meta.env.DEV for client-side
         */
        (false as boolean) /*import.meta.env.DEV*/ && <pre>{getErrorStack(error)}</pre>
      }
    </div>
  )
}

function getErrorStack(error: unknown) {
  if (error && error instanceof Error) {
    return error.stack
  }

  return ''
}

const pageStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#ffe1e3',
  padding: 12
}

const textStyle = {
  fontSize: 20,
  fontWeight: 500,
  color: '#f44250'
}

const buttonStyle: CSSProperties = {
  fontSize: 18,
  fontWeight: 500,
  marginTop: 16,
  outline: 0,
  border: 0,
  color: '#272727',
  boxShadow: '0px 1px 2px 0px #ffc5c5',
  backgroundColor: '#fff',
  padding: '8px 12px',
  borderRadius: 16,
  cursor: 'pointer'
}

import { QueryErrorResetBoundary } from '@tanstack/react-query'
import React, { ComponentType, ReactNode, Suspense } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'

type ErrorFallbackProps = {
  error: { message: string }
  retry: (options?: { retryQuery?: boolean } & Record<any, any>) => void
}

export function suspense<T extends object = Record<string, never>>(
  Component: ComponentType<T>,
  Fallback?: ComponentType<T> | ReactNode,
  ErrorFallback?: ComponentType<T & ErrorFallbackProps> | ReactNode
) {
  const ComponentWithSuspense = (componentProps: T) => {
    let Wrapped = (
      <Suspense fallback={typeof Fallback === 'function' ? <Fallback {...componentProps} /> : Fallback}>
        <Component {...componentProps} />
      </Suspense>
    )

    if (ErrorFallback) {
      const CurrentWrapped = Wrapped

      Wrapped = (
        <QueryErrorResetBoundary>
          {({ reset }) => {
            if (typeof ErrorFallback === 'function') {
              const CurrentErrorFallback = ErrorFallback
              //@ts-ignore
              ErrorFallback = ({ error: originalError, resetErrorBoundary, retry }: FallbackProps) => {
                if (retry) {
                  return CurrentErrorFallback
                }
                const onRetry = ({ retryQuery = true }) => {
                  if (retryQuery) {
                    reset()
                  }
                  resetErrorBoundary()
                }

                const message = getErrorMessage(originalError)
                const error = { message }
                if (typeof originalError === 'object') {
                  Object.assign(error, originalError)
                }

                //@ts-ignore
                return <CurrentErrorFallback {...componentProps} retry={onRetry} error={error} />
              }
            }

            const errorBoundaryProps =
              typeof ErrorFallback === 'function'
                ? { FallbackComponent: ErrorFallback }
                : { fallback: ErrorFallback || <></> }

            return (
              //@ts-ignore
              <ErrorBoundary {...errorBoundaryProps}>{CurrentWrapped}</ErrorBoundary>
            )
          }}
        </QueryErrorResetBoundary>
      )
    }

    return Wrapped
  }

  ComponentWithSuspense.displayName = `suspense(${Component.displayName || Component.name})`
  return ComponentWithSuspense
}

function getErrorMessage(error: unknown) {
  if (error && error instanceof Error) {
    return error.message
  }

  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'Unknown error'
}

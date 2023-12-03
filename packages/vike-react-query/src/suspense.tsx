import { QueryErrorResetBoundary } from '@tanstack/react-query'
import React, { ComponentType, ReactNode, Suspense } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'

type RetryOptions = { retryQuery?: boolean }
type RetryFn = (options?: RetryOptions) => void

type ErrorFallbackProps = {
  error: { message: string }
  retry: RetryFn
}

export function suspense<T extends object = Record<string, never>>(
  Component: ComponentType<T>,
  Fallback?: ComponentType<T> | ReactNode,
  ErrorFallback?: ComponentType<T & ErrorFallbackProps> | ReactNode
) {
  const ComponentWithSuspense = (componentProps: T) => {
    if (ErrorFallback) {
      return (
        <Suspense fallback={typeof Fallback === 'function' ? <Fallback {...componentProps} /> : Fallback}>
          <QueryErrorResetBoundary>
            {({ reset }) => {
              const createRetry =
                (resetErrorBoundary: FallbackProps['resetErrorBoundary']): RetryFn =>
                (options = {}) => {
                  const { retryQuery = true } = options
                  if (retryQuery) {
                    reset()
                  }
                  resetErrorBoundary()
                }
              const createError = (originalError: FallbackProps['error']) => {
                const message = getErrorMessage(originalError)
                const error = { message }
                if (typeof originalError === 'object') {
                  Object.assign(error, originalError)
                }
                return error
              }

              return (
                <ErrorBoundary
                  fallbackRender={({ error: originalError, resetErrorBoundary }) =>
                    typeof ErrorFallback === 'function' ? (
                      <ErrorFallback
                        {...componentProps}
                        retry={createRetry(resetErrorBoundary)}
                        error={createError(originalError)}
                      />
                    ) : (
                      ErrorFallback
                    )
                  }
                >
                  <Component {...componentProps} />
                </ErrorBoundary>
              )
            }}
          </QueryErrorResetBoundary>
        </Suspense>
      )
    }

    return (
      <Suspense fallback={typeof Fallback === 'function' ? <Fallback {...componentProps} /> : Fallback}>
        <Component {...componentProps} />
      </Suspense>
    )
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

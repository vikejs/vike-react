import { QueryErrorResetBoundary } from '@tanstack/react-query'
import React, { ComponentType, ReactNode, Suspense } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'

type RetryOptions = { retryQuery?: boolean }
type RetryFn = (options?: RetryOptions) => void

type ErrorFallbackProps = {
  error: { message: string }
  retry: RetryFn
}

type Fallback<T> = ComponentType<T> | ReactNode
type FallbackError<T> = ComponentType<T & ErrorFallbackProps> | ReactNode

type WithFallbackOptions<T> = {
  Fallback?: Fallback<T>
  FallbackError?: FallbackError<T>
}

export function withFallback<T extends object = Record<string, never>>(
  Component: ComponentType<T>,
  options?: WithFallbackOptions<T>
): ComponentType<T>
export function withFallback<T extends object = Record<string, never>>(
  Component: ComponentType<T>,
  Fallback?: Fallback<T>,
  FallbackError?: FallbackError<T>
): ComponentType<T>
export function withFallback<T extends object = Record<string, never>>(
  Component: ComponentType<T>,
  options?: Fallback<T> | WithFallbackOptions<T>,
  FallbackError_?: FallbackError<T>
): ComponentType<T> {
  let Fallback: Fallback<T>
  let FallbackError: ComponentType<T & ErrorFallbackProps> | ReactNode

  if (options && typeof options === 'object' && ('Fallback' in options || 'FallbackError' in options)) {
    Fallback = options.Fallback
    FallbackError = options.FallbackError
  } else if (options && typeof options !== 'object') {
    Fallback = options
    FallbackError = FallbackError_
  }

  const ComponentWithFallback = (componentProps: T) => {
    if (FallbackError) {
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
                    typeof FallbackError === 'function' ? (
                      <FallbackError
                        {...componentProps}
                        retry={createRetry(resetErrorBoundary)}
                        error={createError(originalError)}
                      />
                    ) : (
                      FallbackError
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

  ComponentWithFallback.displayName = `withFallback(${Component.displayName || Component.name})`
  return ComponentWithFallback
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

export { withFallback }

import { QueryErrorResetBoundary } from '@tanstack/react-query'
import React, { type ComponentProps, type ComponentType, isValidElement, type ReactNode, Suspense } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { usePageContext } from 'vike-react/usePageContext'

type RetryOptions = { retryQuery?: boolean }
type RetryFn = (options?: RetryOptions) => void

type ErrorFallbackProps = {
  error: { message: string } & Record<string, unknown>
  retry: RetryFn
}

type Loading<P> = ComponentType<P> | ReactNode | false
type Error<P> = ComponentType<P & ErrorFallbackProps> | ReactNode

type WithFallbackOptions<P> = {
  Loading?: Loading<P>
  Error?: Error<P>
}

function withFallback<T extends ComponentType<any>, P extends ComponentProps<T> = ComponentProps<T>>(
  Component: T,
  options?: WithFallbackOptions<P>
): T
function withFallback<T extends ComponentType<any>, P extends ComponentProps<T> = ComponentProps<T>>(
  Component: T,
  Loading?: Loading<P>,
  Error?: Error<P>
): T
function withFallback<T extends ComponentType<any>, P extends ComponentProps<T> = ComponentProps<T>>(
  Component: T,
  options?: Loading<P> | WithFallbackOptions<P>,
  Error_?: Error<P>
): T {
  let Loading: Loading<P>
  let Error: Error<P>

  if (options && typeof options === 'object' && ('Loading' in options || 'Error' in options)) {
    Loading = options.Loading
    Error = options.Error
  } else if (typeof options !== 'object' || isValidElement(options)) {
    Loading = options
    Error = Error_
  }

  const ComponentWithFallback = (componentProps: P) => {
    const pageContext = usePageContext()
    let element = <Component {...componentProps} />

    if (Error) {
      const originalElement = element
      element = (
        <QueryErrorResetBoundary>
          {({ reset }) => {
            return (
              <ErrorBoundary
                fallbackRender={({ error: originalError, resetErrorBoundary }) =>
                  typeof Error === 'function' ? (
                    <Error
                      {...componentProps}
                      retry={createRetry(resetErrorBoundary, reset)}
                      error={createError(originalError)}
                    />
                  ) : (
                    Error
                  )
                }
              >
                {originalElement}
              </ErrorBoundary>
            )
          }}
        </QueryErrorResetBoundary>
      )
    }

    if (Loading === undefined && pageContext.config.Loading?.component) {
      Loading = pageContext.config.Loading.component
    }
    if (Loading !== false) {
      const originalElement = element
      element = (
        <Suspense fallback={typeof Loading === 'function' ? <Loading {...componentProps} /> : Loading}>
          {originalElement}
        </Suspense>
      )
    }

    return element
  }

  ComponentWithFallback.displayName = `withFallback(${Component.displayName || Component.name || 'Component'})`
  return ComponentWithFallback as T
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

function createError(originalError: FallbackProps['error']) {
  const message = getErrorMessage(originalError)
  const error = { message }
  if (typeof originalError === 'object') {
    Object.assign(error, originalError)
    for (const key of ['name', 'stack', 'cause']) {
      if (key in originalError) {
        Object.assign(error, { [key]: originalError[key] })
      }
    }
  }
  return error
}

function createRetry(resetErrorBoundary: FallbackProps['resetErrorBoundary'], retryQueryFn: () => void): RetryFn {
  return function retry(options = {}) {
    const { retryQuery = true } = options
    if (retryQuery) {
      retryQueryFn()
    }
    resetErrorBoundary()
  }
}

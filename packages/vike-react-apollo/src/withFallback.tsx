export { withFallback }

import React, { type ComponentType, isValidElement, type ReactNode, Suspense } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { ApolloConsumer } from '@apollo/client/index.js'
import { usePageContext } from 'vike-react/usePageContext'

type RetryOptions = { retryQuery?: boolean }
type RetryFn = (options?: RetryOptions) => void

type ErrorFallbackProps = {
  error: { message: string } & Record<string, unknown>
  retry: RetryFn
}

type Loading<T> = ComponentType<T> | ReactNode | false
type Error<T> = ComponentType<T & ErrorFallbackProps> | ReactNode

type WithFallbackOptions<T> = {
  Loading?: Loading<T>
  Error?: Error<T>
}

function withFallback<T extends object = Record<string, never>>(
  Component: ComponentType<T>,
  options?: WithFallbackOptions<T>
): ComponentType<T>
function withFallback<T extends object = Record<string, never>>(
  Component: ComponentType<T>,
  Loading?: Loading<T>,
  Error?: Error<T>
): ComponentType<T>
function withFallback<T extends object = Record<string, never>>(
  Component: ComponentType<T>,
  options?: Loading<T> | WithFallbackOptions<T>,
  Error_?: Error<T>
): ComponentType<T> {
  let Loading: Loading<T>
  let Error: Error<T>

  if (options && typeof options === 'object' && ('Loading' in options || 'Error' in options)) {
    Loading = options.Loading
    Error = options.Error
  } else if (typeof options !== 'object' || isValidElement(options)) {
    Loading = options
    Error = Error_
  }

  const ComponentWithFallback = (componentProps: T) => {
    const pageContext = usePageContext()

    let element = <Component {...componentProps} />

    if (Error) {
      const originalElement = element
      element = (
        <ApolloConsumer>
          {({ reFetchObservableQueries }) => {
            const createRetry =
              (resetErrorBoundary: FallbackProps['resetErrorBoundary']): RetryFn =>
              (options = {}) => {
                const { retryQuery = true } = options
                if (retryQuery) {
                  reFetchObservableQueries()
                }
                resetErrorBoundary()
              }
            const createError = (originalError: FallbackProps['error']) => {
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

            return (
              <ErrorBoundary
                fallbackRender={({ error: originalError, resetErrorBoundary }) =>
                  typeof Error === 'function' ? (
                    <Error
                      {...componentProps}
                      retry={createRetry(resetErrorBoundary)}
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
        </ApolloConsumer>
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

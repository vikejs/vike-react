import { cleanup, render, waitFor } from '@testing-library/react'
import React, { ReactNode, useEffect } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { withFallback } from './withFallback.js'
import { QueryClient, QueryClientProvider, useSuspenseQuery } from '@tanstack/react-query'

const Component = withFallback(
  ({ count, onMount }: { count?: number; onMount?: () => void }) => {
    useEffect(() => {
      onMount?.()
    }, [])

    return count
  },
  ({ count }) => `loading${count}`,
  ({ count }) => `error${count}`,
)

const ComponentThatSuspends = withFallback(
  ({ count, onMount }: { count?: number; onMount?: () => void; onFallbackMount?: () => void }) => {
    useSuspenseQuery({
      queryFn: () => new Promise((r) => setTimeout(() => r('some value'), 50)),
      queryKey: ['ComponentThatSuspends'],
    })

    useEffect(() => {
      onMount?.()
    }, [])

    return count
  },
  ({ count, onFallbackMount }) => {
    useEffect(() => {
      onFallbackMount?.()
    }, [])
    return `loading${count}`
  },
  ({ count }) => `error${count}`,
)

const ComponentThatSuspends2 = withFallback(
  ({ count, onMount }: { count?: number; onMount?: () => void }) => {
    useSuspenseQuery({
      queryFn: () => new Promise((r) => setTimeout(() => r('some value'), 50)),
      queryKey: ['ComponentThatSuspends2'],
    })

    useEffect(() => {
      onMount?.()
    }, [])

    return count
  },
  <div>loading ComponentThatSuspends2</div>,
  <div>error ComponentThatSuspends2</div>,
)

const ComponentThatThrows = withFallback(
  ({ count, onMount }: { count?: number; onMount?: () => void; onErrorFallbackMount?: () => void }) => {
    useEffect(() => {
      onMount?.()
    }, [])
    throw new Error('some message')
  },
  {
    Loading: ({ count }) => `loading${count}`,
    Error: ({ count, error, onErrorFallbackMount }) => {
      useEffect(() => {
        onErrorFallbackMount?.()
      }, [])
      return `error${error.message}${count}`
    },
  },
)

const ComponentThatThrows2 = withFallback(
  ({ count, onMount }: { count?: number; onMount?: () => void; onErrorFallbackMount?: () => void }) => {
    useEffect(() => {
      onMount?.()
    }, [])
    throw new Error('some message')
  },
  ({ count }) => `loading${count}`,
  `error fallback string`,
)

const OuterComponent = withFallback(
  ({ children }: { children: ReactNode }) => {
    return children
  },
  () => `outer loading`,
  () => `outer error`,
)

describe('suspense', () => {
  afterEach(() => {
    cleanup()
  })

  it('works', () => {
    const onMount = vi.fn()
    const { container } = render(<Component count={123} onMount={onMount} />)
    expect(container.innerHTML).toBe('123')
    expect(onMount).toBeCalledTimes(1)
  })

  it("doesn't remount on props update", () => {
    const onMount = vi.fn()
    let result = render(<Component count={123} onMount={onMount} />)
    expect(result.container.innerHTML).toBe('123')
    expect(onMount).toBeCalledTimes(1)

    result = render(<Component count={321} onMount={onMount} />, { container: result.container })
    expect(result.container.innerHTML).toBe('321')
    expect(onMount).toBeCalledTimes(1)
  })

  it('shows loading fallback', async () => {
    const queryClient = new QueryClient()
    const onMount = vi.fn()
    let result = render(
      <QueryClientProvider client={queryClient}>
        <ComponentThatSuspends count={123} onMount={onMount} />
      </QueryClientProvider>,
    )
    expect(result.container.innerHTML).toBe(`loading${123}`)
    await waitFor(() => expect(onMount).toBeCalledTimes(1))
    expect(result.container.innerHTML).toBe('123')
  })

  it('shows loading fallback element', async () => {
    const queryClient = new QueryClient()
    const onMount = vi.fn()
    let result = render(
      <QueryClientProvider client={queryClient}>
        <ComponentThatSuspends2 count={123} onMount={onMount} />
      </QueryClientProvider>,
    )
    expect(result.container.innerHTML).toBe('<div>loading ComponentThatSuspends2</div>')
    await waitFor(() => expect(onMount).toBeCalledTimes(1))
    expect(result.container.innerHTML).toBe('123')
  })

  it('updates props inside the fallback, without remounting the fallback component', async () => {
    const queryClient = new QueryClient()
    const onMount = vi.fn()
    const onFallbackMount = vi.fn()
    let result = render(
      <QueryClientProvider client={queryClient}>
        <ComponentThatSuspends count={123} onMount={onMount} onFallbackMount={onFallbackMount} />
      </QueryClientProvider>,
    )
    expect(result.container.innerHTML).toBe(`loading${123}`)
    expect(onFallbackMount).toBeCalledTimes(1)
    result = render(
      <QueryClientProvider client={queryClient}>
        <ComponentThatSuspends count={456} onMount={onMount} onFallbackMount={onFallbackMount} />
      </QueryClientProvider>,
      {
        container: result.container,
      },
    )
    expect(result.container.innerHTML).toBe(`loading${456}`)
    expect(onFallbackMount).toBeCalledTimes(1)

    await waitFor(() => expect(onMount).toBeCalledTimes(1))
    expect(result.container.innerHTML).toBe('456')
  })

  it('shows error fallback component', () => {
    const onMount = vi.fn()
    let result = render(<ComponentThatThrows count={456} onMount={onMount} />)
    expect(result.container.innerHTML).toBe(`errorsome message${456}`)
    expect(onMount).toBeCalledTimes(0)
  })

  it('shows error fallback string', () => {
    const onMount = vi.fn()
    let result = render(<ComponentThatThrows2 count={456} onMount={onMount} />)
    expect(result.container.innerHTML).toBe(`error fallback string`)
    expect(onMount).toBeCalledTimes(0)
  })

  it('traps the error inside the inner error boundary', () => {
    const onMount = vi.fn()
    const result = render(
      <OuterComponent>
        <ComponentThatThrows count={12345} onMount={onMount} />
      </OuterComponent>,
    )
    expect(result.container.innerHTML).toBe(`errorsome message${12345}`)
    expect(onMount).toBeCalledTimes(0)
  })

  it('updates props inside the error fallback, without remounting the fallback component', () => {
    const onMount = vi.fn()
    const onErrorFallbackMount = vi.fn()
    let result = render(
      <ComponentThatThrows count={456} onMount={onMount} onErrorFallbackMount={onErrorFallbackMount} />,
    )
    expect(result.container.innerHTML).toBe(`errorsome message${456}`)
    expect(onMount).toBeCalledTimes(0)
    expect(onErrorFallbackMount).toBeCalledTimes(1)

    result = render(<ComponentThatThrows count={321} onMount={onMount} onErrorFallbackMount={onErrorFallbackMount} />, {
      container: result.container,
    })
    expect(result.container.innerHTML).toBe(`errorsome message${321}`)
    expect(onMount).toBeCalledTimes(0)
    expect(onErrorFallbackMount).toBeCalledTimes(1)
  })
})

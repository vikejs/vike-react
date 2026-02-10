const capturedError = Symbol.for('vike-react-sentry-captured-error')

export const markErrorAsCaptured = (error: unknown): void => {
  if (typeof error === 'object' && error !== null) {
    ;(error as any)[capturedError] = true
  }
}

export const isErrorCaptured = (error: unknown): boolean => {
  return typeof error === 'object' && error !== null && Boolean((error as any)[capturedError])
}

const seenError = Symbol.for('vike-react-sentry-seen-error')

export const markErrorAsSeen = (error: unknown): void => {
  if (typeof error === 'object' && error !== null) {
    ;(error as any)[seenError] = true
  }
}

export const isErrorSeen = (error: unknown): boolean => {
  return typeof error === 'object' && error !== null && Boolean((error as any)[seenError])
}

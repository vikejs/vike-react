const seenError = Symbol.for('vike-react-sentry-seen-error')

export const markErrorAsSeen = (error: unknown): void => {
  if (typeof error === 'object' && error !== null) {
    ;(error as any)[seenError] = true
  }
}

export const isErrorSeen = (error: unknown): boolean => {
  return typeof error === 'object' && error !== null && Boolean((error as any)[seenError])
}

// Track recent errors for adaptive sampling
let lastErrorTimestamp: number | null = null
const RECENT_ERROR_WINDOW = 5 * 60 * 1000 // 5 minutes

export const hasRecentErrors = (): boolean => {
  return lastErrorTimestamp !== null && Date.now() - lastErrorTimestamp < RECENT_ERROR_WINDOW
}

export const recordError = (): void => {
  lastErrorTimestamp = Date.now()
}

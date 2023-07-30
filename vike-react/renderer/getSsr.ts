export { getSsr }

function getSsr(pageContext: {
  config: Record<string, unknown>
}): boolean {
  const defaultValue = true
  if (pageContext.config.ssr === undefined || pageContext.config.ssr === null) {
    return defaultValue;
  }
  if (typeof pageContext.config.ssr !== 'boolean') {
    throw new Error('pageContext.config.ssr should be a boolean')
  }
  return pageContext.config.ssr
}

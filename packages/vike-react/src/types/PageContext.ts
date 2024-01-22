// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      Page?: () => React.ReactNode
      userAgent?: string
    }
  }
}

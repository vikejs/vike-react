import { AppStore, RootState } from './pages/+redux'

declare global {
  namespace Vike {
    interface PageContext {
      reduxState?: RootState
      reduxStore?: AppStore
    }
  }
}

export {}

import { AppStore, RootState } from './pages/+redux'

declare global {
  namespace Vike {
    interface PageContext {
      reduxStore?: AppStore
      reduxState?: RootState
    }
  }
}

export {}

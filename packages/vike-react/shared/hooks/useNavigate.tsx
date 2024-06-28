export { useNavigate, type NavigateFn }
import { navigate } from 'vike/client/router'

type NavigateOptionsClient = Parameters<typeof navigate>[1]
type NavigateOptionsServer = { statusCode?: 301 | 302 | undefined }
type NavigateOptions = NavigateOptionsClient & NavigateOptionsServer
type NavigateFn = (url: string, options?: NavigateOptions) => void

declare function useNavigate(): NavigateFn

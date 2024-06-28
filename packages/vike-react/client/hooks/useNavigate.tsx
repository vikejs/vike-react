export { useNavigate }
import { navigate } from 'vike/client/router'
import type { NavigateFn } from '../../shared/hooks/useNavigate.js'

function useNavigate() {
  return navigate as NavigateFn
}

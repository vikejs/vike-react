import { useData } from 'vike-react/useData'
import type { Data } from './+data'

export default () => {
  const movies = useData<Data>()
  const title = `${movies.length} Star Wars Movies`
  return title
}

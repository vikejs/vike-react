export { data }

function data() {
  const error = new Error('NAMED_ERR')
  // A custom error name, with defineProperty()'s defaults: not configurable
  Object.defineProperty(error, 'name', { value: 'ServiceError' })
  throw error
}

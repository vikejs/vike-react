// https://vike.dev/data
export { data }

// Vike can't pass a function to the client: it warns on the server, and pageContext.data throws on the client
function data() {
  return { getMessage: () => 'Only on the server' }
}

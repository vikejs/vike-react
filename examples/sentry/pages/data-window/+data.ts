export { data }

// An error Vike adds a hint to
function data() {
  return (window as any).location.href
}

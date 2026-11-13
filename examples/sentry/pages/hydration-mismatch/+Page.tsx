export { Page }

function Page() {
  return <p>{typeof window === 'undefined' ? 'Server text' : 'Client text'}</p>
}

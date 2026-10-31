export { Page }

function Page() {
  return (
    <>
      <h1>Links</h1>
      {Array.from({ length: 10 }, (_, i) => (
        <p key={i} style={{ height: '50vh' }}>
          <a href={`/item/${i}`}>Item {i}</a>
        </p>
      ))}
    </>
  )
}

export default {
  tolerateError,
}

function tolerateError({ logText }) {
  return [
    // Error: clientOnly() is deprecated — use <ClientOnly> https://vike.dev/ClientOnly
    'clientOnly() is deprecated',
  ].some((txt) => logText.includes(txt))
}

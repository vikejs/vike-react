export default {
  tolerateError,
}

function tolerateError({ logText }) {
  return [
    // [19:28:26.222][/][pnpm run dev][stderr] [react-streaming@0.4.1][Warning] react-streaming@0.3.49 and react-streaming@0.4.1 loaded which is highly discouraged, see https://vike.dev/warning/version-mismatch
    'react-streaming@0.3.49 and react-streaming@0.4.2 loaded which is highly discouraged',
    // Warning:  "Error: [vike][Warning] Client runtime loaded twice https://vike.dev/client-runtime-duplicated\n    at cE (http://localhost:3000/assets/chunks/chunk-UP18WAHF.js:41:36296)\n    at aE (http://localhost:3000/assets/chunks/chunk-UP18WAHF.js:41:35965)\n    at lE (http://localhost:3000/assets/chunks/chunk-UP18WAHF.js:41:36058)\n    at http://localhost:3000/assets/chunks/chunk-UP18WAHF.js:41:36442",
    'Client runtime loaded twice',
  ].some((txt) => logText.includes(txt))
}

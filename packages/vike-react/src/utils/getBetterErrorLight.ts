export { getBetterErrorLight }

// Same as getBetterError() with less features (thus less KBs) for the client-side

// Copies:
// - https://github.com/vikejs/vike/blob/a54b7618d80409c6df4b597489ddbb7739f3e86f/packages/vike/utils/getBetterError.ts
// - https://github.com/brillout/react-streaming/blob/b8565c1257c63a665bda31b9be42112e458859d1/src/utils/getBetterError.ts

function getBetterErrorLight(err: Record<string, unknown>, modifications: { stack?: string }) {
  const errBetter = structuredClone(err)
  Object.assign(errBetter, modifications)
  // Enable users to retrieve the original error
  Object.assign(errBetter, { getOriginalError: () => (err as any)?.getOriginalError?.() ?? err })
  return errBetter
}

export { getBetterErrorLight }

// Same as getBetterError() with less features (thus less KBs) for the client-side
// https://github.com/vikejs/vike/blob/a54b7618d80409c6df4b597489ddbb7739f3e86f/packages/vike/utils/getBetterError.ts#L1

function getBetterErrorLight(err: Record<string, unknown>, modifications: { stack?: string }) {
  const errBetter = structuredClone(err)
  Object.assign(errBetter, modifications)
  // Enable users to retrieve the original error
  Object.assign(errBetter, { getOriginalError: () => (err as any)?.getOriginalError?.() ?? err })
  return errBetter
}

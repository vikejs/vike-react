export { getBetterErrorLight }

// Same as getBetterError() but with less features (thus less KBs) for the client-side

// Copies:
// - https://github.com/vikejs/vike/blob/a54b7618d80409c6df4b597489ddbb7739f3e86f/packages/vike/utils/getBetterError.ts
// - https://github.com/brillout/react-streaming/blob/b8565c1257c63a665bda31b9be42112e458859d1/src/utils/getBetterError.ts

function getBetterErrorLight(err: Record<string, unknown>, modifications: { stack?: string }) {
  // We don't clone/preserve the original error, because it would slightly increase client-side KBs.
  // https://github.com/vikejs/vike/blob/cbfb27fb0d061c8258f4b147e91cc6e97a2183b7/packages/vike/utils/shallowClone.ts#L6
  Object.assign(err, modifications)
  /* Doesn't make sense since we don't clone the original error, see comment above.
  Object.assign(err, { getOriginalError: () => (err as any)?.getOriginalError?.() ?? errOriginal })
  */
  return err
}

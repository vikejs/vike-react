// This is work-in-progress, see:
// - https://github.com/brillout/playground_eject-vike-react
// - https://github.com/snake-py/eject/issues/4#issuecomment-2506217514
export const config = {
  files: 'src/*',
  operations: [
    'mv src/* .',
    'mv integration renderer',
    'mv config.ts renderer/+config.ts',
    'mv renderer/onRenderHtml.tsx renderer/+onRenderHtml.tsx',
    'mv renderer/onRenderClient.tsx renderer/+onRenderClient.tsx',
    'mv renderer/Loading.tsx renderer/+Loading.tsx',
    'rm index.ts',
  ],
}

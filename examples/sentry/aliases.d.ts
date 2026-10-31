// The alias is defined only in vite.config.ts (resolve.alias), not in tsconfig.json
declare module '#sentry-env' {
  export const release: string
}

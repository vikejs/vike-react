<!-- WARNING: keep links absolute in this file so they work on NPM too -->

[![npm version](https://img.shields.io/npm/v/vike-react-sentry)](https://www.npmjs.com/package/vike-react-sentry)

# `vike-react-sentry`

Add [Sentry](https://sentry.io) error tracking and performance monitoring to your [`vike-react`](https://vike.dev/vike-react) app.

Features:
- Browser and server error tracking, including React render errors
- Performance monitoring and tracing
- Automatic source map upload
- Works out of the box with minimal configuration

<br/>

**Table of Contents**

[Installation](#installation)  
[Example](#example)  
[Settings](#settings)  
[Migration from 0.1](#migration-from-01)  
[Version history](#version-history)  
[See also](#see-also)  

<br/>

## Installation

1. `npm install vike-react-sentry @sentry/react @sentry/node @sentry/vite-plugin`
2. Extend `+config.js`:
   ```js
   // pages/+config.js

   import vikeReact from 'vike-react/config'
   import vikeReactSentry from 'vike-react-sentry/config'

   export default {
     // ...
     extends: [vikeReact, vikeReactSentry]
   }
   ```
3. Add environment variables to your `.env` file:
   ```bash
   # Your Sentry DSN (can be public and exposed to the browser)
   PUBLIC_ENV__SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx

   # Required for source map upload: Sentry Auth Token (must be kept private)
   # Create at https://sentry.io/settings/account/api/auth-tokens/
   # Required scopes: project:read, project:releases, project:write
   SENTRY_AUTH_TOKEN=sntryu_xxxxx
   ```

> [!NOTE]
> The `vike-react-sentry` extension requires [`vike-react`](https://vike.dev/vike-react), `vike` `>=0.4.253`, and the Sentry SDK version 10 or 11 (`@sentry/vite-plugin` 4 to 11).

That's it! With the configuration above, `vike-react-sentry` will automatically:
- Initialize Sentry on both client and server
- Track errors thrown by Vike hooks and React components, on both client and server
- Instrument Vike hooks using [`+onHookCall()`](https://vike.dev/onHookCall)
- Enable browser tracing for performance monitoring
- Upload source maps during production builds (when `SENTRY_AUTH_TOKEN` is set)

Without a DSN, Sentry is disabled: nothing is sent and no trace tags are added to the HTML.

<br/>

## Example

See [examples/sentry](https://github.com/vikejs/vike-react/tree/main/examples/sentry).

<br/>

## Settings

### `+sentry`

Sentry SDK configuration options: [`@sentry/react` options](https://docs.sentry.io/platforms/javascript/guides/react/configuration/options/) on the client-side and [`@sentry/node` options](https://docs.sentry.io/platforms/javascript/guides/node/configuration/options/) on the server-side.

```js
// pages/+sentry.js
// Environment: client, server

export default {
  tracesSampleRate: 1.0,
  debug: true
}
```

> [!NOTE]
> See also: [Vike > Config Files](https://vike.dev/config)

Defaults set by `vike-react-sentry`:

```js
{
  dsn: import.meta.env.PUBLIC_ENV__SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.2,
  // Client-side only
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
}
```

On the server-side, `@sentry/node` also reads the `SENTRY_DSN` environment variable if `dsn` is missing. It reads it from the server's environment when the server starts, so in production set it in that environment: a `.env` file is loaded by `vike dev` and `vike build`, not by your production server.

You can export a function, which receives [`globalContext`](https://vike.dev/globalContext):

```js
// pages/+sentry.js
// Environment: client, server

export default (globalContext) => {
  return {
    tracesSampleRate: 1.0,
    initialScope: {
      tags: { side: globalContext.isClientSide ? 'client' : 'server' }
    }
  }
}
```

> [!NOTE]
> See also: [Vike > `globalContext`](https://vike.dev/globalContext)

You can define settings only for the client- or server-side:

```js
// pages/+sentry.client.js
// Environment: client

import * as Sentry from '@sentry/react'

export default {
  integrations: [
    // Added to the default integrations (the SDK's ones, browserTracingIntegration() and replayIntegration())
    Sentry.httpClientIntegration()
  ]
}
```

```js
// pages/+sentry.server.js
// Environment: server

export default {
  integrations: [
    // Added to the default integrations of @sentry/node
  ]
}
```

To remove a default integration, use the function form of `integrations`:

```js
// pages/+sentry.client.js
// Environment: client

export default {
  integrations: (integrations) => integrations.filter((integration) => integration.name !== 'Replay')
}
```

> [!NOTE]
> See also: [Vike > File Environment (`.server.js`, `.client.js`, ...)](https://vike.dev/file-env)

`+sentry` is applied once: after changing it, reload the page (client-side) or restart the development server (server-side).

`vike-react-sentry` initializes the server-side SDK when Vike creates the global context. If you initialize Sentry yourself before that (for example in an [instrument file preloaded with `node --import`](https://docs.sentry.io/platforms/javascript/guides/node/install/esm/)), then `vike-react-sentry` uses your initialization and doesn't apply `+sentry` on the server-side.

### `+sentryVite`

Sentry Vite plugin configuration for source map upload.

It's automatically configured when `SENTRY_AUTH_TOKEN` is set via `.env`, but can be customized:

```bash
# .env
SENTRY_AUTH_TOKEN=sntryu_xxxxx  # Required for source map upload
SENTRY_ORG=your-org             # Optional, auto-detected from PUBLIC_ENV__SENTRY_DSN
SENTRY_PROJECT=your-project     # Optional, auto-detected from PUBLIC_ENV__SENTRY_DSN
```

You can also override options in `+config.js`:

```js
// pages/+config.js

export default {
  sentryVite: {
    org: 'your-org',
    project: 'your-project',
    // ... other @sentry/vite-plugin options
  }
}
```

> [!NOTE]
> When using a **personal auth token** with `SENTRY_AUTH_TOKEN`, `org` and `project` are automatically detected from `PUBLIC_ENV__SENTRY_DSN` using the Sentry API. Organization-scoped tokens don't support the required API permissions, so you'll need to set `SENTRY_PROJECT` manually if using those.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `PUBLIC_ENV__SENTRY_DSN` | Your Sentry DSN. Public and safe for browser. |
| `SENTRY_DSN` | DSN used on the server-side only, if `PUBLIC_ENV__SENTRY_DSN` isn't set. Read from the server's environment when the server starts: in production, set it there, not only in `.env`. |
| `SENTRY_AUTH_TOKEN` | Auth token for source map upload. Create at [Sentry Auth Tokens](https://sentry.io/settings/account/api/auth-tokens/). Required scopes: `project:read`, `project:releases`, `project:write`. |
| `SENTRY_ORG` | Organization slug (optional, auto-detected from `PUBLIC_ENV__SENTRY_DSN`). |
| `SENTRY_PROJECT` | Project slug (optional, auto-detected from `PUBLIC_ENV__SENTRY_DSN`). |
| `SENTRY_URL` | Custom Sentry URL for source map upload and auto-detection. Only needed for self-hosted instances. |
| `SENTRY_RELEASE` | Release name of the uploaded source maps (optional, detected from Git by default). |

<br/>

## Migration from 0.1

- `+sentry` is no longer loaded at build-time, so its `release` no longer names the source map upload, and its `dsn` no longer drives the `org`/`project` auto-detection. Set the upload release with `SENTRY_RELEASE` or `+sentryVite: { release: { name } }`. Stack traces are matched by debug ID either way. For auto-detection, put the DSN in `PUBLIC_ENV__SENTRY_DSN`, or set `SENTRY_ORG` and `SENTRY_PROJECT`.
- A `+sentry` function now receives `globalContext`. Use it instead of `await getGlobalContext()`, which hangs there.
- `integrations` set in `+sentry` are now added to the default integrations instead of replacing them. To drop a default integration, use the function form: `integrations: (integrations) => integrations.filter((integration) => integration.name !== 'Replay')`.
- Tracing is now enabled by default at `tracesSampleRate: 0.2`, as documented: a typo kept it disabled. To keep tracing disabled, set `tracesSampleRate: undefined` in `+sentry.js`.
- Errors thrown by server hooks are now sent once, by [`+onError()`](https://vike.dev/onError), with `mechanism.type: 'auto.function.vike'` and `handled: false`. `throw redirect()`, `throw render()` and `throw abort()` are no longer sent. Update alert rules that match the previous events.

<br/>

## Version history

See [CHANGELOG.md](https://github.com/vikejs/vike-react/blob/main/packages/vike-react-sentry/CHANGELOG.md).

<br/>

## See also

- [Sentry Documentation](https://docs.sentry.io/)
- [Sentry React SDK](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Sentry Node SDK](https://docs.sentry.io/platforms/javascript/guides/node/)
- [Vike > Error Tracking](https://vike.dev/error-tracking)
- [Vike > `+onError()` hook](https://vike.dev/onError)
- [Vike > `+onHookCall()` hook](https://vike.dev/onHookCall)

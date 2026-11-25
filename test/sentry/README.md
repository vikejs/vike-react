# `vike-react-sentry` tests

End-to-end tests of [`vike-react-sentry`](../../packages/vike-react-sentry): redirects, aborted requests, prefetching, render errors, DSN settings. The app sends to a local stand-in for Sentry's ingest endpoint (`.ingest.ts`), not to sentry.io.

For an example of using `vike-react-sentry`, see [`examples/sentry`](../../examples/sentry).

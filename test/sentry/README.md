# `vike-react-sentry` tests

End-to-end tests of [`vike-react-sentry`](../../packages/vike-react-sentry): redirects, prefetching, render errors, DSN settings. The tests write a `.env` that points the app at a local stand-in for Sentry's ingest endpoint (`.ingest.ts`).

For an example of using `vike-react-sentry`, see [`examples/sentry`](../../examples/sentry).

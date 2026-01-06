# Feature Request: Cumulative hook wrapper for instrumentation (Sentry, OpenTelemetry, etc.)

## Problem

When integrating observability tools like Sentry or OpenTelemetry with Vike, we need to wrap hook executions with spans/traces. This is essential for:

- Measuring execution time of `+data`, `+guard`, `+onBeforeRender`, `+onRenderHtml`, etc.
- Providing users insight into which hooks are slow
- Proper distributed tracing

### The Challenge

Sentry (and OpenTelemetry) spans work with **async local storage** and depend on the **call stack**. This means we need to actually **wrap** the hook function execution:

```ts
Sentry.startSpan(
  {
    name: "pages/product/+data",
    op: "vike.hook",
    attributes: { hookName: "data", pageId, urlOriginal },
  },
  async () => {
    // The actual +data hook runs here
    return await dataHook(pageContext)
  },
);
```

We cannot use before/after style hooks because the span context is lost.

## Proposed Solution

Add a **cumulative global hook wrapper** to vike:

```ts
// vike-react-sentry/+config.ts
import * as Sentry from "@sentry/node"

export default {
  onWrapHook: (hookInfo, execHook) => {
    return Sentry.startSpan(
      {
        name: hookInfo.hookFilePath, // e.g. "pages/product/+data"
        op: "vike.hook",
        attributes: {
          "vike.hookName": hookInfo.hookName,
          "vike.pageId": hookInfo.pageId,
        },
      },
      () => execHook()
    )
  },
  meta: {
    onWrapHook: {
      env: { server: true, client: true },
      cumulative: true,  // Multiple wrappers compose
    }
  }
}
```

### Hook Info

The `hookInfo` parameter should include:
- `hookName`: e.g. `"data"`, `"guard"`, `"onRenderHtml"`, `"onBeforeRender"`
- `hookFilePath`: e.g. `"pages/product/+data"`, `"vike-react/__internal/integration/onRenderHtml"`
- `pageContext`: (or relevant subset like `pageId`, `urlOriginal`, `urlPathname`)

### Cumulative Behavior

Multiple wrappers should compose, allowing:
- `vike-react-sentry` to add Sentry spans
- User to add custom logging/timing
- Other extensions to add their instrumentation

```ts
// All these wrappers compose
onWrapHook: [sentryWrapper, otelWrapper, loggingWrapper]
```

### Implementation Location

Vike controls all `+` file exports. When these are loaded and made available via `pageContext.config` or `pageContext.exports`, vike could wrap all callable exports with the wrapper.

This would cover:
- **Built-in hooks**: `+data`, `+guard`, `+onBeforeRender`, `+onRenderHtml`, etc. (currently in `execHookDirectAsync`)
- **Custom config functions**: `+ApolloClient`, `+QueryClient`, or any user-defined `+` file that exports a function

When a function is exported from a `+` file and later called (either by vike internally or by extensions via `pageContext.config.X()`), the wrapper would be applied.

## Use Cases

1. **Sentry Integration** (`vike-react-sentry`): Wrap all hooks with Sentry spans
2. **OpenTelemetry**: Distributed tracing with OTEL spans
3. **Custom Logging**: Log hook execution times
4. **Performance Monitoring**: Track slow hooks
5. **Debugging**: Add context around hook execution

## Expected Result

With this feature, `vike-react-sentry` could provide traces like:

```
vike:request (150ms)
├── +guard (5ms)
├── +data (80ms)
│   └── db.query (75ms)
├── +onBeforeRender (10ms)
└── +onRenderHtml (55ms)
    └── react:render (50ms)
```

This gives users great insight into their app's performance and helps identify bottlenecks.

## Related

- vike-react-sentry: https://github.com/vikejs/vike-react/tree/main/packages/vike-react-sentry

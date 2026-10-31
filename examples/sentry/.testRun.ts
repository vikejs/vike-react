export { testRun }
export { testRunWithoutDsn }
export { testRunWithFactoryDsn }
export { testRunWithServerDsn }

import { test, expect, run, fetchHtml, page, getServerUrl, autoRetry, sleep } from '@brillout/test-e2e'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { startIngest } from './.ingest'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ingest = await startIngest()

function setupEnv(content: string) {
  fs.writeFileSync(path.join(__dirname, '.env'), content)
}

function testRun(cmd: 'pnpm run dev' | 'pnpm run prod') {
  const isProd = cmd !== 'pnpm run dev'
  // SENTRY_DSN is read by @sentry/node: it must not break the build
  setupEnv(`PUBLIC_ENV__SENTRY_DSN=${ingest.dsn}\nSENTRY_DSN=${ingest.dsn}\n`)
  run(cmd, {
    serverIsReadyMessage: isProd ? 'Listening on' : undefined,
    // We intentionally throw errors to test Sentry error reporting
    tolerateError: ({ logText }) =>
      logText.includes('This is a test error sent to Sentry!') ||
      logText.includes('This is an async error sent to Sentry!') ||
      logText.includes('This is a render error sent to Sentry!') ||
      logText.includes('DATA_ERR') ||
      logText.includes('DATA_STRING') ||
      logText.includes('ROUTE_ERR') ||
      logText.includes('BOUNDARY_CAUGHT') ||
      logText.includes('Hydration failed') ||
      logText.includes('Minified React error #418') ||
      // Vike's logs about the DATA_STRING value
      logText.includes('The thrown value is') ||
      // The test's font request of a non-font file
      logText.includes('Failed to decode downloaded font: ' + getServerUrl() + '/sentry-env.ts?font') ||
      logText.includes('OTS parsing error'),
  })

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Vike + React + Sentry Example</h1>')
  })

  test('tracing is enabled by default', async () => {
    const html = await fetchHtml('/')
    expect(html).toMatch(/<meta name="baggage" content="[^"]*sentry-sample_rate=0\.2/)
  })

  // Must be the first page load: with a cold cache, Vite reloads the page when it finds a dependency late
  test('first page load is not reloaded', async () => {
    let loads = 0
    const onLoad = () => loads++
    page.on('load', onLoad)
    await gotoHydrated('/')
    await sleep(3000)
    page.off('load', onLoad)
    expect(loads).toBe(1)
  })

  test('page is rendered to the DOM and interactive', async () => {
    await page.goto(getServerUrl() + '/')
    expect(await page.textContent('h1')).toBe('Vike + React + Sentry Example')
    await testCounter()
  })

  test('redirect() is not sent to Sentry', async () => {
    const response = await fetch(getServerUrl() + '/guarded', { redirect: 'manual' })
    expect(response.status).toBe(302)
    await gotoHydrated('/')
    await page.evaluate(() => {
      const link = document.createElement('a')
      link.href = '/guarded'
      link.textContent = 'Guarded'
      document.body.append(link)
    })
    await page.locator('a', { hasText: 'Guarded' }).click()
    await page.waitForURL(getServerUrl() + '/')
    await sleep(2000)
    expect(getErrorEvents('AbortRender').length).toBe(0)
  })

  test('no hook transactions for prefetched links', async () => {
    const getClientSegments = () => ingest.spans.filter((span) => span.side === 'client' && span.isSegment)
    const { headers, traceId } = getSampledTraceHeaders()
    await page.setExtraHTTPHeaders(headers)
    await gotoHydrated('/links')
    await page.setExtraHTTPHeaders({})
    await autoRetry(
      async () => {
        expect(getClientSegments().some((span) => span.traceId === traceId && span.op === 'pageload')).toBe(true)
      },
      { timeout: 10 * 1000 },
    )
    const segmentsBefore = getClientSegments().length
    const getHookSegments = () => ingest.spans.filter((span) => span.isSegment && span.op === 'vike.hook')
    const hookSegmentsBefore = getHookSegments().length
    for (let i = 0; i < 3; i++) {
      for (const deltaY of [3000, -3000]) {
        await page.mouse.wheel(0, deltaY)
        await sleep(300)
      }
    }
    await sleep(2000)
    expect(getClientSegments().length).toBe(segmentsBefore)
    expect(getHookSegments().length).toBe(hookSegmentsBefore)
  })

  test('client hook upon client-side navigation has a span', async () => {
    const { headers, traceId } = getSampledTraceHeaders()
    await page.setExtraHTTPHeaders(headers)
    await gotoHydrated('/links')
    await page.setExtraHTTPHeaders({})
    // Lets the pageload span end
    await sleep(2000)
    await page.locator('a', { hasText: 'Navigation target' }).click()
    await page.waitForURL(getServerUrl() + '/navigation-target')
    await autoRetry(
      async () => {
        const spans = ingest.spans.filter((span) => span.side === 'client' && span.traceId === traceId)
        expect(spans.some((span) => span.op === 'vike.hook' && span.name === 'onBeforeRender')).toBe(true)
      },
      { timeout: 10 * 1000 },
    )
  })

  test('one server transaction per page load', async () => {
    const { headers, traceId } = getSampledTraceHeaders()
    await page.setExtraHTTPHeaders(headers)
    // Loads the page's modules and its <img>
    await gotoHydrated('/')
    if (!isProd) {
      // Subresources whose path isn't in @sentry/node's list of static asset extensions
      await page.evaluate(async () => {
        new Worker('/sentry-env.ts', { type: 'module' })
        await new FontFace('Font', 'url(/sentry-env.ts?font)').load().catch(() => {})
      })
      await sleep(1000)
    }
    await page.setExtraHTTPHeaders({})
    // A fetch() of the app's server is traced
    const fetchTrace = getSampledTraceHeaders()
    await page.evaluate(
      (headers) => fetch('/index.pageContext.json', { headers }).then((response) => response.text()),
      fetchTrace.headers,
    )
    await sleep(2000)
    const getServerSegments = (traceId: string) =>
      ingest.spans.filter((span) => span.side === 'server' && span.isSegment && span.traceId === traceId)
    expect(getServerSegments(traceId).length).toBe(1)
    expect(getServerSegments(fetchTrace.traceId).length).toBe(1)
  })

  test('no span for +route functions', async () => {
    const { headers, traceId } = getSampledTraceHeaders()
    await fetch(getServerUrl() + '/item/1', { headers })
    const getSpans = () => ingest.spans.filter((span) => span.traceId === traceId)
    const getSpanNames = () => getSpans().map((span) => span.name)
    await autoRetry(
      async () => {
        expect(getSpans().some((span) => span.isSegment && span.op === 'http.server')).toBe(true)
        expect(getSpanNames()).toContain('onBeforeRoute')
      },
      { timeout: 10 * 1000 },
    )
    expect(getSpanNames()).not.toContain('route')
  })

  test('+route error upon client-side navigation is sent to Sentry', async () => {
    await gotoHydrated('/links')
    await page.locator('a', { hasText: 'Route error' }).click()
    await autoRetry(
      async () => {
        expect(getErrorEvents('ROUTE_ERR').filter((event) => event.side === 'client').length > 0).toBe(true)
      },
      { timeout: 10 * 1000 },
    )
  })

  test("React's caught and recoverable errors are logged and sent to Sentry once", async () => {
    const errorLogs: string[] = []
    const onConsole = (message: { type(): string; text(): string }) => {
      if (message.type() === 'error') errorLogs.push(message.text())
    }
    page.on('console', onConsole)
    await gotoHydrated('/hydration-mismatch')
    await gotoHydrated('/error-boundary')
    await page.locator('button', { hasText: 'Throw Caught Error' }).click()
    await page.locator('p', { hasText: 'Error caught' }).waitFor()
    await expectErrorEvent('BOUNDARY_CAUGHT')
    await autoRetry(
      async () => {
        expect(getHydrationEvents().length).toBe(1)
      },
      { timeout: 10 * 1000 },
    )
    await sleep(1000)
    page.off('console', onConsole)
    expect(getErrorEvents('BOUNDARY_CAUGHT').length).toBe(1)
    expect(getHydrationEvents().length).toBe(1)
    // Once each: nothing else logs them
    expect(errorLogs.filter((log) => log.includes('BOUNDARY_CAUGHT')).length).toBe(1)
    expect(errorLogs.filter((log) => /Hydration failed|Minified React error #418/.test(log)).length).toBe(1)
  })

  test('hook error is sent to Sentry once', async () => {
    await fetch(getServerUrl() + '/data-error')
    await expectErrorEvent('DATA_ERR')
    await sleep(1000)
    const events = getErrorEvents('DATA_ERR')
    expect(events.length).toBe(1)
    expect(events[0]!.payload.tags['vike.hook']).toBe('data')
    expect(events[0]!.payload.tags.side).toBe('server')
  })

  test('an event sent by a server hook has its hook and page tags', async () => {
    await fetch(getServerUrl() + '/user-message')
    await autoRetry(
      async () => {
        expect(getMessageEvents('USER_MESSAGE').length).toBe(1)
      },
      { timeout: 10 * 1000 },
    )
    await sleep(1000)
    const events = getMessageEvents('USER_MESSAGE')
    expect(events.length).toBe(1)
    expect(events[0]!.payload.tags['vike.hook']).toBe('data')
    expect(events[0]!.payload.tags['vike.page']).toBe('/pages/user-message')
  })

  test('an event sent by a client hook has its hook and page tags', async () => {
    await gotoHydrated('/user-message')
    await autoRetry(
      async () => {
        expect(getMessageEvents('USER_MESSAGE_CLIENT').length).toBe(1)
      },
      { timeout: 10 * 1000 },
    )
    const event = getMessageEvents('USER_MESSAGE_CLIENT')[0]!
    expect(event.side).toBe('client')
    expect(event.payload.tags['vike.hook']).toBe('onBeforeRender')
    expect(event.payload.tags['vike.page']).toBe('/pages/user-message')
  })

  test('thrown string is sent to Sentry once', async () => {
    await fetch(getServerUrl() + '/data-string')
    await expectErrorEvent('DATA_STRING')
    await sleep(1000)
    expect(getErrorEvents('DATA_STRING').length).toBe(1)
  })

  test('sync error is sent to Sentry', async () => {
    await gotoHydrated('/')
    await page.locator('button', { hasText: 'Throw Sync Error' }).click()
    await expectErrorEvent('This is a test error sent to Sentry!')
    const event = getErrorEvents('This is a test error sent to Sentry!')[0]!.payload
    // Set by the +sentry factory, from a module that only Vite's resolve.alias can find
    expect(event.release).toBe('vike-react-sentry-example@0.0.0')
    // Set by the +sentry factory, from its globalContext argument
    expect(event.tags.side).toBe('client')
    // The integration added by +sentry.client.ts and the extension's default ones
    expect(event.sdk.integrations).toContain('HttpClient')
    expect(event.sdk.integrations).toContain('BrowserTracing')
    expect(event.sdk.integrations).toContain('Replay')
  })

  test('render error is sent to Sentry', async () => {
    await gotoHydrated('/')
    await page.locator('button', { hasText: 'Throw Render Error' }).click()
    await expectErrorEvent('This is a render error sent to Sentry!')
  })

  test('SSR error inside a Suspense boundary is sent to Sentry', async () => {
    const html = await fetchHtml('/ssr-boundary')
    expect(html).toContain('SSR error inside a Suspense boundary')
    await autoRetry(
      async () => {
        expect(getErrorEvents('SSR_BOUNDARY').filter((event) => event.side === 'server').length).toBe(1)
      },
      { timeout: 10 * 1000 },
    )
  })

  test('async error is sent to Sentry', async () => {
    await gotoHydrated('/')
    await page.locator('button', { hasText: 'Throw Async Error' }).click()
    await expectErrorEvent('This is an async error sent to Sentry!')
  })
}

function testRunWithoutDsn() {
  setupEnv('')
  run('pnpm run prod', {
    serverIsReadyMessage: 'Listening on',
    tolerateError: ({ logText }) => logText.includes('This is a test error sent to Sentry!'),
  })

  test('page is rendered and nothing is sent to Sentry', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Vike + React + Sentry Example</h1>')
    expect(html).not.toContain('<meta name="sentry-trace"')
    await page.goto(getServerUrl() + '/')
    await testCounter()
    await page.locator('button', { hasText: 'Throw Sync Error' }).click()
    await sleep(2000)
    expect(ingest.items.length).toBe(0)
  })
}

function testRunWithFactoryDsn() {
  // Only +sentry returns the DSN: neither the build nor the server may need it from the environment
  setupEnv(`PUBLIC_ENV__FACTORY_DSN=${ingest.dsn}\n`)
  run('pnpm run prod', {
    serverIsReadyMessage: 'Listening on',
    tolerateError: ({ logText }) =>
      logText.includes('This is a test error sent to Sentry!') || logText.includes('DATA_ERR'),
  })

  test('server error is sent to the DSN of +sentry', async () => {
    await fetch(getServerUrl() + '/data-error')
    await expectErrorEvent('DATA_ERR')
    expect(getErrorEvents('DATA_ERR')[0]!.side).toBe('server')
  })

  test('browser error is sent to the DSN of +sentry', async () => {
    await gotoHydrated('/')
    await page.locator('button', { hasText: 'Throw Sync Error' }).click()
    await expectErrorEvent('This is a test error sent to Sentry!')
    expect(getErrorEvents('This is a test error sent to Sentry!')[0]!.side).toBe('client')
  })
}

function testRunWithServerDsn() {
  // Only the production server's environment has the DSN, as the README says to set SENTRY_DSN
  setupEnv('')
  process.env.SENTRY_DSN = ingest.dsn
  run('pnpm run prod', {
    serverIsReadyMessage: 'Listening on',
    tolerateError: ({ logText }) => logText.includes('DATA_ERR'),
  })

  test("server error is sent to the DSN of the server's environment", async () => {
    // The server has its copy; the test files after this one share this process
    delete process.env.SENTRY_DSN
    await fetch(getServerUrl() + '/data-error')
    await expectErrorEvent('DATA_ERR')
    expect(getErrorEvents('DATA_ERR')[0]!.side).toBe('server')
  })
}

async function gotoHydrated(url: string) {
  await page.goto(getServerUrl() + url)
  await page.waitForFunction(() => !!(window as any)._vike?.fullyRenderedUrl)
}

async function testCounter() {
  // autoRetry() in case page isn't hydrated yet
  await autoRetry(
    async () => {
      const heading = page.locator('h2', { hasText: 'Counter' })
      expect(await heading.textContent()).toBe('Counter: 0')
    },
    { timeout: 5 * 1000 },
  )
  // Await hydration — clicking repeatedly until the value changes is flaky: a click can land while the previous one is still being processed, overshooting the expected value.
  await page.waitForFunction(() => !!(window as any)._vike?.fullyRenderedUrl)
  const btn = page.locator('button', { hasText: 'Increment' })
  await btn.click()
  await autoRetry(
    async () => {
      const heading = page.locator('h2', { hasText: 'Counter' })
      expect(await heading.textContent()).toBe('Counter: 1')
    },
    { timeout: 5 * 1000 },
  )
}

async function expectErrorEvent(message: string) {
  await autoRetry(
    async () => {
      expect(getErrorEvents(message).length).toBe(1)
    },
    { timeout: 10 * 1000 },
  )
}

// Lets the test's request be traced regardless of tracesSampleRate
function getSampledTraceHeaders() {
  const traceId = crypto.randomUUID().replaceAll('-', '')
  const spanId = traceId.slice(0, 16)
  return { traceId, headers: { 'sentry-trace': `${traceId}-${spanId}-1` } }
}

function getHydrationEvents() {
  return ingest.items.filter(
    (item) =>
      item.type === 'event' &&
      item.payload.exception?.values?.some((v: any) => /Hydration failed|Minified React error #418/.test(v.value)),
  )
}

function getMessageEvents(message: string) {
  return ingest.items.filter((item) => item.type === 'event' && item.payload.message === message)
}

function getErrorEvents(message: string) {
  return ingest.items.filter(
    (item) => item.type === 'event' && item.payload.exception?.values?.some((v: any) => v.value === message),
  )
}

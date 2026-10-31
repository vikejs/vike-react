export { testRun }
export { testRunWithoutDsn }

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
      logText.includes('This is an async error sent to Sentry!'),
  })

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Vike + React + Sentry Example</h1>')
  })

  test('tracing is enabled by default', async () => {
    const html = await fetchHtml('/')
    expect(html).toMatch(/<meta name="baggage" content="[^"]*sentry-sample_rate=0\.2/)
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

  test('sync error is sent to Sentry', async () => {
    await gotoHydrated('/')
    await page.locator('button', { hasText: 'Throw Sync Error' }).click()
    await expectErrorEvent('This is a test error sent to Sentry!')
    // Set by the +sentry factory, from a module that only Vite's resolve.alias can find
    expect(getErrorEvents('This is a test error sent to Sentry!')[0]!.payload.release).toBe(
      'vike-react-sentry-example@0.0.0',
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

function getErrorEvents(message: string) {
  return ingest.items.filter(
    (item) => item.type === 'event' && item.payload.exception?.values?.some((v: any) => v.value === message),
  )
}

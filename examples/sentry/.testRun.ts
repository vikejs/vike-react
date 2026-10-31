export { testRun }

import { test, expect, run, fetchHtml, page, getServerUrl, autoRetry } from '@brillout/test-e2e'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { startIngest } from './.ingest'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ingest = await startIngest()

function setupEnv() {
  fs.writeFileSync(path.join(__dirname, '.env'), `PUBLIC_ENV__SENTRY_DSN=${ingest.dsn}\n`)
}

function testRun(cmd: 'pnpm run dev' | 'pnpm run prod') {
  const isProd = cmd !== 'pnpm run dev'
  setupEnv()
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

  test('page is rendered to the DOM and interactive', async () => {
    await page.goto(getServerUrl() + '/')
    expect(await page.textContent('h1')).toBe('Vike + React + Sentry Example')
    await testCounter()
  })

  test('sync error is sent to Sentry', async () => {
    await gotoHydrated('/')
    await page.locator('button', { hasText: 'Throw Sync Error' }).click()
    await expectErrorEvent('This is a test error sent to Sentry!')
  })

  test('async error is sent to Sentry', async () => {
    await gotoHydrated('/')
    await page.locator('button', { hasText: 'Throw Async Error' }).click()
    await expectErrorEvent('This is an async error sent to Sentry!')
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

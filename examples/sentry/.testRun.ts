export { testRun }

import { test, expect, run, fetchHtml, page, getServerUrl, autoRetry } from '@brillout/test-e2e'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEST_DSN = 'https://8de66fe8dda3a86d986df8ee3aa09f72@o4510438936412161.ingest.de.sentry.io/4510438941655120'

function setupEnv() {
  const envPath = path.join(__dirname, '.env')
  const examplePath = path.join(__dirname, '.env.example')
  let content = fs.readFileSync(examplePath, 'utf-8')
  content = content.replace('your-dsn-url', TEST_DSN)
  fs.writeFileSync(envPath, content)
}

function testRun(cmd: 'pnpm run dev' | 'pnpm run prod') {
  setupEnv()
  run(cmd, {
    // We intentionally throw errors to test Sentry error reporting
    tolerateError: ({ logText }) =>
      logText.includes('This is a test error sent to Sentry!') ||
      logText.includes('This is an async error sent to Sentry!') ||
      logText.includes('[sentry-vite-plugin]'),
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
    await page.goto(getServerUrl() + '/')
    await testSentryRequest('Throw Sync Error', 'This is a test error sent to Sentry!')
  })

  test('async error is sent to Sentry', async () => {
    await page.goto(getServerUrl() + '/')
    await testSentryRequest('Throw Async Error', 'This is an async error sent to Sentry!')
  })
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
  await autoRetry(
    async () => {
      const btn = page.locator('button', { hasText: 'Increment' })
      await btn.click()
      const heading = page.locator('h2', { hasText: 'Counter' })
      expect(await heading.textContent()).toBe('Counter: 1')
    },
    { timeout: 5 * 1000 },
  )
}

async function testSentryRequest(buttonText: string, expectedMessage: string) {
  const sentryBodies: string[] = []

  // Listen for Sentry envelope requests
  const listener = (req: { url: () => string; method: () => string; postData: () => string | null }) => {
    if (req.url().includes('sentry.io') && req.method() === 'POST') {
      sentryBodies.push(req.postData() || '')
    }
  }
  page.on('request', listener)

  const btn = page.locator('button', { hasText: buttonText })
  await btn.click()

  await autoRetry(
    async () => {
      const match = sentryBodies.find((body) => body.includes(expectedMessage))
      expect(match).toBeTruthy()
    },
    { timeout: 10 * 1000 },
  )

  page.removeListener('request', listener)
}

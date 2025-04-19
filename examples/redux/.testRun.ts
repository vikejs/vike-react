export { testRun }

import { test, expect, run, page, getServerUrl, autoRetry } from '@brillout/test-e2e'

function testRun(cmd: `pnpm run ${'dev' | 'preview'}`) {
  run(cmd)

  test('store', async () => {
    await page.goto(getServerUrl() + '/')
    await testCounter(42)

    // Client-side navigation
    await page.click('a:has-text("About")')
    await page.waitForFunction(() => (window as any)._vike.fullyRenderedUrl === '/about')
    await testCounter(43)
    await page.click('a:has-text("Welcome")')
    await page.waitForFunction(() => (window as any)._vike.fullyRenderedUrl === '/')
    await testCounter(44)

    // Full page reload
    await page.goto(getServerUrl() + '/')
    await testCounter(42)
    await page.goto(getServerUrl() + '/about')
    await testCounter(42)
  })
}

async function testCounter(currentValue = 0) {
  // autoRetry() in case page just got client-side navigated
  await autoRetry(
    async () => {
      const btn = page.locator('button', { hasText: 'Counter' })
      expect(await btn.textContent()).toBe(`Counter ${currentValue}`)
    },
    { timeout: 5 * 1000 },
  )
  // autoRetry() in case page isn't hydrated yet
  await autoRetry(
    async () => {
      const btn = page.locator('button', { hasText: 'Counter' })
      await btn.click()
      expect(await btn.textContent()).toBe(`Counter ${currentValue + 1}`)
    },
    { timeout: 5 * 1000 },
  )
}

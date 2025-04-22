export { testRun }

import { test, expect, run, fetchHtml, page, getServerUrl, autoRetry, partRegex } from '@brillout/test-e2e'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  run(cmd)

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Welcome</h1>')
  })

  test('page is rendered to the DOM and interactive', async () => {
    await page.goto(getServerUrl() + '/')
    expect(await page.textContent('h1')).toBe('Welcome')
    await testCounter()
  })

  test('state from server-side', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain(`Node version from server: <!-- -->${process.version}`)
  })
}

async function testCounter() {
  // autoRetry() in case page just got client-side navigated
  let currentValue: number
  await autoRetry(
    async () => {
      const btn = page.locator('button', { hasText: 'Counter' })
      const content = await btn.textContent()
      expect(content).toMatch(partRegex`Counter ${/[0-9]+/}`)
      currentValue = parseInt(content!.slice('Counter '.length), 10)
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

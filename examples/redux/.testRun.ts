export { testRun }

import { test, expect, run, page, getServerUrl, autoRetry } from '@brillout/test-e2e'

function testRun(cmd: `pnpm run ${'dev' | 'preview'}`) {
  run(cmd)

  const content1 = 'This page is'
  const content2 = 'The counter value is'

  test('The store persists across page navigation', async () => {
    let body: string | null

    await page.goto(getServerUrl() + '/')
    body = await page.textContent('body')

    expect(body).toContain(content1)
    await testCounter()

    await page.click('a:has-text("About")')
    await page.click('button')

    body = await page.textContent('body')
    expect(body).toContain(content2)
    expect(await page.textContent('button')).toContain('Counter 2')
  })
}

async function testCounter() {
  // autoRetry() for awaiting client-side code loading & executing
  await autoRetry(
    async () => {
      expect(await page.textContent('button')).toBe('Counter 0')
      await page.click('button')
      expect(await page.textContent('button')).toContain('Counter 1')
    },
    { timeout: 5 * 1000 },
  )
}

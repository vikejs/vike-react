export { testRun }

import { test, expect, run, fetchHtml, page, getServerUrl, autoRetry } from '@brillout/test-e2e'

function testRun(cmd: `pnpm run ${'dev' | 'preview'}`) {
  run(cmd)

  const content = 'Return of the Jedi'
  const loading = 'Loading movies...'
  test('HTML', async () => {
    const html = await fetchHtml('/')
    expect(getTitle(html)).toBe('My Vike + React App')
    // fetchHtml() awaits the stream
    expect(html).toContain(content)
  })
  test('DOM', async () => {
    await page.goto(getServerUrl() + '/')
    const body = await page.textContent('body')
    // Playwright seems to await the HTML stream
    expect(body).not.toContain(loading)
    expect(body).toContain(content)
    await testCounter()
  })
}

function getTitle(html: string) {
  const title = html.match(/<title>(.*?)<\/title>/i)?.[1]
  return title
}

async function testCounter() {
  // autoRetry() for awaiting client-side code loading & executing
  await autoRetry(
    async () => {
      expect(await page.textContent('button')).toBe('Counter 0')
      await page.click('button')
      expect(await page.textContent('button')).toContain('Counter 1')
    },
    { timeout: 5 * 1000 }
  )
}

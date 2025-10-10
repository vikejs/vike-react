export { testRun }

import { test, expect, run, page, getServerUrl, autoRetry } from '@brillout/test-e2e'

function testRun(cmd: `pnpm run ${'dev' | 'preview'}`) {
  run(cmd)

  const content = 'Return of the Jedi'
  const loading = 'Loading movies...'
  const titleDefault = 'My Vike + React App'
  const titleOverriden = '6 movies'
  const titleAsScript = `<script>document.title = "${titleOverriden}"</script>`
  const description = '<meta name="description" content="List of 6 Star Wars movies."/>'
  test('HTML (as user)', async () => {
    const html = await fetchAsUser('/')
    expect(html).toContain(content)
    expect(html).toContain(loading)
    expect(html).toContain(titleAsScript)
    expect(getTitle(html)).toBe(titleDefault)
    expect(html.split('<title>').length).toBe(2)
    expect(html).not.toContain(description)
  })
  test('HTML (as bot)', async () => {
    const html = await fetchAsBot('/')
    expect(html).toContain(content)
    expect(html).not.toContain(loading)
    expect(html).not.toContain(titleAsScript)
    expect(getTitle(html)).toBe(titleOverriden)
    expect(html.split('<title>').length).toBe(2)
    expect(html).toContain(description)
  })
  test('DOM', async () => {
    await page.goto(getServerUrl() + '/')
    const getBody = async () => await page.textContent('body')
    const isLoading = async () => {
      const body = await getBody()
      expect(body).toContain(loading)
      /* Playwright seems to await the HTML stream?
      expect(body).not.toContain(content)
      */
    }
    const isLoaded = async () => {
      const body = await getBody()
      expect(body).toContain(content)
      expect(body).not.toContain(loading)
    }
    await isLoading()
    await testCounter()
    await isLoading()
    // expect(await getBody()).not.toContain(content)
    await autoRetry(isLoaded)
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
    { timeout: 5 * 1000 },
  )
}

async function fetchAsBot(pathname: string) {
  return await fetchHtml(pathname, 'curl/8.5.0')
}
async function fetchAsUser(pathname: string) {
  return await fetchHtml(pathname, 'chrome')
}
async function fetchHtml(pathname: string, userAgent: string) {
  const response = await fetch(getServerUrl() + pathname, { headers: { ['User-Agent']: userAgent } })
  const html = await response.text()
  return html
}

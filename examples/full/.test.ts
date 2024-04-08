import { test, expect, run, fetchHtml, page, getServerUrl, autoRetry } from '@brillout/test-e2e'

runTest()

function runTest() {
  run('pnpm run dev')

  const textLandingPage = 'Rendered to HTML.'
  testUrl({
    url: '/',
    title: 'My Vike + React App',
    text: textLandingPage,
    counter: true
  })

  testUrl({
    url: '/star-wars',
    title: '6 Star Wars Movies',
    text: 'A New Hope'
  })

  testUrl({
    url: '/star-wars/3',
    title: 'Return of the Jedi',
    text: '1983-05-25'
  })

  const textNoSSR = 'This page is rendered only in the browser'
  {
    const url = '/without-ssr'
    const title = 'My Vike + React App'
    const text = textNoSSR
    test(url + ' (HTML)', async () => {
      const html = await fetchHtml(url)
      // Isn't rendered to HTML
      expect(html).toContain('<div id="page-view"></div>')
      expect(html).not.toContain(text)
      expect(getTitle(html)).toBe(title)
    })
    test(url + ' (Hydration)', async () => {
      await page.goto(getServerUrl() + url)
      await testCounter()
      const body = await page.textContent('body')
      expect(body).toContain(text)
    })
    test('Switch between SSR and non-SSR page', async () => {
      let body: string | null
      const t1 = textNoSSR
      const t2 = textLandingPage
      body = await page.textContent('body')
      expect(body).toContain(t1)
      expect(body).not.toContain(t2)
      await page.click('a:has-text("Welcome")')
      await testCounter()
      body = await page.textContent('body')
      expect(body).toContain(t2)
      expect(body).not.toContain(t1)
      await page.click('a:has-text("Without SSR")')
      await testCounter()
      body = await page.textContent('body')
      expect(body).toContain(t1)
      expect(body).not.toContain(t2)
    })
  }
}

function testUrl({ url, title, text, counter }: { url: string; title: string; text: string; counter?: true }) {
  test(url + ' (HTML)', async () => {
    const html = await fetchHtml(url)
    expect(html).toContain(text)
    expect(getTitle(html)).toBe(title)
  })
  test(url + ' (Hydration)', async () => {
    await page.goto(getServerUrl() + url)
    const body = await page.textContent('body')
    expect(body).toContain(text)
    if (counter) {
      await testCounter()
    }
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

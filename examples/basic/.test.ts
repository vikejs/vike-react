import { test, expect, run, fetchHtml, page, getServerUrl, autoRetry } from '@brillout/test-e2e'

runTest()

function runTest() {
  run('pnpm run dev')

  testUrl({
    url: '/',
    title: 'My Vike + React App',
    text: 'My Vike + React app',
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
  expect(await page.textContent('button')).toBe('Counter 0')
  // autoRetry() for awaiting client-side code loading & executing
  await autoRetry(async () => {
    await page.click('button')
    expect(await page.textContent('button')).toContain('Counter 1')
  })
}

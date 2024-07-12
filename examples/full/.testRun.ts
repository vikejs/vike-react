export { testRun }
import { test, expect, run, fetchHtml, page, getServerUrl, autoRetry, partRegex } from '@brillout/test-e2e'

let isProd: boolean

const titleDefault = 'My Vike + React App'
const pages = {
  '/': {
    title: titleDefault,
    text: 'Rendered to HTML.',
    counter: true
  },
  '/star-wars': {
    title: '6 Star Wars Movies',
    text: 'A New Hope'
  },
  '/star-wars/3': {
    title: 'Return of the Jedi',
    description: 'Star Wars Movie Return of the Jedi from Richard Marquand',
    text: '1983-05-25'
  },
  '/streaming': {
    title: titleDefault,
    text: 'Progressive Rendering',
    counter: true
  },
  '/without-ssr': {
    title: 'No SSR',
    text: 'This page is rendered only in the browser',
    counter: true,
    noSSR: true
  }
} as const

function testRun(cmd: `pnpm run ${'dev' | 'preview'}`) {
  run(cmd)
  isProd = cmd !== 'pnpm run dev'
  testPages()
  testPageNavigation_betweenWithSSRAndWithout()
  testPageNavigation_titleUpdate()
  testHeadComponent()
}

function testPageNavigation_betweenWithSSRAndWithout() {
  const textWithSSR = 'Rendered to HTML.'
  const textWithoutSSR = "It isn't rendered to HTML"

  const url = '/without-ssr'
  test(url + " isn't rendered to HTML", async () => {
    const html = await fetchHtml(url)
    expect(html).toContain('<div id="root"></div>')
    expect(html).not.toContain(textWithoutSSR)
    await page.goto(getServerUrl() + url)
    await testCounter()
    const body = await page.textContent('body')
    expect(body).toContain(textWithoutSSR)
  })

  test('Switch between SSR and non-SSR page', async () => {
    let body: string | null
    const t1 = textWithoutSSR
    const t2 = textWithSSR

    body = await page.textContent('body')
    expect(body).toContain(t1)
    expect(body).not.toContain(t2)
    ensureWasClientSideRouted('/pages/without-ssr')

    await page.click('a:has-text("Welcome")')
    await testCounter()
    body = await page.textContent('body')
    expect(body).toContain(t2)
    expect(body).not.toContain(t1)
    ensureWasClientSideRouted('/pages/without-ssr')

    await page.click('a:has-text("Without SSR")')
    await testCounter()
    body = await page.textContent('body')
    expect(body).toContain(t1)
    expect(body).not.toContain(t2)
    ensureWasClientSideRouted('/pages/without-ssr')
  })
}

function testPageNavigation_titleUpdate() {
  test('title update client-side page navigation', async () => {
    {
      const { title } = pages['/']
      await page.goto(getServerUrl() + '/')
      await expectTitle(title)
    }
    const testMovieList = async () => {
      const { title } = pages['/star-wars']
      await page.click(`a[href="/star-wars"]`)
      await expectTitle(title)
    }
    await testMovieList()
    const testMoviePage = async () => {
      const { title } = pages['/star-wars/3']
      await page.click(`a:has-text("${title}")`)
      await expectTitle(title)
    }
    await testMoviePage()
    await testMovieList()
    await testMoviePage()
    await testMovieList()
    await testMoviePage()
  })
}
async function expectTitle(title: string) {
  await autoRetry(async () => {
    const titleActual = await page.evaluate(() => window.document.title)
    expect(titleActual).toBe(title)
  })
}

function testPages() {
  Object.entries(pages).forEach(([url, pageInfo]) => {
    testPage({ url, ...pageInfo })
  })
}

function testPage({
  url,
  title,
  description,
  text,
  counter,
  noSSR
}: { url: string; title: string; description?: string; text: string; counter?: true; noSSR?: true }) {
  test(url + ' (HTML)', async () => {
    const html = await fetchHtml(url)
    if (!noSSR) {
      expect(html).toContain(text)
    }
    expect(getTitle(html)).toBe(title)
    const hash = /[a-zA-Z0-9_-]+/
    if (!isProd) {
      expect(html).toMatch(partRegex`<link rel="icon" href="/assets/logo.svg"/>`)
    } else {
      expect(html).toMatch(partRegex`<link rel="icon" href="/assets/static/logo.${hash}.svg"/>`)
    }

    if (description) {
      expect(html).toContain(`<meta name="description" content="${description}"/>`)
    }
  })
  test(url + ' (Hydration)', async () => {
    await page.goto(getServerUrl() + url)
    if (counter) {
      await testCounter()
    }
    const body = await page.textContent('body')
    expect(body).toContain(text)
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

function testHeadComponent() {
  test('Head Component', async () => {
    const html = await fetchHtml('/images')
    expect(html).toContain(
      '<script type="application/ld+json">{"@context":"https://schema.org/","contentUrl":{"src":"/assets/logo-new.svg"},"creator":{"@type":"Person","name":"brillout"}}</script>'
    )
    expect(html).toContain(
      '<script type="application/ld+json">{"@context":"https://schema.org/","contentUrl":{"src":"/assets/logo.svg"},"creator":{"@type":"Person","name":"Romuald Brillout"}}</script>'
    )
  })
}

/** Ensure page wasn't server-side routed.
 *
 * Examples:
 *   await ensureWasClientSideRouted('/pages/index')
 *   await ensureWasClientSideRouted('/pages/about')
 */
async function ensureWasClientSideRouted(pageIdFirst: `/pages/${string}`) {
  // Check whether the HTML is from the first page before Client-side Routing.
  // page.content() doesn't return the original HTML (it dumps the DOM to HTML).
  // Therefore only the serialized pageContext tell us the original HTML.
  const html = await page.content()
  const pageId = findFirstPageId(html)
  expect(pageId).toBe(pageIdFirst)
}
function findFirstPageId(html: string) {
  expect(html).toContain('<script id="vike_pageContext" type="application/json">')
  expect(html).toContain('_pageId')
  expect(html.split('_pageId').length).toBe(2)
  const match = partRegex`"_pageId":"${/([^"]+)/}"`.exec(html)
  expect(match).toBeTruthy()
  const pageId = match![1]
  expect(pageId).toBeTruthy()
  return pageId
}

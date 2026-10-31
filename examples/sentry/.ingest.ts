export { startIngest }
export type { Item }

import http from 'node:http'
import zlib from 'node:zlib'

type Item = { type: string; side: 'client' | 'server'; payload: any }

// A local stand-in for Sentry's ingest endpoint, so that the tests don't send anything to sentry.io
async function startIngest() {
  const items: Item[] = []
  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    const chunks: Buffer[] = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      let body: Buffer = Buffer.concat(chunks)
      if (req.headers['content-encoding'] === 'gzip') body = zlib.gunzipSync(body)
      const side = req.headers['user-agent']?.includes('Mozilla') ? 'client' : 'server'
      if (body.length > 0) items.push(...parseEnvelope(body).map((item) => ({ ...item, side }) as const))
      res.end('{}')
    })
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  server.unref()
  const { port } = server.address() as { port: number }
  return { dsn: `http://public@127.0.0.1:${port}/1`, items }
}

// https://develop.sentry.dev/sdk/data-model/envelopes/
function parseEnvelope(body: Buffer) {
  const items: Omit<Item, 'side'>[] = []
  let i = endOfLine(body, 0) + 1
  while (i < body.length) {
    const headerEnd = endOfLine(body, i)
    const header = JSON.parse(body.subarray(i, headerEnd).toString())
    const payloadStart = headerEnd + 1
    const payloadEnd = header.length === undefined ? endOfLine(body, payloadStart) : payloadStart + header.length
    const payload = body.subarray(payloadStart, payloadEnd).toString()
    const isJson = header.type === 'event' || header.type === 'transaction'
    items.push({ type: header.type, payload: isJson ? JSON.parse(payload) : null })
    i = payloadEnd + 1
  }
  return items
}

function endOfLine(buffer: Buffer, from: number) {
  const i = buffer.indexOf('\n', from)
  return i === -1 ? buffer.length : i
}

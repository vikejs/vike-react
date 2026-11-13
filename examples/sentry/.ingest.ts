export { startIngest }
export type { Item }
export type { Span }

import http from 'node:http'
import zlib from 'node:zlib'

type Item = { type: string; side: 'client' | 'server'; payload: any }
// A span of a transaction event (SDK v10) or a streamed span (SDK v11)
type Span = { side: 'client' | 'server'; traceId: string; name: string; op: string | undefined; isSegment: boolean }

// A local stand-in for Sentry's ingest endpoint, so that the tests don't send anything to sentry.io
async function startIngest() {
  const items: Item[] = []
  const spans: Span[] = []
  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    const chunks: Buffer[] = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      let body: Buffer = Buffer.concat(chunks)
      if (req.headers['content-encoding'] === 'gzip') body = zlib.gunzipSync(body)
      const side: Item['side'] = req.headers['user-agent']?.includes('Mozilla') ? 'client' : 'server'
      if (body.length === 0) return res.end('{}')
      for (const item of parseEnvelope(body)) {
        items.push({ ...item, side })
        spans.push(...getSpans(item.type, item.payload).map((span) => ({ ...span, side })))
      }
      res.end('{}')
    })
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  server.unref()
  const { port } = server.address() as { port: number }
  return { dsn: `http://public@127.0.0.1:${port}/1`, items, spans }
}

function getSpans(type: string, payload: any): Omit<Span, 'side'>[] {
  if (type === 'transaction') {
    const { trace } = payload.contexts
    return [
      { traceId: trace.trace_id, name: payload.transaction, op: trace.op, isSegment: true },
      ...payload.spans.map((span: any) => ({
        traceId: span.trace_id,
        name: span.description,
        op: span.op,
        isSegment: false,
      })),
    ]
  }
  // SDK v10 also sends single web vital spans, without `items`
  if (type === 'span' && payload.items) {
    return payload.items.map((span: any) => ({
      traceId: span.trace_id,
      name: span.name,
      op: span.attributes['sentry.op']?.value,
      isSegment: span.is_segment,
    }))
  }
  return []
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
    const isJson = header.type === 'event' || header.type === 'transaction' || header.type === 'span'
    items.push({ type: header.type, payload: isJson ? JSON.parse(payload) : null })
    i = payloadEnd + 1
  }
  return items
}

function endOfLine(buffer: Buffer, from: number) {
  const i = buffer.indexOf('\n', from)
  return i === -1 ? buffer.length : i
}

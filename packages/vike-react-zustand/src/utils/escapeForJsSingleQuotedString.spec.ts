import { parse } from '@brillout/json-serializer/parse'
import { stringify } from '@brillout/json-serializer/stringify'
import { describe, expect, it } from 'vitest'
import { escapeForJsSingleQuotedString } from './escapeForJsSingleQuotedString.js'

// Simulates the browser: parses `'...'` with the actual JavaScript parser
function evalSingleQuoted(escaped: string): string {
  return new Function(`return '${escaped}'`)() as string
}

const trickyStrings: string[] = [
  // https://github.com/vikejs/vike/issues/3463
  "O'Brien",
  // XSS payloads breaking out of the single-quoted string literal
  "'; alert(1); '",
  "');alert(1);('",
  "\\'-alert(1)-\\'",
  // XSS payloads breaking out of the <script> element
  '</script><script>alert(1)</script>',
  '<!--<script>',
  '--><script>alert(1)</script>',
  // Backslashes & JSON escape sequences — mangled by the JavaScript parser if not escaped
  'C:\\path\\to\\file',
  'backslash-n: \\n',
  'trailing backslash \\',
  'line1\nline2',
  'tab\there',
  'carriage\rreturn',
  'say "hi"',
  'nul\u0000char',
  // Line separators — a syntax error inside string literals of pre-ES2019 browsers
  'para\u2029graph',
  'line\u2028separator',
  // Unicode sanity
  'emoji 🚀 ünïcôdé 中文',
  '',
]

describe('escapeForJsSingleQuotedString()', () => {
  it('round-trips arbitrary strings through the JavaScript parser', () => {
    trickyStrings.forEach((str) => {
      expect(evalSingleQuoted(escapeForJsSingleQuotedString(str))).toBe(str)
    })
  })

  it('never produces characters that break out of the string literal or the <script> element', () => {
    trickyStrings.forEach((str) => {
      const escaped = escapeForJsSingleQuotedString(str)
      // `<` would allow `</script>` and `<!--` breakouts
      expect(escaped).not.toContain('<')
      // An unescaped `'` would terminate the string literal — all quotes must be preceded by a backslash
      expect(escaped).not.toMatch(/(?<!\\)(\\\\)*'/)
      // A raw line terminator inside a string literal is a syntax error
      expect(escaped).not.toMatch(/[\n\r\u2028\u2029]/)
    })
  })

  it('round-trips fuzzed strings made of hostile characters', () => {
    const alphabet = ['\\', "'", '"', '<', '>', '/', '\n', '\r', '\u2028', '\u2029', '`', '$', '{', '}', 'a', ' ']
    let seed = 42
    const random = () => {
      // Deterministic LCG => no flakiness
      seed = (seed * 1664525 + 1013904223) % 4294967296
      return seed / 4294967296
    }
    for (let i = 0; i < 1000; i++) {
      const length = Math.floor(random() * 20)
      const str = Array.from({ length }, () => alphabet[Math.floor(random() * alphabet.length)]).join('')
      expect(evalSingleQuoted(escapeForJsSingleQuotedString(str))).toBe(str)
    }
  })

  it('injected store state round-trips: stringify() => inline <script> => JavaScript parser => parse()', () => {
    const key = "some'tricky\\key"
    const states: unknown[] = [
      // https://github.com/vikejs/vike/issues/3463
      { name: "O'Brien" },
      { xss: "'; alert(1); '" },
      { xss: '</script><script>alert(1)</script>' },
      { text: 'line1\nline2', quote: 'say "hi"', path: 'C:\\path\\to\\file' },
      { nested: { list: ["it's", { deep: "d'accord" }] }, count: 42, ok: true, nil: null },
      { map: new Map([["key'1", "value'1"]]), set: new Set(["item'1"]) },
      { date: new Date('2026-08-14T00:00:00.000Z') },
    ]
    states.forEach((state) => {
      // Mirrors the <script> injected by getOrCreateStore()
      const scriptContent = [
        'if(!globalThis._vikeReactZustandState)globalThis._vikeReactZustandState={};',
        `globalThis._vikeReactZustandState['${escapeForJsSingleQuotedString(key)}']=`,
        `'${escapeForJsSingleQuotedString(stringify(state, { htmlScriptSafe: true }))}'`,
      ].join('')
      // The HTML parser must never encounter `<` inside the inline <script>
      expect(scriptContent).not.toContain('<')
      try {
        // Simulates the browser executing the inline <script>
        new Function(scriptContent)()
        // Simulates assignServerStateOptional() on the client side
        const serverState = parse((globalThis as any)._vikeReactZustandState[key])
        expect(serverState).toEqual(state)
      } finally {
        delete (globalThis as any)._vikeReactZustandState
      }
    })
  })
})

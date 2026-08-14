export { escapeForJsSingleQuotedString }

// Escapes a string so that it can be safely embedded inside a single-quoted JavaScript string literal of an inline <script>.
// - Without escaping `'` and `\`, values break out of the string literal — enabling XSS — or get mangled by the JavaScript parser (https://github.com/vikejs/vike/issues/3463)
// - Escaping `<` ensures the HTML parser never encounters `</script>` nor `<!--` inside the inline <script> (the JavaScript parser decodes `\u003c` back to `<`)
// - `\n` and `\r` never occur in JSON output, but a raw line terminator inside a JavaScript string literal is a syntax error — better safe than sorry
// - A raw U+2028/U+2029 inside a JavaScript string literal is a syntax error in pre-ES2019 browsers
const escapeRegex = /[\\'<\n\r\u2028\u2029]/g
const escapeMap: Record<string, string> = {
  '\\': '\\\\',
  "'": "\\'",
  '<': '\\u003c',
  '\n': '\\n',
  '\r': '\\r',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
}
function escapeForJsSingleQuotedString(str: string): string {
  return str.replace(escapeRegex, (char) => escapeMap[char]!)
}

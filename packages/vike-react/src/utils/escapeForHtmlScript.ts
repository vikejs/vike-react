// https://github.com/vikejs/vike/issues/3463
/**
 * Escapes a JavaScript expression (e.g. the output of `JSON.stringify()`) so that it can be safely embedded inside an inline `<script>`.
 * - `<` is escaped so that the HTML parser never encounters `</script>` nor `<!--` inside the `<script>` — the JavaScript parser decodes `\u003c` back to `<`. (The input must be a JavaScript expression whose `<` only ever occurs inside string literals, such as `JSON.stringify()` output.)
 * - U+2028/U+2029 are escaped because a raw U+2028/U+2029 inside a JavaScript string literal is a syntax error in pre-ES2019 browsers.
 */
export function escapeForHtmlScript(js: string): string {
  return js
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

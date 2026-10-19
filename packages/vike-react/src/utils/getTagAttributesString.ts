export { getTagAttributesString }
export type { TagAttributes }

type TagAttributes = Record<string, string | number | boolean | undefined | null>

function getTagAttributesString(tagAttributes: TagAttributes): string {
  const tagAttributesString = Object.entries(tagAttributes)
    .filter(([_key, value]) => value !== false && value !== null && value !== undefined)
    .map(([key, value]) => `${ensureIsValidAttributeName(key)}="${escapeAttributeValue(String(value))}"`)
    .join(' ')
  if (tagAttributesString.length === 0) return ''
  return ` ${tagAttributesString}`
}

/**
 * Escapes a value so that it can be safely embedded inside a double-quoted HTML attribute.
 */
function escapeAttributeValue(value: string): string {
  return (
    value
      // `&` is escaped so that a value such as `&amp;` isn't decoded to `&` — it comes first so that the `&quot;` below isn't escaped again.
      .replace(/&/g, '&amp;')
      // `"` is escaped because it would end the attribute value.
      .replace(/"/g, '&quot;')
  )
}

function ensureIsValidAttributeName(str: string): string {
  if (/^[a-z][a-z0-9\-]*$/i.test(str) && !str.endsWith('-')) return str
  throw new Error(`Invalid HTML tag attribute name ${JSON.stringify(str)}`)
}

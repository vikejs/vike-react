export { applyHeadSettings }

type Value = string | null | undefined

// - We skip if `undefined` as we shouldn't remove values set by the Head setting.
// - Setting a default prevents the previous value to be leaked: upon client-side navigation, the value set by the previous page won't be removed if the next page doesn't override it.
//   - Most of the time, the user sets a default himself (i.e. a value defined at /pages/+config.js)
//     - If he doesn't have a default then he can use `null` to opt into Vike's defaults

function applyHeadSettings(title: Value, lang: Value, description: Value) {
  if (title !== undefined) {
    document.title = title || ''
    setMetaTag('property', 'og:title', title)
  }
  if (lang !== undefined) document.documentElement.lang = lang || 'en'
  if (description !== undefined) {
    setMetaTag('name', 'description', description)
    setMetaTag('property', 'og:description', description)
  }
}

// An empty value removes the tag (the server-side doesn't render the tag either)
function setMetaTag(attrName: 'name' | 'property', attrValue: string, content: string | null) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attrName}="${attrValue}"]`)
  if (!content) {
    tag?.remove()
    return
  }
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attrName, attrValue)
    document.head.appendChild(tag)
  }
  tag.content = content
}

export { applyHeadSettings }

type Value = string | null | undefined

// - We skip if `undefined` as we shouldn't remove values set by the Head setting.
// - Setting a default prevents the previous value to be leaked: upon client-side navigation, the value set by the previous page won't be removed if the next page doesn't override it.
//   - Most of the time, the user sets a default himself (i.e. a value defined at /pages/+config.js)
//     - If he doesn't have a default then he can use `null` to opt into Vike's defaults

function applyHeadSettings(title: Value, lang: Value) {
  if (title !== undefined) document.title = title || ''
  if (lang !== undefined) document.documentElement.lang = lang || 'en'
}

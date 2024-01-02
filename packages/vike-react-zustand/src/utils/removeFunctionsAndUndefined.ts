export { removeFunctionsAndUndefined }

function removeFunctionsAndUndefined(object: any) {
  const output: any = {}
  Object.keys(object).forEach((key) => {
    if (object[key] !== undefined && typeof object[key] !== 'function') {
      if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
        const value = removeFunctionsAndUndefined(object[key])
        if (value && Object.keys(value).length > 0) {
          output[key] = value
        }
      } else {
        output[key] = object[key]
      }
    }
  })

  return output
}

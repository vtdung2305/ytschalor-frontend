export const serialize = (params: any, prefix?: string): string => {
  const query = Object.keys(params).map((key) => {
    const value = params[key]

    if (params.constructor === Array) key = `${prefix}[]`
    else if (params.constructor === Object)
      key = prefix ? `${prefix}[${key}]` : key

    if (typeof value === 'object') return serialize(value, key)
    else return `${key}=${encodeURIComponent(value)}`
  })

  return query.join('&')
}

export const copyClipboard = async (value: string) => {
  // Navigator clipboard api needs a secure context (https)
  if (!value) return false
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value)
  } else {
    // Use the 'out of viewport hidden text area' trick
    const input = document.createElement('input')

    input.value = value

    // Move textarea out of the viewport so it's not visible
    input.style.position = 'absolute'
    input.style.left = '-999999px'

    document.body.prepend(input)
    input.select()

    try {
      document.execCommand('copy')
    } catch (error) {
      console.error(error)
    } finally {
      input.remove()
    }
  }
}

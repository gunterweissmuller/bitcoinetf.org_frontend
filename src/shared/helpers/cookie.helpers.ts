type SetCookieOptions = {
  'expires'?: Date | number | string
  'path'?: string
  'domain'?: string
  'secure'?: boolean
  'max-age'?: number
}

export function getCookie(name: string) {
  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'),
  )
  return matches ? decodeURIComponent(matches[1]) : undefined
}

export function deleteCookie(name: string) {
  setCookie(name, '', {
    'max-age': -1,
  })
}
export function setCookie(name: string, value: string, options: SetCookieOptions = {}) {
  options = {
    path: '/',
    // при необходимости добавьте другие значения по умолчанию
    ...options,
  }

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString()
  }

  let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value)

  for (const optionKey in options) {
    updatedCookie += '; ' + optionKey
    const optionValue = options[optionKey]
    if (optionValue !== true) {
      updatedCookie += '=' + optionValue
    }
  }

  document.cookie = updatedCookie
}

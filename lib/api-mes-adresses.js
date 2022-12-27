const NEXT_PUBLIC_API_MES_ADRESSES = process.env.NEXT_PUBLIC_API_MES_ADRESSES || 'https://api-bal.adresse.data.gouv.fr/v1'

export async function getBaseLocale(baseLocaleId) {
  const res = await fetch(`${NEXT_PUBLIC_API_MES_ADRESSES}/bases-locales/${baseLocaleId}`)

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message)
  }

  return res.json()
}

export async function searchBasesLocales(query) {
  const {page = 1, limit = 20, deleted = 0} = query
  const offset = (page - 1) * limit
  const params = {...query, offset, limit, deleted}

  const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&')

  const res = await fetch(`${NEXT_PUBLIC_API_MES_ADRESSES}/bases-locales/search?${queryString}`)

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message)
  }

  return res.json()
}

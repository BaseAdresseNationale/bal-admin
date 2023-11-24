import type {PartenaireDeLaChartType} from 'types/partenaire-de-la-charte'

const NEXT_PUBLIC_BAL_ADMIN_URL = process.env.NEXT_PUBLIC_BAL_ADMIN_URL || 'http://localhost:3000'

async function processResponse(response) {
  if (!response.ok) {
    const body = await response.json()
    throw new Error(body.message)
  }

  return response.json()
}

export async function getPartenaireDeLaCharte(id: string) {
  const response = await fetch(`${NEXT_PUBLIC_BAL_ADMIN_URL}/api/partenaires-de-la-charte/${id}`)
  const partenaireDeLaCharte = await processResponse(response)

  return partenaireDeLaCharte as PartenaireDeLaChartType
}

export async function getPartenairesDeLaCharte() {
  const url = new URL(`${NEXT_PUBLIC_BAL_ADMIN_URL}/api/partenaires-de-la-charte/`)
  url.searchParams.append('withCandidates', 'true')
  url.searchParams.append('withoutPictures', 'true')

  const response = await fetch(url)
  const partenairesDeLaCharte = await processResponse(response)

  return partenairesDeLaCharte as PartenaireDeLaChartType[]
}

export async function createPartenaireDeLaCharte(payload) {
  const response = await fetch(`${NEXT_PUBLIC_BAL_ADMIN_URL}/api/partenaires-de-la-charte/`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
  })
  const partenaireDeLaCharte = await processResponse(response)

  return partenaireDeLaCharte as PartenaireDeLaChartType
}

export async function updatePartenaireDeLaCharte(id: string, payload, acceptCandidacy = false) {
  const url = new URL(`${NEXT_PUBLIC_BAL_ADMIN_URL}/api/partenaires-de-la-charte/${id}`)
  if (acceptCandidacy) {
    url.searchParams.append('acceptCandidacy', 'true')
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
  })
  const partenaireDeLaCharte = await processResponse(response)

  return partenaireDeLaCharte as PartenaireDeLaChartType
}

export async function deletePartenaireDeLaCharte(id: string) {
  const response = await fetch(`${NEXT_PUBLIC_BAL_ADMIN_URL}/api/partenaires-de-la-charte/${id}`, {
    method: 'DELETE',
  })
  const isDeleted = await processResponse(response)

  return isDeleted as boolean
}

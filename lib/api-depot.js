const NEXT_PUBLIC_ADRESSE_URL = process.env.NEXT_PUBLIC_ADRESSE_URL || 'http://localhost:3000'
const PROXY_API_DEPOT_URL = NEXT_PUBLIC_ADRESSE_URL + '/proxy-api-depot'

export async function getClients() {
  const response = await fetch(`${PROXY_API_DEPOT_URL}/clients`)

  if (!response.ok) {
    throw new Error(response.message)
  }

  return response.json()
}

export async function getMandataires() {
  const response = await fetch(`${PROXY_API_DEPOT_URL}/mandataires`)

  if (!response.ok) {
    throw new Error(response.message)
  }

  return response.json()
}

export async function getChefsDeFile() {
  const response = await fetch(`${PROXY_API_DEPOT_URL}/chefs-de-file`)

  if (!response.ok) {
    throw new Error(response.message)
  }

  return response.json()
}

const NEXT_PUBLIC_BAL_ADMIN_URL = process.env.NEXT_PUBLIC_BAL_ADMIN_URL || 'http://localhost:3000'
const PROXY_API_DEPOT_URL = NEXT_PUBLIC_BAL_ADMIN_URL + '/api/proxy-api-depot'

async function processResponse(response) {
  if (!response.ok) {
    const body = await response.json()
    throw new Error(body.message)
  }

  return response.json()
}

export async function getClient(clientId) {
  const response = await fetch(`${PROXY_API_DEPOT_URL}/clients/${clientId}`)

  return processResponse(response)
}

export async function updateClient(clientId, body) {
  const response = await fetch(`${PROXY_API_DEPOT_URL}/clients/${clientId}`, {
    method: 'PUT',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(body)
  })

  return processResponse(response)
}

export async function createClient(body) {
  const response = await fetch(`${PROXY_API_DEPOT_URL}/clients`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(body)
  })

  return processResponse(response)
}

export async function getClients() {
  const response = await fetch(`${PROXY_API_DEPOT_URL}/clients`)

  return processResponse(response)
}

export async function createMandataire(body) {
  const response = await fetch(`${PROXY_API_DEPOT_URL}/mandataires`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(body)
  })

  return processResponse(response)
}

export async function getMandataire(mandataireId) {
  const response = await fetch(`${PROXY_API_DEPOT_URL}/mandataires/${mandataireId}`)

  return processResponse(response)
}

export async function getMandataires() {
  const response = await fetch(`${PROXY_API_DEPOT_URL}/mandataires`)

  return processResponse(response)
}

export async function createChefDeFile(body) {
  const response = await fetch(`${PROXY_API_DEPOT_URL}/chefs-de-file`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(body)
  })

  return processResponse(response)
}

export async function getChefDeFile(chefDeFileId) {
  const response = await fetch(`${PROXY_API_DEPOT_URL}/chefs-de-file/${chefDeFileId}`)

  return processResponse(response)
}

export async function getChefsDeFile() {
  const response = await fetch(`${PROXY_API_DEPOT_URL}/chefs-de-file`)

  return processResponse(response)
}

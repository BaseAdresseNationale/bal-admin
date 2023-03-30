const NEXT_PUBLIC_BAL_ADMIN_URL = process.env.NEXT_PUBLIC_BAL_ADMIN_URL || 'http://localhost:3000'
const PROXY_API_DEPOT_URL = NEXT_PUBLIC_BAL_ADMIN_URL + '/api/proxy-api-depot'
const PROXY_API_DEPOT_DEMO_URL = NEXT_PUBLIC_BAL_ADMIN_URL + '/api/proxy-api-depot-demo'

async function processResponse(response) {
  if (!response.ok) {
    const body = await response.json()
    throw new Error(body.message)
  }

  return response.json()
}

function getProxyURL(isDemo) {
  return isDemo ? PROXY_API_DEPOT_DEMO_URL : PROXY_API_DEPOT_URL
}

export async function getClient(clientId, isDemo) {
  const response = await fetch(`${getProxyURL(isDemo)}/clients/${clientId}`)

  return processResponse(response)
}

export async function updateClient(clientId, body, isDemo) {
  const response = await fetch(`${getProxyURL(isDemo)}/clients/${clientId}`, {
    method: 'PUT',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(body)
  })

  return processResponse(response)
}

export async function createClient(body, isDemo) {
  const response = await fetch(`${getProxyURL(isDemo)}/clients`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(body)
  })

  return processResponse(response)
}

export async function getClients(isDemo) {
  const response = await fetch(`${getProxyURL(isDemo)}/clients`)

  return processResponse(response)
}

export async function createMandataire(body, isDemo) {
  const response = await fetch(`${getProxyURL(isDemo)}/mandataires`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(body)
  })

  return processResponse(response)
}

export async function getMandataire(mandataireId, isDemo) {
  const response = await fetch(`${getProxyURL(isDemo)}/mandataires/${mandataireId}`)

  return processResponse(response)
}

export async function getMandataires(isDemo) {
  const response = await fetch(`${getProxyURL(isDemo)}/mandataires`)

  return processResponse(response)
}

export async function createChefDeFile(body, isDemo) {
  const response = await fetch(`${getProxyURL(isDemo)}/chefs-de-file`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(body)
  })

  return processResponse(response)
}

export async function getChefDeFile(chefDeFileId, isDemo) {
  const response = await fetch(`${getProxyURL(isDemo)}/chefs-de-file/${chefDeFileId}`)

  return processResponse(response)
}

export async function getChefsDeFile(isDemo) {
  const response = await fetch(`${getProxyURL(isDemo)}/chefs-de-file`)

  return processResponse(response)
}

const NEXT_PUBLIC_API_MOISSONEUR_BAL = process.env.NEXT_PUBLIC_API_MOISSONEUR_BAL || 'https://plateforme-bal.adresse.data.gouv.fr/moissonneur'
const NEXT_PUBLIC_BAL_ADMIN_URL = process.env.NEXT_PUBLIC_BAL_ADMIN_URL || 'http://localhost:3000'
const PROXY_API_MOISSONNEUR_BAL = NEXT_PUBLIC_BAL_ADMIN_URL + '/api/proxy-api-moissonneur-bal'

export async function getFile(id) {
  const result = await fetch(`${NEXT_PUBLIC_API_MOISSONEUR_BAL}/files/${id}/download`)

  if (!result.ok) {
    const error = await result.json()
    throw new Error(error.message)
  }

  return result
}

export async function getSources() {
  const result = await fetch(`${NEXT_PUBLIC_API_MOISSONEUR_BAL}/sources`)

  if (!result.ok) {
    const error = await result.json()
    throw new Error(error.message)
  }

  return result.json()
}

export async function getSource(id) {
  const result = await fetch(`${NEXT_PUBLIC_API_MOISSONEUR_BAL}/sources/${id}`)

  if (!result.ok) {
    const error = await result.json()
    throw new Error(error.message)
  }

  return result.json()
}

export async function getSourceHarvests(id, limit, page = 1) {
  const result = await fetch(`${NEXT_PUBLIC_API_MOISSONEUR_BAL}/sources/${id}/harvests?` + new URLSearchParams({
    limit,
    offset: limit * (page - 1),
  }))

  if (!result.ok) {
    const error = await result.json()
    throw new Error(error.message)
  }

  return result.json()
}

export async function getSourceCurrentRevisions(id) {
  const result = await fetch(`${NEXT_PUBLIC_API_MOISSONEUR_BAL}/sources/${id}/current-revisions`)

  if (!result.ok) {
    const error = await result.json()
    throw new Error(error.message)
  }

  return result.json()
}

export async function getHarvest(id) {
  const result = await fetch(`${NEXT_PUBLIC_API_MOISSONEUR_BAL}/harvests/${id}`)

  if (!result.ok) {
    const error = await result.json()
    throw new Error(error.message)
  }

  return result.json()
}

export async function getHarvestRevisions(id) {
  const result = await fetch(`${NEXT_PUBLIC_API_MOISSONEUR_BAL}/harvests/${id}/revisions`)

  if (!result.ok) {
    const error = await result.json()
    throw new Error(error.message)
  }

  return result.json()
}

export async function harvestSource(id) {
  const result = await fetch(`${PROXY_API_MOISSONNEUR_BAL}/sources/${id}/harvest`, {
    method: 'POST'
  })

  if (!result.ok) {
    const error = await result.json()
    throw new Error(error.message)
  }

  return result.json()
}

export async function udpateSource(id, changes) {
  const result = await fetch(`${PROXY_API_MOISSONNEUR_BAL}/sources/${id}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(changes)
  })

  if (!result.ok) {
    const error = await result.json()
    throw new Error(error.message)
  }

  return result.json()
}

export async function publishRevision(id, body) {
  const result = await fetch(`${PROXY_API_MOISSONNEUR_BAL}/revisions/${id}/publish`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!result.ok) {
    const error = await result.json()
    throw new Error(error.message)
  }

  return result.json()
}

export async function getRevisionsByCommune(codeCommune) {
  const result = await fetch(`${PROXY_API_MOISSONNEUR_BAL}/communes/${codeCommune}/revisions`)

  if (!result.ok) {
    const error = await result.json()
    throw new Error(error.message)
  }

  return result.json()
}

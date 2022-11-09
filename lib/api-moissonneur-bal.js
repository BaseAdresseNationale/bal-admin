const NEXT_PUBLIC_API_MOISSONEUR_BAL = process.env.NEXT_PUBLIC_API_MOISSONEUR_BAL || 'https://plateforme.adresse.data.gouv.fr'
const NEXT_PUBLIC_BAL_ADMIN_URL = process.env.NEXT_PUBLIC_BAL_ADMIN_URL || 'https://bal-admin.anct.gouv.fr'

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

export async function getSourceHarvests(id) {
  const result = await fetch(`${NEXT_PUBLIC_API_MOISSONEUR_BAL}/sources/${id}/harvests`)

  if (!result.ok) {
    const error = await result.json()
    throw new Error(error.message)
  }

  return result.json()
}

export async function harvestSource(id) {
  const result = await fetch(`${NEXT_PUBLIC_BAL_ADMIN_URL}/proxy-api-moissonneur-bal/sources/${id}/harvest`, {
    method: 'POST'
  })

  if (!result.ok) {
    const error = await result.json()
    throw new Error(error.message)
  }

  return result.json()
}

export async function udpateSource(id, changes) {
  const result = await fetch(`${NEXT_PUBLIC_BAL_ADMIN_URL}/proxy-api-moissonneur-bal/sources/${id}`, {
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


const NEXT_PUBLIC_API_MOISSONEUR_BAL = process.env.NEXT_PUBLIC_API_MOISSONEUR_BAL || 'https://plateforme.adresse.data.gouv.fr'

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

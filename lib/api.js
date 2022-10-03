const process = require('process')

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export async function getFilePreview(file) {
  const result = await fetch(`${API_URL}/preview`, {
    method: 'POST',
    headers: {
      'content-type': 'text/csv'
    },
    body: file
  })

  if (!result.ok) {
    const error = await result.json()
    throw new Error(error.message)
  }

  return result.json()
}

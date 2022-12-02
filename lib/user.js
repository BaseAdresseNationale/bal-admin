const NEXT_PUBLIC_BAL_ADMIN_URL = process.env.NEXT_PUBLIC_BAL_ADMIN_URL || 'http://localhost:3000'

export async function getUser() {
  const res = await fetch(`${NEXT_PUBLIC_BAL_ADMIN_URL}/api/admin`)
  return res.json()
}

export async function login(password) {
  return fetch(`${NEXT_PUBLIC_BAL_ADMIN_URL}/api/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({password}),
  })
}


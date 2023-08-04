import type {UserType} from '../types/user'

// eslint-disable-next-line @typescript-eslint/naming-convention
const NEXT_PUBLIC_BAL_ADMIN_URL = process.env.NEXT_PUBLIC_BAL_ADMIN_URL || 'http://localhost:3000'

export async function getUser(): Promise<UserType | undefined> {
  const res = await fetch(`${NEXT_PUBLIC_BAL_ADMIN_URL}/api/admin`)

  if (res.ok) {
    const user = await res.json() as UserType
    return user
  }
}

export async function login(password: string) {
  return fetch(`${NEXT_PUBLIC_BAL_ADMIN_URL}/api/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({password}),
  })
}


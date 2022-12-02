import {useState, useEffect} from 'react'
import Router from 'next/router'
import {getUser} from '@/lib/user'

export function useUser() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchAdmin() {
      setIsLoading(true)
      const user = await getUser()

      if (user && user.isAdmin) {
        setIsAdmin(user.isAdmin)
        setIsLoading(false)
      } else {
        Router.push('/login')
      }
    }

    fetchAdmin()
  }, [])

  return [isAdmin, isLoading]
}

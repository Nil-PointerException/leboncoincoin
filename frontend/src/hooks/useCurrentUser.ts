/**
 * Hook to get the current user from the backend API
 * This returns the full User object with role, unlike useUserSafe which returns Clerk's UserResource
 */

import { useState, useEffect } from 'react'
import { useAuthSafe } from './useAuthSafe'
import { userApi, setAuthToken } from '@/services/api'
import type { User } from '@/types'

export function useCurrentUser() {
  const { isSignedIn, getToken } = useAuthSafe()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (!isSignedIn) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const token = await getToken()
        setAuthToken(token)
        
        const userData = await userApi.getCurrentUser()
        setUser(userData)
        setError(null)
      } catch (err) {
        console.error('Error fetching current user:', err)
        setError(err instanceof Error ? err : new Error('Unknown error'))
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [isSignedIn, getToken])

  return {
    user,
    loading,
    error,
    isAdmin: user?.role === 'ADMIN',
  }
}



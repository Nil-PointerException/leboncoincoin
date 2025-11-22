/**
 * Safe wrapper for Clerk's useUser hook
 * In dev mode: uses DevAuthContext
 * In prod mode: uses real Clerk
 * Both provide the same hooks (useAuth, useUser)
 */

import { useUser as useClerkUser } from '@clerk/clerk-react'
import { useUser as useDevUser } from '@/contexts/DevAuthContext'

const isDev = !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
              import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.trim() === ''

export function useUserSafe() {
  // In dev mode, use DevAuthContext
  // In prod mode, use Clerk
  // Both have the same interface!
  if (isDev) {
    return useDevUser()
  }
  return useClerkUser()
}


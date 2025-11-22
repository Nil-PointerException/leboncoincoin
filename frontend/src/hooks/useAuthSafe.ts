/**
 * Safe wrapper for Clerk's useAuth hook
 * In dev mode: uses DevAuthContext
 * In prod mode: uses real Clerk
 * Both provide the same hooks (useAuth, useUser)
 */

import { useAuth as useClerkAuth } from '@clerk/clerk-react'
import { useAuth as useDevAuth } from '@/contexts/DevAuthContext'

const isDev = !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
              import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.trim() === ''

export function useAuthSafe() {
  // In dev mode, use DevAuthContext
  // In prod mode, use Clerk
  // Both have the same interface!
  if (isDev) {
    return useDevAuth()
  }
  return useClerkAuth()
}


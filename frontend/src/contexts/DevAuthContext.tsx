/**
 * DevAuthContext - Emulates Clerk's auth context for development mode
 * Provides the same hooks as Clerk (useAuth, useUser) but with dev data
 */

import React, { createContext, useContext, ReactNode } from 'react'
import type { UserResource } from '@clerk/types'

// Mock user data for dev mode
const devUserData: Partial<UserResource> = {
  id: 'dev-user-123',
  fullName: 'Dev User',
  firstName: 'Dev',
  lastName: 'User',
  primaryEmailAddress: {
    emailAddress: 'dev@lmc.local',
    id: 'email-dev',
  } as any,
  emailAddresses: [{
    emailAddress: 'dev@lmc.local',
    id: 'email-dev',
  }] as any[],
  imageUrl: 'https://www.gravatar.com/avatar/dev?s=200&d=mp',
  hasImage: true,
} as Partial<UserResource>

// Context for dev auth state
interface DevAuthContextType {
  isLoaded: boolean
  isSignedIn: boolean
  user: UserResource | null
  getToken: () => Promise<string | null>
}

const DevAuthContext = createContext<DevAuthContextType | null>(null)

export function DevAuthProvider({ children }: { children: ReactNode }) {
  const authState: DevAuthContextType = {
    isLoaded: true,
    isSignedIn: true,
    user: devUserData as UserResource,
    getToken: async () => 'fake-dev-token',
  }

  return (
    <DevAuthContext.Provider value={authState}>
      {children}
    </DevAuthContext.Provider>
  )
}

// Hook that emulates Clerk's useAuth
export function useAuth() {
  const context = useContext(DevAuthContext)
  if (!context) {
    throw new Error('useAuth must be used within DevAuthProvider')
  }
  return {
    isLoaded: context.isLoaded,
    isSignedIn: context.isSignedIn,
    getToken: context.getToken,
  }
}

// Hook that emulates Clerk's useUser
export function useUser() {
  const context = useContext(DevAuthContext)
  if (!context) {
    throw new Error('useUser must be used within DevAuthProvider')
  }
  return {
    isLoaded: context.isLoaded,
    isSignedIn: context.isSignedIn,
    user: context.user,
  }
}


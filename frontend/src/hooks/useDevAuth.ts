/**
 * Custom hook to handle authentication in dev mode (without Clerk)
 * Returns mock authentication state and user data when Clerk is not configured
 */

import type { UserResource } from '@clerk/types'

const isDev = !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
              import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.trim() === ''

// Mock user data for dev mode
const devUserData: Partial<UserResource> = {
  id: 'dev-user-123',
  fullName: 'Dev User',
  primaryEmailAddress: {
    emailAddress: 'dev@leboncoincoin.local',
  } as any,
  imageUrl: 'https://www.gravatar.com/avatar/dev?s=200&d=mp',
} as Partial<UserResource>

export function useDevAuth() {
  // In dev mode without Clerk, we're always "authenticated"
  // The backend accepts all requests with test user
  if (isDev) {
    return {
      isDevLoaded: true,
      isDevSignedIn: true,
      isDev: true,
      devUser: devUserData as UserResource,
      getDevToken: async () => 'fake-dev-token',
    }
  }

  // In production mode with Clerk, this won't be used
  return {
    isDevLoaded: false,
    isDevSignedIn: false,
    isDev: false,
    devUser: null,
    getDevToken: async () => null,
  }
}


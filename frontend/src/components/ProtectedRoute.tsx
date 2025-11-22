import { Navigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { Box, CircularProgress } from '@mui/material'
import { useDevAuth } from '@/hooks/useDevAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const devAuth = useDevAuth()
  
  // Use dev auth if Clerk is not configured
  let isLoaded = devAuth.isLoaded
  let isSignedIn = devAuth.isSignedIn
  
  // Use Clerk if configured
  if (!devAuth.isDev) {
    const clerkAuth = useUser()
    isLoaded = clerkAuth.isLoaded
    isSignedIn = clerkAuth.isSignedIn
  }

  if (!isLoaded) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    )
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />
  }

  return <>{children}</>
}


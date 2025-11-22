import { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
} from '@mui/material'
import { userApi, setAuthToken } from '@/services/api'
import { useDevAuth } from '@/hooks/useDevAuth'
import ListingCard from '@/components/ListingCard'
import type { Listing } from '@/types'

const isDev = !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
              import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.trim() === ''

export default function ProfilePage() {
  const devAuth = useDevAuth()
  const clerkUser = isDev ? null : useUser()
  const clerkAuth = isDev ? null : useAuth()
  
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Get token in prod mode only
        if (!isDev && clerkAuth) {
          const token = await clerkAuth.getToken()
          setAuthToken(token)
        }
        
        const data = await userApi.getCurrentUserListings()
        console.log('Profile API Response:', data) // Debug
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setListings(data)
        } else {
          console.error('API did not return an array:', data)
          setListings([])
          setError('Format de données incorrect. Vérifiez que le backend est démarré.')
        }
      } catch (err: any) {
        console.error('Error fetching user listings:', err)
        
        if (err.response) {
          console.error('Response status:', err.response.status)
          console.error('Response data:', err.response.data)
          setError(`Erreur serveur (${err.response.status})`)
        } else if (err.request) {
          setError('Impossible de contacter le serveur. Vérifiez que le backend est démarré sur http://localhost:8080')
        } else {
          setError('Erreur lors du chargement de vos annonces')
        }
        setListings([])
      } finally {
        setLoading(false)
      }
    }

    fetchUserListings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Get user info from Clerk or dev mode
  const user = isDev ? null : clerkUser?.user
  const displayName = isDev ? 'Dev User' : (user?.fullName || 'Mon Profil')
  const displayEmail = isDev ? 'dev@lmc.local' : (user?.primaryEmailAddress?.emailAddress || '')
  const displayAvatar = isDev ? undefined : user?.imageUrl

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper sx={{ p: 4, mb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar
            src={displayAvatar}
            alt={displayName}
            sx={{ width: 80, height: 80, bgcolor: isDev ? 'warning.main' : 'primary.main' }}
          >
            {displayName.charAt(0)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" fontWeight={700}>
              {displayName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {displayEmail}
            </Typography>
            {isDev && (
              <Chip 
                label="Mode Développement" 
                color="warning" 
                size="small" 
                sx={{ mt: 1 }} 
              />
            )}
          </Box>
        </Paper>

        <Typography variant="h5" gutterBottom fontWeight={600}>
          Mes annonces ({listings.length})
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" my={8}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 4 }}>
            {error}
          </Alert>
        ) : listings.length === 0 ? (
          <Box textAlign="center" my={8}>
            <Typography variant="h6" color="text.secondary">
              Vous n'avez pas encore créé d'annonce
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {listings.map((listing) => (
              <Grid item xs={12} sm={6} md={4} key={listing.id}>
                <ListingCard listing={listing} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  )
}


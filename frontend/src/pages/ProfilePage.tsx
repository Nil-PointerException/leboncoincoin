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
} from '@mui/material'
import { userApi, setAuthToken } from '@/services/api'
import ListingCard from '@/components/ListingCard'
import type { Listing } from '@/types'

export default function ProfilePage() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        setLoading(true)
        setError(null)
        const token = await getToken()
        setAuthToken(token)
        const data = await userApi.getCurrentUserListings()
        setListings(data)
      } catch (err) {
        console.error('Error fetching user listings:', err)
        setError('Erreur lors du chargement de vos annonces')
      } finally {
        setLoading(false)
      }
    }

    fetchUserListings()
  }, [getToken])

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper sx={{ p: 4, mb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar
            src={user?.imageUrl}
            alt={user?.fullName || user?.primaryEmailAddress?.emailAddress}
            sx={{ width: 80, height: 80 }}
          />
          <Box>
            <Typography variant="h4" fontWeight={700}>
              {user?.fullName || 'Mon Profil'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.primaryEmailAddress?.emailAddress}
            </Typography>
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


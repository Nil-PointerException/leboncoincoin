import { useEffect, useState } from 'react'
import { Container, Grid, Typography, Box, CircularProgress, Alert, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { favoritesApi } from '@/services/api'
import ListingCard from '@/components/ListingCard'
import { useAuthSafe } from '@/hooks/useAuthSafe'
import type { Listing } from '@/types'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { isSignedIn, isLoaded } = useAuthSafe()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/sign-in')
      return
    }

    if (isSignedIn) {
      fetchFavorites()
    }
  }, [isSignedIn, isLoaded, navigate])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await favoritesApi.getFavoriteListings()
      setListings(data)
    } catch (err: any) {
      console.error('Error fetching favorites:', err)
      setError('Erreur lors du chargement des favoris.')
      setListings([])
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteChange = () => {
    // Refresh the favorites list when a favorite is removed
    fetchFavorites()
  }

  if (!isLoaded || loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" my={8}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FavoriteIcon color="error" fontSize="large" />
          <Typography variant="h3" component="h1" fontWeight={700}>
            Mes Favoris
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Retrouvez tous vos articles favoris en un seul endroit
        </Typography>
      </Box>

      {error ? (
        <Alert severity="error" sx={{ my: 4 }}>
          {error}
        </Alert>
      ) : listings.length === 0 ? (
        <Box textAlign="center" my={8}>
          <FavoriteIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" paragraph>
            Vous n'avez pas encore de favoris
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Ajoutez des articles à vos favoris pour les retrouver facilement plus tard
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Découvrir des annonces
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {listings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} key={listing.id}>
              <ListingCard listing={listing} onFavoriteChange={handleFavoriteChange} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}




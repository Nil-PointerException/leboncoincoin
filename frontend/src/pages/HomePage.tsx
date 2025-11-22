import { useEffect, useState } from 'react'
import { Container, Grid, Typography, Box, CircularProgress, Alert } from '@mui/material'
import { useAuth } from '@clerk/clerk-react'
import { listingsApi, setAuthToken } from '@/services/api'
import { useDevAuth } from '@/hooks/useDevAuth'
import ListingCard from '@/components/ListingCard'
import ListingFilters from '@/components/ListingFilters'
import type { Listing, ListingFilter } from '@/types'

const isDev = !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
              import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.trim() === ''

export default function HomePage() {
  const devAuth = useDevAuth()
  const clerkAuth = isDev ? null : useAuth()
  
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchListings = async (filters?: ListingFilter) => {
    try {
      setLoading(true)
      setError(null)
      
      // Set auth token if using Clerk in production
      if (!isDev && clerkAuth) {
        const token = await clerkAuth.getToken()
        setAuthToken(token)
      }
      
      const data = await listingsApi.getAll(filters)
      console.log('API Response:', data) // Debug
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setListings(data)
      } else {
        console.error('API did not return an array:', data)
        setListings([])
        setError('Format de données incorrect reçu du serveur')
      }
    } catch (err: any) {
      console.error('Error fetching listings:', err)
      
      // More detailed error message
      if (err.response) {
        console.error('Response status:', err.response.status)
        console.error('Response data:', err.response.data)
        setError(`Erreur serveur (${err.response.status}): ${err.response.statusText}`)
      } else if (err.request) {
        setError('Impossible de contacter le serveur. Vérifiez que le backend est démarré sur http://localhost:8080')
      } else {
        setError('Erreur lors du chargement des annonces.')
      }
      setListings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFilter = (filters: ListingFilter) => {
    fetchListings(filters)
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Petites Annonces
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Découvrez des milliers d'annonces près de chez vous
        </Typography>
      </Box>

      <ListingFilters onFilter={handleFilter} />

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
            Aucune annonce trouvée
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
    </Container>
  )
}


import { useEffect, useState } from 'react'
import { Container, Grid, Typography, Box, CircularProgress, Alert } from '@mui/material'
import { listingsApi } from '@/services/api'
import ListingCard from '@/components/ListingCard'
import ListingFilters from '@/components/ListingFilters'
import type { Listing, ListingFilter } from '@/types'

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchListings = async (filters?: ListingFilter) => {
    try {
      setLoading(true)
      setError(null)
      const data = await listingsApi.getAll(filters)
      setListings(data)
    } catch (err) {
      console.error('Error fetching listings:', err)
      setError('Erreur lors du chargement des annonces')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
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


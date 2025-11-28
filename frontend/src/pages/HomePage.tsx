import { useEffect, useState } from 'react'
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material'
import { listingsApi } from '@/services/api'
import ListingCard from '@/components/ListingCard'
import ListingFilters from '@/components/ListingFilters'
import { PrimaryDuckButton } from '@/components/ui'
import type { Listing, ListingFilter } from '@/types'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchListings = async (filters?: ListingFilter) => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await listingsApi.getAll(filters)
      
      if (Array.isArray(data)) {
        setListings(data)
      } else {
        console.error('❌ API did not return an array')
        console.error('   Type:', typeof data)
        console.error('   Value:', data)
        console.error('   💡 Vérifiez que le backend est démarré avec le bon profil (dev ou clerk)')
        setListings([])
        setError('Format de données incorrect reçu du serveur. Vérifiez que le backend est configuré correctement.')
      }
    } catch (err: any) {
      console.error('Error fetching listings:', err)
      
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
  }, [])

  const handleFilter = (filters: ListingFilter) => {
    fetchListings(filters)
  }

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          color: 'text.primary',
          py: { xs: 5, md: 8 },
          mb: 5,
          borderBottom: '1px solid #F3F4F6',
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '3rem' },
                color: 'text.primary',
              }}
            >
              Trouvez tout ce qu&apos;il vous faut
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                maxWidth: 600,
                fontSize: { xs: '1rem', md: '1.1rem' },
                color: 'text.secondary',
              }}
            >
              Achetez, vendez et échangez en toute simplicité
            </Typography>

            <PrimaryDuckButton
              size="large"
              onClick={() => navigate('/create')}
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                fontSize: '1rem',
                px: 5,
                py: 1.5,
                mt: 1,
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 14px 30px rgba(17, 24, 39, 0.15)',
                },
              }}
            >
              Déposer une annonce
            </PrimaryDuckButton>
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg">
        {/* Filters */}
        <Box sx={{ mb: 4 }}>
          <ListingFilters onFilter={handleFilter} />
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        )}

        {/* Listings Grid */}
        {!loading && !error && (
          <>
            {listings.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 12,
                }}
              >
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                  🦆 Aucune annonce trouvée
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Soyez le premier à poster une annonce !
                </Typography>
                <PrimaryDuckButton
                  size="large"
                  onClick={() => navigate('/create')}
                >
                  Créer une annonce
                </PrimaryDuckButton>
              </Box>
            ) : (
              <>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {listings.length} annonce{listings.length > 1 ? 's' : ''} disponible{listings.length > 1 ? 's' : ''}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                    Les plus récentes en premier
                  </Typography>
                </Box>
                
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  {listings.map((listing) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={listing.id}>
                      <ListingCard listing={listing} />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </>
        )}
      </Container>
    </>
  )
}

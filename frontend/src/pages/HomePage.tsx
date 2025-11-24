import { useEffect, useState } from 'react'
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Stack,
  Paper,
  alpha,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
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

  // Stats pour le hero section
  const stats = [
    { icon: <SearchIcon sx={{ fontSize: 40 }} />, value: listings.length, label: 'Annonces disponibles' },
    { icon: <TrendingUpIcon sx={{ fontSize: 40 }} />, value: '10k+', label: 'Utilisateurs actifs' },
    { icon: <LocalOfferIcon sx={{ fontSize: 40 }} />, value: '500+', label: 'Ventes par jour' },
  ]

  return (
    <>
      {/* Hero Section - Plus compact */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #FFD700 0%, #FF9500 100%)',
          color: 'white',
          py: { xs: 4, md: 6 },
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Stack spacing={2.5} alignItems="center" textAlign="center">
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                textShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              🦆 Trouvez tout ce qu'il vous faut
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                maxWidth: 600,
                opacity: 0.95,
                fontSize: { xs: '0.95rem', md: '1.1rem' },
                textShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              Achetez, vendez et échangez en toute simplicité
            </Typography>

            <PrimaryDuckButton
              size="large"
              onClick={() => navigate('/create')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                fontSize: '1rem',
                px: 4,
                py: 1.25,
                mt: 1,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                },
              }}
            >
              Déposer une annonce
            </PrimaryDuckButton>

            {/* Stats - Plus compact */}
            <Grid container spacing={2} sx={{ mt: 2, maxWidth: 800 }}>
              {stats.map((stat, index) => (
                <Grid item xs={4} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 1.5, md: 2 },
                      textAlign: 'center',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <Box sx={{ color: 'primary.main', mb: 0.5 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', fontSize: { xs: '1.25rem', md: '1.75rem' } }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.7rem', md: '0.875rem' } }}>
                      {stat.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>

        {/* Wave decoration - Plus petit */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 40,
            background: 'white',
            clipPath: 'ellipse(100% 100% at 50% 100%)',
          }}
        />
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

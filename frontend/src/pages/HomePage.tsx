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
import SEO from '@/components/SEO'
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
      <SEO
        title="LeBonCoinCoin - Petites Annonces en ligne | Acheter, Vendre, Échanger"
        description="Découvrez des milliers d'annonces de particuliers et professionnels. Trouvez ce que vous cherchez ou vendez vos objets facilement. Plateforme sécurisée et gratuite pour petites annonces."
        keywords="petites annonces, acheter, vendre, échanger, occasion, leboncoincoin, marketplace, annonces gratuites, vente entre particuliers"
        url={typeof window !== 'undefined' ? window.location.href : ''}
      />
      
      {/* Hero Section */}
      <Box
        component="header"
        role="banner"
        sx={{
          backgroundColor: '#FFFFFF',
          color: 'text.primary',
          py: { xs: 5, md: 8 },
          mb: 5,
          borderBottom: '1px solid #F3F4F6',
        }}
        aria-label="En-tête principal"
      >
        <Container maxWidth="lg">
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography
              component="h1"
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
              component="p"
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
              aria-label="Déposer une annonce"
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
                '&:focus-visible': {
                  outline: '3px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: '2px',
                },
              }}
            >
              Déposer une annonce
            </PrimaryDuckButton>
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" component="main" role="main">
        {/* Filters */}
        <Box 
          component="section"
          aria-label="Filtres de recherche"
          sx={{ mb: 4 }}
        >
          <ListingFilters onFilter={handleFilter} />
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            role="alert"
            aria-live="assertive"
            sx={{ mb: 3, borderRadius: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading && (
          <Box 
            sx={{ display: 'flex', justifyContent: 'center', py: 8 }}
            role="status"
            aria-label="Chargement des annonces en cours"
          >
            <CircularProgress 
              size={60} 
              thickness={4}
              aria-hidden="false"
            />
            <Box component="span" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
              Chargement des annonces en cours...
            </Box>
          </Box>
        )}

        {/* Listings Grid */}
        {!loading && !error && (
          <>
            {listings.length === 0 ? (
              <Box
                component="section"
                aria-labelledby="empty-listings-heading"
                sx={{
                  textAlign: 'center',
                  py: 12,
                }}
              >
                <Typography 
                  id="empty-listings-heading"
                  component="h2"
                  variant="h4" 
                  sx={{ mb: 2, fontWeight: 700 }}
                >
                  🦆 Aucune annonce trouvée
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Soyez le premier à poster une annonce !
                </Typography>
                <PrimaryDuckButton
                  size="large"
                  onClick={() => navigate('/create')}
                  aria-label="Créer une annonce"
                >
                  Créer une annonce
                </PrimaryDuckButton>
              </Box>
            ) : (
              <>
                <Box 
                  component="section"
                  aria-labelledby="listings-heading"
                  sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography 
                    id="listings-heading"
                    component="h2"
                    variant="h5" 
                    sx={{ fontWeight: 700, color: 'text.primary' }}
                  >
                    {listings.length} annonce{listings.length > 1 ? 's' : ''} disponible{listings.length > 1 ? 's' : ''}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                  >
                    Les plus récentes en premier
                  </Typography>
                </Box>
                
                <Grid 
                  container 
                  spacing={{ xs: 2, md: 3 }}
                  component="ul"
                  sx={{ listStyle: 'none', p: 0, m: 0 }}
                  role="list"
                  aria-label="Liste des annonces"
                >
                  {listings.map((listing) => (
                    <Grid 
                      item 
                      xs={12} 
                      sm={6} 
                      md={4} 
                      lg={3} 
                      key={listing.id}
                      component="li"
                    >
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

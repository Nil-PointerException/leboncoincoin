import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  Avatar,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Button from '@mui/material/Button'
import { listingsApi } from '@/services/api'
import ListingCard from '@/components/ListingCard'
import type { Listing } from '@/types'

export default function SellerPage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSellerListings = async () => {
      if (!userId) return

      try {
        setLoading(true)
        setError(null)
        const data = await listingsApi.getByUserId(userId)
        
        if (Array.isArray(data)) {
          setListings(data)
        } else {
          setListings([])
          setError('Format de données incorrect reçu du serveur.')
        }
      } catch (err: any) {
        console.error('Error fetching seller listings:', err)
        if (err.response?.status === 404) {
          setError('Vendeur non trouvé')
        } else {
          setError('Erreur lors du chargement des annonces du vendeur')
        }
        setListings([])
      } finally {
        setLoading(false)
      }
    }

    fetchSellerListings()
  }, [userId])

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" my={8}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error || listings.length === 0) {
    return (
      <Container>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
          Retour aux annonces
        </Button>
        <Alert severity={error ? 'error' : 'info'} sx={{ my: 4 }}>
          {error || 'Ce vendeur n\'a pas encore publié d\'annonce'}
        </Alert>
      </Container>
    )
  }

  // Récupérer les infos du vendeur depuis la première annonce
  const sellerName = listings[0]?.userName || 'Vendeur'
  const sellerEmail = listings[0]?.userEmail

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 3 }}>
          Retour aux annonces
        </Button>

        {/* En-tête du vendeur */}
        <Paper sx={{ p: 4, mb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar
            sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}
          >
            {sellerName.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" fontWeight={700}>
              {sellerName}
            </Typography>
            {sellerEmail && (
              <Typography variant="body2" color="text.secondary">
                {sellerEmail}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {listings.length} annonce{listings.length > 1 ? 's' : ''} disponible{listings.length > 1 ? 's' : ''}
            </Typography>
          </Box>
        </Paper>

        {/* Liste des annonces */}
        <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
          Toutes les annonces de {sellerName}
        </Typography>

        <Grid container spacing={3}>
          {listings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} key={listing.id}>
              <ListingCard listing={listing} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  )
}


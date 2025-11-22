import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import {
  Container,
  Box,
  Typography,
  Button,
  Chip,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  ImageList,
  ImageListItem,
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CategoryIcon from '@mui/icons-material/Category'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'
import { listingsApi } from '@/services/api'
import type { Listing } from '@/types'

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useUser()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return

      try {
        setLoading(true)
        const data = await listingsApi.getById(id)
        setListing(data)
      } catch (err) {
        console.error('Error fetching listing:', err)
        setError("Erreur lors du chargement de l'annonce")
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [id])

  const handleDelete = async () => {
    if (!id || !window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return

    try {
      await listingsApi.delete(id)
      navigate('/profile')
    } catch (err) {
      console.error('Error deleting listing:', err)
      alert("Erreur lors de la suppression de l'annonce")
    }
  }

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" my={8}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error || !listing) {
    return (
      <Container>
        <Alert severity="error" sx={{ my: 4 }}>
          {error || 'Annonce non trouvée'}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
          Retour aux annonces
        </Button>
      </Container>
    )
  }

  const isOwner = user?.id === listing.userId
  const images = listing.imageUrls?.length > 0 
    ? listing.imageUrls 
    : ['https://via.placeholder.com/800x600?text=No+Image']

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
          Retour aux annonces
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <ImageList cols={1} gap={8}>
              {images.map((url, index) => (
                <ImageListItem key={index}>
                  <img
                    src={url}
                    alt={`${listing.title} - ${index + 1}`}
                    loading="lazy"
                    style={{ borderRadius: 8, maxHeight: 500, objectFit: 'cover' }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
                {listing.title}
              </Typography>

              <Typography variant="h3" color="primary" gutterBottom fontWeight={700}>
                {listing.price ? listing.price.toFixed(2) : '0.00'} €
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <Chip icon={<CategoryIcon />} label={listing.category} color="primary" />
                <Chip icon={<LocationOnIcon />} label={listing.location} variant="outlined" />
              </Box>

              <Typography variant="h6" gutterBottom fontWeight={600}>
                Description
              </Typography>
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                {listing.description}
              </Typography>

              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                Publié le {new Date(listing.createdAt).toLocaleDateString('fr-FR')}
              </Typography>

              {isOwner && (
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                >
                  Supprimer l'annonce
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}


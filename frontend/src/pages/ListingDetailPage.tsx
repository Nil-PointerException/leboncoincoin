import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUserSafe } from '@/hooks/useUserSafe'
import { useAuthSafe } from '@/hooks/useAuthSafe'
import { useCurrentUser } from '@/hooks/useCurrentUser'
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MessageIcon from '@mui/icons-material/Message'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { listingsApi, setAuthToken, favoritesApi } from '@/services/api'
import { messagingApi } from '@/services/messagingApi'
import type { Listing } from '@/types'
import ImageSlider from '@/components/ImageSlider'
import { getCategoryIcon } from '@/constants/categoryIcons'
import { formatPrice } from '@/utils'

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user: clerkUser, isSignedIn } = useUserSafe()
  const { isAdmin } = useCurrentUser()
  const { getToken } = useAuthSafe()

  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [initialMessage, setInitialMessage] = useState('')
  const [contacting, setContacting] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteFeedback, setDeleteFeedback] = useState<{
    reason: 'SOLD' | 'NO_LONGER_AVAILABLE' | 'OTHER'
    wasSold: boolean | null
  }>({
    reason: 'SOLD',
    wasSold: null,
  })

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

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (id && isSignedIn) {
        try {
          const status = await favoritesApi.getFavoriteStatus(id)
          setIsFavorited(status.isFavorited)
        } catch (err) {
          console.error('Error checking favorite status:', err)
        }
      }
    }

    checkFavoriteStatus()
  }, [id, isSignedIn])

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!id) return

    try {
      await listingsApi.delete(id, deleteFeedback)
      navigate('/profile')
    } catch (err) {
      console.error('Error deleting listing:', err)
      alert("Erreur lors de la suppression de l'annonce")
    }
  }

  const handleContactSeller = async () => {
    if (!id || !initialMessage.trim()) return

    try {
      setContacting(true)
      const token = await getToken()
      setAuthToken(token)
      
      const conversation = await messagingApi.createConversation({
        listingId: id,
        initialMessage: initialMessage.trim(),
      })
      
      // Redirect to the conversation
      navigate(`/conversations/${conversation.id}`)
    } catch (err) {
      console.error('Error creating conversation:', err)
      alert('Erreur lors de la création de la conversation')
    } finally {
      setContacting(false)
      setContactDialogOpen(false)
      setInitialMessage('')
    }
  }

  const handleToggleFavorite = async () => {
    if (!id || !isSignedIn) {
      navigate('/sign-in')
      return
    }

    setFavoriteLoading(true)
    try {
      if (isFavorited) {
        await favoritesApi.removeFavorite(id)
        setIsFavorited(false)
      } else {
        await favoritesApi.addFavorite(id)
        setIsFavorited(true)
      }
    } catch (err) {
      console.error('Error toggling favorite:', err)
      alert('Erreur lors de la modification des favoris')
    } finally {
      setFavoriteLoading(false)
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

  const isOwner = clerkUser?.id === listing.userId
  const images = listing.imageUrls?.length > 0 
    ? listing.imageUrls 
    : ['https://via.placeholder.com/800x600?text=No+Image']

  const CategoryIcon = getCategoryIcon(listing.category)

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
          Retour aux annonces
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <ImageSlider images={images} alt={listing.title} />
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
                {listing.title}
              </Typography>

              <Typography variant="h3" color="primary" gutterBottom fontWeight={700}>
                {listing.price ? `${formatPrice(listing.price)} €` : '0 €'}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <Chip icon={<CategoryIcon fontSize="small" />} label={listing.category} color="primary" />
                <Chip icon={<LocationOnIcon />} label={listing.location} variant="outlined" />
              </Box>

              <Typography variant="h6" gutterBottom fontWeight={600}>
                Description
              </Typography>
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                {listing.description}
              </Typography>

              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                Publié le {new Date(listing.createdAt).toLocaleDateString('fr-FR')} par{' '}
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate(`/seller/${listing.userId}`)}
                  sx={{
                    textTransform: 'none',
                    fontSize: 'inherit',
                    fontWeight: 600,
                    color: 'primary.main',
                    p: 0,
                    minWidth: 'auto',
                    '&:hover': {
                      textDecoration: 'underline',
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  {listing.userName}
                </Button>
                {listing.updatedAt && listing.updatedAt !== listing.createdAt && (
                  <> • Modifié le {new Date(listing.updatedAt).toLocaleDateString('fr-FR')}</>
                )}
              </Typography>

              {isOwner ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/listings/${id}/edit`)}
                  >
                    Modifier l'annonce
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteClick}
                  >
                    Supprimer l'annonce
                  </Button>
                </Box>
              ) : isAdmin ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteClick}
                    sx={{
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        bgcolor: 'error.main',
                        color: 'white',
                      },
                    }}
                  >
                    🛡️ Supprimer (Admin)
                  </Button>
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    Vous allez supprimer une annonce en tant qu'administrateur.
                  </Alert>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<MessageIcon />}
                    onClick={() => {
                      if (!isSignedIn) {
                        navigate('/sign-in')
                      } else {
                        setContactDialogOpen(true)
                      }
                    }}
                  >
                    Contacter le vendeur
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color={isFavorited ? "error" : "primary"}
                    size="large"
                    startIcon={isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    onClick={handleToggleFavorite}
                    disabled={favoriteLoading}
                  >
                    {isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Contacter le vendeur</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Envoyez un message au vendeur pour cette annonce : <strong>{listing?.title}</strong>
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Votre message"
            placeholder="Bonjour, je suis intéressé(e) par votre annonce..."
            value={initialMessage}
            onChange={(e) => setInitialMessage(e.target.value)}
            variant="outlined"
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialogOpen(false)} disabled={contacting}>
            Annuler
          </Button>
          <Button
            onClick={handleContactSeller}
            variant="contained"
            disabled={!initialMessage.trim() || contacting}
            startIcon={contacting ? <CircularProgress size={20} /> : <MessageIcon />}
          >
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog with Feedback */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Supprimer l'annonce</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Avant de supprimer votre annonce, aidez-nous à améliorer notre service :
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              Pourquoi supprimez-vous cette annonce ?
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
              <Button
                variant={deleteFeedback.reason === 'SOLD' ? 'contained' : 'outlined'}
                onClick={() => setDeleteFeedback({ ...deleteFeedback, reason: 'SOLD', wasSold: true })}
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
              >
                ✅ J'ai vendu l'article
              </Button>
              <Button
                variant={deleteFeedback.reason === 'NO_LONGER_AVAILABLE' ? 'contained' : 'outlined'}
                onClick={() => setDeleteFeedback({ ...deleteFeedback, reason: 'NO_LONGER_AVAILABLE', wasSold: false })}
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
              >
                ❌ L'article n'est plus disponible
              </Button>
              <Button
                variant={deleteFeedback.reason === 'OTHER' ? 'contained' : 'outlined'}
                onClick={() => setDeleteFeedback({ ...deleteFeedback, reason: 'OTHER', wasSold: null })}
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
              >
                🔄 Autre raison
              </Button>
            </Box>
          </Box>

          {deleteFeedback.reason === 'SOLD' && (
            <Alert severity="success" sx={{ mb: 2 }}>
              🎉 Félicitations pour votre vente ! Ces données nous aident à améliorer le service.
            </Alert>
          )}

          {deleteFeedback.reason === 'NO_LONGER_AVAILABLE' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Merci pour votre retour. Nous espérons que vous trouverez une solution prochainement.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Confirmer la suppression
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}


import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthSafe } from '@/hooks/useAuthSafe'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  MenuItem,
  Autocomplete,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { listingsApi, uploadApi, setAuthToken } from '@/services/api'
import { CATEGORIES } from '@/constants/categories'
import { searchLocations, type LocationSuggestion } from '@/services/locationApi'
import type { Listing, CreateListingRequest } from '@/types'
import CategorySelect from '@/components/CategorySelect'

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getToken } = useAuthSafe()
  
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([])
  const [locationLoading, setLocationLoading] = useState(false)

  const [formData, setFormData] = useState<CreateListingRequest>({
    title: '',
    description: '',
    price: 0,
    category: '',
    location: '',
    imageUrls: [],
  })

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return

      try {
        setFetchLoading(true)
        const listing: Listing = await listingsApi.getById(id)
        
        setFormData({
          title: listing.title,
          description: listing.description,
          price: listing.price,
          category: listing.category,
          location: listing.location,
          imageUrls: listing.imageUrls || [],
        })
        
        setUploadedImages(listing.imageUrls || [])
      } catch (err) {
        console.error('Error fetching listing:', err)
        setError("Erreur lors du chargement de l'annonce")
      } finally {
        setFetchLoading(false)
      }
    }

    fetchListing()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Check max images limit
    if (uploadedImages.length + files.length > 10) {
      setError("Maximum 10 images autorisées")
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Get token for authentication
      const token = await getToken()
      setAuthToken(token)

      for (const file of Array.from(files)) {
        // Get presigned URL
        const { uploadUrl, publicUrl } = await uploadApi.getPresignedUrl(file.name, file.type)

        // Upload to S3
        await uploadApi.uploadToS3(uploadUrl, file)

        // Add to uploaded images
        setUploadedImages((prev) => [...prev, publicUrl])
      }
    } catch (err) {
      console.error('Error uploading image:', err)
      setError("Erreur lors de l'upload de l'image")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleLocationSearch = async (query: string) => {
    if (query.length < 2) {
      setLocationSuggestions([])
      return
    }

    setLocationLoading(true)
    try {
      const suggestions = await searchLocations(query)
      setLocationSuggestions(suggestions)
    } catch (error) {
      console.error('Error searching locations:', error)
    } finally {
      setLocationLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      // Get token for authentication
      const token = await getToken()
      setAuthToken(token)

      const request = {
        ...formData,
        imageUrls: uploadedImages,
      }

      const listing = await listingsApi.update(id, request)
      navigate(`/listings/${listing.id}`)
    } catch (err) {
      console.error('Error updating listing:', err)
      setError("Erreur lors de la modification de l'annonce")
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" my={8}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error && !formData.title) {
    return (
      <Container>
        <Alert severity="error" sx={{ my: 4 }}>
          {error}
        </Alert>
        <Button onClick={() => navigate('/')}>
          Retour aux annonces
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          Modifier l'annonce
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            required
            label="Titre"
            name="title"
            value={formData.title}
            onChange={handleChange}
            inputProps={{ maxLength: 100 }}
            helperText={`${formData.title.length}/100 caractères`}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            required
            multiline
            rows={4}
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            inputProps={{ maxLength: 5000 }}
            helperText={`${formData.description.length}/5000 caractères. Minimum 10 caractères.`}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            required
            type="number"
            label="Prix (€)"
            name="price"
            value={formData.price}
            onChange={handleChange}
            inputProps={{ min: 0, max: 999999999.99, step: 0.01 }}
            helperText="Maximum: 999 999 999.99 €"
            sx={{ mb: 2 }}
          />

          <CategorySelect
            value={formData.category}
            onChange={(category) => setFormData((prev) => ({ ...prev, category: category || '' }))}
            required
            helperText="Sélectionnez la catégorie qui correspond le mieux à votre annonce"
            sx={{ mb: 2 }}
          />

          <Autocomplete
            fullWidth
            freeSolo
            options={locationSuggestions}
            getOptionLabel={(option) => 
              typeof option === 'string' ? option : `${option.city} (${option.postcode})`
            }
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon fontSize="small" color="action" />
                <Box>
                  <Typography variant="body2">{option.city}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.postcode} - {option.context}
                  </Typography>
                </Box>
              </Box>
            )}
            inputValue={formData.location}
            onInputChange={(_, newValue) => {
              setFormData((prev) => ({ ...prev, location: newValue }))
              handleLocationSearch(newValue)
            }}
            onChange={(_, newValue) => {
              const location = typeof newValue === 'string' 
                ? newValue 
                : newValue 
                  ? `${newValue.city} (${newValue.postcode})` 
                  : ''
              setFormData((prev) => ({ ...prev, location }))
            }}
            loading={locationLoading}
            loadingText="Recherche..."
            noOptionsText="Aucune ville trouvée"
            renderInput={(params) => (
              <TextField
                {...params}
                required
                label="Localisation"
                placeholder="Commencez à taper une ville..."
                helperText="Ex: Paris, Lyon, Marseille..."
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <LocationOnIcon color="action" sx={{ mr: 1 }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
            sx={{ mb: 3 }}
          />

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
              Images
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
              disabled={uploading}
              sx={{ mb: 2 }}
            >
              {uploading ? 'Upload en cours...' : 'Ajouter des images'}
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>

            {uploadedImages.length > 0 && (
              <ImageList cols={3} gap={8}>
                {uploadedImages.map((url, index) => (
                  <ImageListItem key={index}>
                    <img src={url} alt={`Upload ${index + 1}`} loading="lazy" />
                    <ImageListItemBar
                      actionIcon={
                        <IconButton
                          sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                          onClick={() => handleRemoveImage(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || uploading}
            >
              {loading ? <CircularProgress size={24} /> : 'Enregistrer les modifications'}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => navigate(`/listings/${id}`)}
              disabled={loading}
            >
              Annuler
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}



import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Autocomplete,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { listingsApi, uploadApi, setAuthToken } from '@/services/api'
import { searchLocations, type LocationSuggestion } from '@/services/locationApi'
import type { CreateListingRequest } from '@/types'
import CategorySelect from '@/components/CategorySelect'
import { CATEGORY_KEYWORDS } from '@/constants/categoryKeywords'

type FieldErrors = Partial<Record<'title' | 'description' | 'location' | 'price', string>>

export default function CreateListingPage() {
  const navigate = useNavigate()
  const { getToken } = useAuthSafe()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([])
  const [locationLoading, setLocationLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [imageError, setImageError] = useState<string | null>(null)
  const [categoryLocked, setCategoryLocked] = useState(false)

  const [formData, setFormData] = useState<CreateListingRequest>({
    title: '',
    description: '',
    price: 0,
    category: '',
    location: '',
    imageUrls: [],
  })

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[field]) {
        return prev
      }
      const { [field]: _removed, ...rest } = prev
      return rest
    })
  }

  const guessCategoryFromTitle = (title: string) => {
    const normalized = title.toLowerCase()
    for (const mapping of CATEGORY_KEYWORDS) {
      if (mapping.keywords.some((keyword) => normalized.includes(keyword))) {
        return mapping.category
      }
    }
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'title' || name === 'description' || name === 'location' || name === 'price') {
      clearFieldError(name as keyof FieldErrors)
    }
    setFormData((prev) => ({
      ...prev,
      ...(name === 'title'
        ? (() => {
            const updates: Partial<CreateListingRequest> = { title: value }
            if (!categoryLocked) {
              const guessedCategory = guessCategoryFromTitle(value)
              if (guessedCategory) {
                updates.category = guessedCategory
              }
            }
            return updates
          })()
        : { [name]: name === 'price' ? parseFloat(value) || 0 : value }),
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
        setUploadedImages((prev) => {
          const next = [...prev, publicUrl]
          if (next.length > 0) {
            setImageError(null)
          }
          return next
        })
      }
    } catch (err) {
      console.error('Error uploading image:', err)
      setError("Erreur lors de l'upload de l'image")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => {
      const next = prev.filter((_, i) => i !== index)
      if (next.length === 0) {
        setImageError("Ajoutez au moins une image pour publier votre annonce.")
      }
      return next
    })
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

  const validateForm = () => {
    const errors: FieldErrors = {}
    const titleLength = formData.title.trim().length
    const descriptionLength = formData.description.trim().length
    const locationLength = formData.location.trim().length

    if (titleLength < 3 || titleLength > 100) {
      errors.title = 'Title must be between 3 and 100 characters'
    }
    if (descriptionLength < 10 || descriptionLength > 5000) {
      errors.description = 'Description must be between 10 and 5000 characters'
    }
    if (locationLength < 2 || locationLength > 100) {
      errors.location = 'Location must be between 2 and 100 characters'
    }
    if (!formData.price || formData.price <= 0) {
      errors.price = 'Le prix est obligatoire et doit être supérieur à 0'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      setError('Merci de corriger les erreurs indiquées.')
      return
    }

    if (uploadedImages.length === 0) {
      const message = "L'ajout d'au moins une image est obligatoire."
      setImageError(message)
      setError(message)
      return
    }

    setLoading(true)

    try {
      // Get token for authentication
      const token = await getToken()
      setAuthToken(token)

      const request = {
        ...formData,
        imageUrls: uploadedImages,
      }

      const listing = await listingsApi.create(request)
      if (!listing?.id) {
        throw new Error("Réponse invalide du serveur : identifiant manquant")
      }

      navigate(`/listings/${listing.id}`)
    } catch (err) {
      console.error('Error creating listing:', err)
      const message =
        err instanceof Error ? err.message : "Erreur lors de la création de l'annonce"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          Créer une annonce
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
            error={Boolean(fieldErrors.title)}
            helperText={
              fieldErrors.title
                ? fieldErrors.title
                : `${formData.title.length}/100 caractères (minimum 3)`
            }
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
            error={Boolean(fieldErrors.description)}
            helperText={
              fieldErrors.description
                ? fieldErrors.description
                : `${formData.description.length}/5000 caractères. Minimum 10 caractères.`
            }
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
            error={Boolean(fieldErrors.price)}
            helperText={
              fieldErrors.price ? fieldErrors.price : 'Maximum: 999 999 999.99 €'
            }
            sx={{ mb: 2 }}
          />

          <CategorySelect
            value={formData.category}
          onChange={(category) => {
            setCategoryLocked(Boolean(category))
            setFormData((prev) => ({ ...prev, category: category || '' }))
          }}
            required
          helperText={
            !categoryLocked && formData.category
              ? 'Catégorie suggérée automatiquement à partir du titre. Vous pouvez la modifier.'
              : 'Sélectionnez la catégorie qui correspond le mieux à votre annonce'
          }
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
              clearFieldError('location')
              handleLocationSearch(newValue)
            }}
            onChange={(_, newValue) => {
              const location = typeof newValue === 'string' 
                ? newValue 
                : newValue 
                  ? `${newValue.city} (${newValue.postcode})` 
                  : ''
              setFormData((prev) => ({ ...prev, location }))
              clearFieldError('location')
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
                error={Boolean(fieldErrors.location)}
                helperText={fieldErrors.location ?? 'Ex: Paris, Lyon, Marseille...'}
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

            {imageError && (
              <Typography variant="body2" color="error" sx={{ mb: uploadedImages.length ? 2 : 0 }}>
                {imageError}
              </Typography>
            )}

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
              {loading ? <CircularProgress size={24} /> : 'Créer l\'annonce'}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => navigate('/')}
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


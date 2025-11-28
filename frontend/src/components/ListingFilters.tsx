import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Paper,
  InputAdornment,
  Autocomplete,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  FormControlLabel,
  Switch,
  Slider,
  Divider,
  Tooltip,
  CircularProgress,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import EuroIcon from '@mui/icons-material/Euro'
import TuneIcon from '@mui/icons-material/Tune'
import CloseIcon from '@mui/icons-material/Close'
import { CATEGORIES } from '@/constants/categories'
import { searchLocations, type LocationSuggestion } from '@/services/locationApi'
import { getCurrentCity } from '@/services/geolocationApi'
import type { ListingFilter } from '@/types'
import CategorySelect from '@/components/CategorySelect'
import { getCategoryIcon } from '@/constants/categoryIcons'
import { guessCategoryFromText } from '@/constants/categoryKeywords'

interface ListingFiltersProps {
  onFilter: (filters: ListingFilter) => void
}

export default function ListingFilters({ onFilter }: ListingFiltersProps) {
  const [filters, setFilters] = useState<ListingFilter>({})
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([])
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationInputValue, setLocationInputValue] = useState('')
  const [locationValue, setLocationValue] = useState<LocationSuggestion | string | null>(null)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [geolocating, setGeolocating] = useState(false)
  const [categoryLocked, setCategoryLocked] = useState(false)

  const handleSearch = () => {
    onFilter(filters)
  }

  const handleReset = () => {
    setFilters({})
    setLocationInputValue('')
    setLocationValue(null)
    setCategoryLocked(false)
    onFilter({})
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

  const handleGeolocation = async () => {
    setGeolocating(true)
    try {
      console.log('📍 Début de la géolocalisation...')
      const city = await getCurrentCity()
      console.log('📍 Ville obtenue:', city)
      
      if (city && city.city) {
        const locationLabel = city.label || `${city.city}${city.postcode ? ` (${city.postcode})` : ''}`
        console.log('📍 Label de localisation:', locationLabel)
        
        // Créer un objet LocationSuggestion pour l'Autocomplete
        const locationSuggestion: LocationSuggestion = {
          label: locationLabel,
          city: city.city,
          postcode: city.postcode || '',
          context: city.postcode || city.city,
        }
        
        setLocationInputValue(locationLabel)
        setLocationValue(locationSuggestion)
        const newFilters = { ...filters, location: locationLabel }
        setFilters(newFilters)
        
        // Rechercher aussi les suggestions pour afficher dans l'autocomplete
        if (city.city) {
          await handleLocationSearch(city.city)
        }
        
        // Appliquer le filtre automatiquement
        onFilter(newFilters)
        
        console.log('✅ Géolocalisation réussie, ville:', locationLabel)
      } else {
        console.warn('⚠️ Impossible de déterminer la ville depuis la géolocalisation', city)
        alert('Impossible de déterminer votre ville. Veuillez la saisir manuellement.')
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de la géolocalisation:', error)
      alert(`Erreur de géolocalisation: ${error.message || 'Erreur inconnue'}`)
    } finally {
      setGeolocating(false)
    }
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 50,
          border: '1px solid #E5E7EB',
          backgroundColor: '#FFFFFF',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 1 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'stretch',
            gap: { xs: 1.5, md: 0 },
            minHeight: { md: 64 },
          }}
        >
          {/* Recherche textuelle */}
          <Box
            sx={{
              flex: { md: '1 1 40%' },
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                right: 0,
                top: '20%',
                bottom: '20%',
                width: '1px',
                backgroundColor: '#E5E7EB',
                display: { xs: 'none', md: 'block' },
              },
            }}
          >
            <TextField
              fullWidth
              placeholder="Que recherchez-vous ?"
              value={filters.search || ''}
              onChange={(e) => {
                const searchValue = e.target.value
                const newFilters: ListingFilter = { ...filters, search: searchValue }
                
                // Auto-detect category from search text if category is not locked
                if (!categoryLocked && searchValue.trim().length > 0) {
                  const guessedCategory = guessCategoryFromText(searchValue)
                  if (guessedCategory) {
                    newFilters.category = guessedCategory
                  }
                }
                
                setFilters(newFilters)
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start" sx={{ ml: 2 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#F5F5F7',
                      }}
                    >
                      <SearchIcon sx={{ color: '#6B7280', fontSize: 22 }} />
                    </Box>
                  </InputAdornment>
                ),
                sx: {
                  px: 2,
                  py: { xs: 1.5, md: 0 },
                  height: { md: 64 },
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  fontWeight: 500,
                  color: 'text.primary',
                  '&::placeholder': {
                    color: 'text.secondary',
                    opacity: 0.7,
                  },
                }
              }}
            />
          </Box>

          {/* Catégorie */}
          <Box
            sx={{
              flex: { md: '0 1 24%' },
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                right: 0,
                top: '20%',
                bottom: '20%',
                width: '1px',
                backgroundColor: '#E5E7EB',
                display: { xs: 'none', md: 'block' },
              },
            }}
          >
            <CategorySelect
              value={filters.category || ''}
              onChange={(category) => {
                setCategoryLocked(Boolean(category))
                setFilters({ ...filters, category })
              }}
              variant="standard"
              disableUnderline
              hideLabel
              customRenderValue={(selected: any) => {
                if (!selected) {
                  const DefaultIcon = getCategoryIcon(undefined)
                  return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary' }}>
                      <DefaultIcon sx={{ fontSize: 24, color: 'primary.main' }} />
                      <Typography sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, fontWeight: 500 }}>
                        Toutes catégories
                      </Typography>
                    </Box>
                  )
                }
                const CategoryIcon = getCategoryIcon(selected as any)
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CategoryIcon sx={{ fontSize: 24, color: 'primary.main' }} />
                    <Typography sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, fontWeight: 600 }}>
                      {selected}
                    </Typography>
                  </Box>
                )
              }}
              sx={{
                '& .MuiInput-root': {
                  px: 2,
                  py: { xs: 1.5, md: 0 },
                  height: { md: 64 },
                  display: 'flex',
                  alignItems: 'center',
                },
              }}
            />
          </Box>

          {/* Localisation */}
          <Box
            sx={{
              flex: { md: '0 1 24%' },
              position: 'relative',
            }}
          >
            <Autocomplete
              fullWidth
              freeSolo
              options={locationSuggestions}
              value={locationValue}
              getOptionLabel={(option) => 
                typeof option === 'string' ? option : `${option.city} (${option.postcode})`
              }
              renderOption={(props, option) => (
                <Box 
                  component="li" 
                  {...props} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5,
                    py: 1.5,
                    '&:hover': {
                    bgcolor: 'rgba(17, 24, 39, 0.05)',
                    },
                  }}
                >
                  <LocationOnIcon fontSize="small" sx={{ color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>{option.city}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.postcode} - {option.context}
                    </Typography>
                  </Box>
                </Box>
              )}
              inputValue={locationInputValue}
              onInputChange={(_, newValue) => {
                setLocationInputValue(newValue)
                handleLocationSearch(newValue)
              }}
              onChange={(_, newValue) => {
                const location = typeof newValue === 'string' 
                  ? newValue 
                  : newValue 
                    ? `${newValue.city} (${newValue.postcode})` 
                    : ''
                setLocationValue(newValue)
                setFilters({ ...filters, location: location || undefined })
              }}
              loading={locationLoading}
              loadingText="Recherche en cours..."
              noOptionsText="Aucune ville trouvée"
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  placeholder="Localisation"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                    startAdornment: (
                      <>
                        <InputAdornment position="start" sx={{ ml: 2 }}>
                          <LocationOnIcon sx={{ color: 'text.secondary', fontSize: 22 }} />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                    endAdornment: (
                      <>
                        {params.InputProps.endAdornment}
                        <InputAdornment position="end" sx={{ mr: 1 }}>
                          <Tooltip title="Utiliser ma position actuelle">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleGeolocation()
                              }}
                              disabled={geolocating}
                              sx={{
                                color: 'text.secondary',
                                '&:hover': {
                                  bgcolor: 'rgba(17,24,39,0.05)',
                                },
                              }}
                            >
                              {geolocating ? (
                                <CircularProgress size={20} />
                              ) : (
                                <MyLocationIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      </>
                    ),
                    sx: {
                      px: 2,
                      py: { xs: 1.5, md: 0 },
                      height: { md: 64 },
                      fontSize: { xs: '0.95rem', md: '1rem' },
                      fontWeight: 500,
                    }
                  }}
                />
              )}
            />
          </Box>

          {/* Boutons d'action */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 1.25, md: 1.5 }}
            alignItems="stretch"
            justifyContent="flex-end"
            sx={{ flex: { md: '0 0 auto' }, width: { xs: '100%', md: 'auto' } }}
          >
            {/* Bouton Rechercher */}
            <Button
              variant="contained"
              onClick={handleSearch}
              startIcon={<SearchIcon sx={{ fontSize: 22 }} />}
              sx={{
                minWidth: { xs: '100%', md: 170 },
                px: { xs: 3.5, md: 4 },
                py: { xs: 1.3, md: 0 },
                height: { md: 60 },
                fontSize: { xs: '1rem', md: '1rem' },
                borderRadius: 999,
                boxShadow: 'none',
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Trouver
            </Button>

            {/* Bouton Filtres avancés */}
            <Tooltip title="Filtres avancés" arrow>
              <Button
                variant="contained"
                onClick={() => setAdvancedOpen(true)}
                sx={{
                  minWidth: { xs: '100%', md: 64 },
                  px: { xs: 3, md: 0 },
                  py: { xs: 1.3, md: 0 },
                  height: { md: 60 },
                  borderRadius: 999,
                  bgcolor: '#111827',
                  color: 'white',
                  boxShadow: 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: '#1F2937',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                <TuneIcon sx={{ fontSize: 26 }} />
              </Button>
            </Tooltip>

            {/* Bouton Reset */}
            <Tooltip title="Réinitialiser tous les filtres" arrow>
              <IconButton
                onClick={handleReset}
                sx={{
                  borderRadius: 999,
                  px: { xs: 1, md: 1.5 },
                  height: { xs: 48, md: 60 },
                  bgcolor: 'rgba(17, 24, 39, 0.04)',
                  color: 'text.secondary',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(17, 24, 39, 0.08)',
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <RestartAltIcon sx={{ fontSize: 24 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Paper>

      {/* Ligne de filtres rapides (prix) - Collapsible */}
      {(filters.minPrice || filters.maxPrice) && (
        <Box 
          sx={{ 
            display: 'flex',
            gap: 2,
            p: 2,
            bgcolor: 'grey.50',
            borderTop: '2px solid',
            borderColor: 'divider',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            Filtres actifs:
          </Typography>
          {filters.minPrice && (
            <Chip
              label={`Min: ${filters.minPrice}€`}
              onDelete={() => setFilters({ ...filters, minPrice: undefined })}
              color="primary"
              size="small"
            />
          )}
          {filters.maxPrice && (
            <Chip
              label={`Max: ${filters.maxPrice}€`}
              onDelete={() => setFilters({ ...filters, maxPrice: undefined })}
              color="primary"
              size="small"
            />
          )}
        </Box>
      )}

      {/* Advanced Filters Dialog */}
      <Dialog 
        open={advancedOpen} 
        onClose={() => setAdvancedOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TuneIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Filtres avancés
            </Typography>
          </Box>
          <IconButton onClick={() => setAdvancedOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={4}>
            {/* Prix Range Slider */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EuroIcon fontSize="small" color="primary" />
                Fourchette de prix
              </Typography>
              <Box sx={{ px: 2, pt: 2 }}>
                <Slider
                  value={[filters.minPrice || 0, filters.maxPrice || 10000]}
                  onChange={(_, newValue) => {
                    const [min, max] = newValue as number[]
                    setFilters({ 
                      ...filters, 
                      minPrice: min > 0 ? min : undefined,
                      maxPrice: max < 10000 ? max : undefined 
                    })
                  }}
                  valueLabelDisplay="auto"
                  min={0}
                  max={10000}
                  step={50}
                  marks={[
                    { value: 0, label: '0€' },
                    { value: 2500, label: '2500€' },
                    { value: 5000, label: '5000€' },
                    { value: 7500, label: '7500€' },
                    { value: 10000, label: '10k€' },
                  ]}
                  sx={{
                    '& .MuiSlider-thumb': {
                      bgcolor: 'primary.main',
                    },
                    '& .MuiSlider-track': {
                      bgcolor: 'primary.main',
                    },
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <TextField
                  label="Prix minimum"
                  type="number"
                  value={filters.minPrice || ''}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><EuroIcon fontSize="small" /></InputAdornment>,
                  }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Prix maximum"
                  type="number"
                  value={filters.maxPrice || ''}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><EuroIcon fontSize="small" /></InputAdornment>,
                  }}
                  sx={{ flex: 1 }}
                />
              </Box>
            </Box>

            <Divider />

            {/* Multiple Categories Selection */}
            <Box>
              {(() => {
                const DefaultCategoryIcon = getCategoryIcon(undefined)
                return (
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DefaultCategoryIcon fontSize="small" color="primary" />
                    Catégories multiples
                  </Typography>
                )
              })()}
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Sélectionnez une ou plusieurs catégories
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {CATEGORIES.map((category) => {
                  const CategoryIcon = getCategoryIcon(category)
                  return (
                    <Chip
                      key={category}
                      label={category}
                      onClick={() => {
                        // Toggle category (pour l'instant, on garde une seule catégorie)
                        const newCategory = filters.category === category ? undefined : category
                        setCategoryLocked(Boolean(newCategory))
                        setFilters({ 
                          ...filters, 
                          category: newCategory
                        })
                      }}
                      color={filters.category === category ? 'primary' : 'default'}
                      variant={filters.category === category ? 'filled' : 'outlined'}
                      icon={<CategoryIcon fontSize="small" />}
                      sx={{
                        fontWeight: filters.category === category ? 700 : 400,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    />
                  )
                })}
              </Box>
            </Box>

            <Divider />

            {/* Sort Options (future) */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                🔮 Fonctionnalités à venir
              </Typography>
              <Stack spacing={1.5}>
                <FormControlLabel
                  control={<Switch disabled />}
                  label="Trier par pertinence"
                />
                <FormControlLabel
                  control={<Switch disabled />}
                  label="Afficher les annonces urgentes en premier"
                />
                <Typography variant="caption" color="text.secondary" sx={{ pl: 4 }}>
                  Ces fonctionnalités seront disponibles prochainement
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button
            onClick={() => {
              setFilters({})
              setLocationInputValue('')
              setCategoryLocked(false)
            }}
            startIcon={<RestartAltIcon />}
            color="secondary"
          >
            Réinitialiser
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button
            onClick={() => setAdvancedOpen(false)}
            variant="outlined"
          >
            Annuler
          </Button>
          <Button
            onClick={() => {
              handleSearch()
              setAdvancedOpen(false)
            }}
            variant="contained"
            startIcon={<FilterListIcon />}
            sx={{ minWidth: 120 }}
          >
            Appliquer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}


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

interface ListingFiltersProps {
  onFilter: (filters: ListingFilter) => void
}

export default function ListingFilters({ onFilter }: ListingFiltersProps) {
  const [filters, setFilters] = useState<ListingFilter>({})
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([])
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationInputValue, setLocationInputValue] = useState('')
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [geolocating, setGeolocating] = useState(false)

  const handleSearch = () => {
    onFilter(filters)
  }

  const handleReset = () => {
    setFilters({})
    setLocationInputValue('')
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
      const city = await getCurrentCity()
      if (city) {
        const locationLabel = city.label || `${city.city}${city.postcode ? ` (${city.postcode})` : ''}`
        setLocationInputValue(locationLabel)
        setFilters({ ...filters, location: locationLabel })
        // Rechercher aussi les suggestions pour afficher dans l'autocomplete
        await handleLocationSearch(city.city)
      } else {
        console.warn('Impossible de déterminer la ville depuis la géolocalisation')
      }
    } catch (error: any) {
      console.error('Error getting current location:', error)
      // On pourrait afficher un message d'erreur à l'utilisateur ici
    } finally {
      setGeolocating(false)
    }
  }

  return (
    <Box sx={{ mb: 4 }}>
      {/* Conteneur principal avec shadow et border */}
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: '50px',
          overflow: 'hidden',
          background: 'white',
          border: '5px solid',
          borderColor: 'primary.main',
          boxShadow: '0 10px 40px rgba(255, 215, 0, 0.15)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 15px 50px rgba(255, 215, 0, 0.25)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        {/* Barre de recherche principale */}
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'stretch',
            minHeight: { md: '60px' },
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
                top: '15%',
                bottom: '15%',
                width: '2px',
                background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.1), transparent)',
                display: { xs: 'none', md: 'block' },
              },
            }}
          >
            <TextField
              fullWidth
              placeholder="Que recherchez-vous ?"
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start" sx={{ ml: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFC107 100%)',
                        boxShadow: '0 3px 10px rgba(255, 215, 0, 0.3)',
                      }}
                    >
                      <SearchIcon sx={{ color: '#212121', fontSize: 24 }} />
                    </Box>
                  </InputAdornment>
                ),
                sx: {
                  px: 2,
                  py: { xs: 2, md: 0 },
                  height: { md: '60px' },
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
                top: '15%',
                bottom: '15%',
                width: '2px',
                background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.1), transparent)',
                display: { xs: 'none', md: 'block' },
              },
            }}
          >
            <CategorySelect
              value={filters.category || ''}
              onChange={(category) => setFilters({ ...filters, category })}
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
                  py: { xs: 2, md: 0 },
                  height: { md: '60px' },
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
                      bgcolor: 'primary.lighter',
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
                setFilters({ ...filters, location: location || undefined })
              }}
              loading={locationLoading}
              loadingText="Recherche en cours..."
              noOptionsText="Aucune ville trouvée"
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  placeholder="Ville ou code postal"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                    startAdornment: (
                      <>
                        <InputAdornment position="start" sx={{ ml: 2 }}>
                          <LocationOnIcon sx={{ color: 'primary.main', fontSize: 22 }} />
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
                                color: 'primary.main',
                                '&:hover': {
                                  bgcolor: 'primary.lighter',
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
                      py: { xs: 2, md: 0 },
                      height: { md: '60px' },
                      fontSize: { xs: '0.95rem', md: '1rem' },
                      fontWeight: 500,
                    }
                  }}
                />
              )}
            />
          </Box>

          {/* Boutons d'action */}
          <Box 
            sx={{ 
              display: 'flex',
              gap: 0,
              alignItems: 'stretch',
              flex: { md: '0 0 auto' },
            }}
          >
            {/* Bouton Rechercher */}
            <Button
              variant="contained"
              onClick={handleSearch}
              startIcon={<SearchIcon sx={{ fontSize: 22 }} />}
              sx={{
                minWidth: { xs: '100%', md: 150 },
                px: { xs: 3, md: 3 },
                py: { xs: 2, md: 0 },
                height: { md: '60px' },
                fontWeight: 800,
                fontSize: { xs: '0.95rem', md: '1rem' },
                borderRadius: 0,
                background: 'linear-gradient(135deg, #FFD700 0%, #FFC107 100%)',
                color: '#212121',
                textTransform: 'uppercase',
                letterSpacing: 1,
                boxShadow: 'none',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  transition: 'left 0.5s',
                },
                '&:hover': {
                  background: 'linear-gradient(135deg, #FFC107 0%, #FFD700 100%)',
                  transform: 'scale(1.02)',
                  boxShadow: '0 6px 16px rgba(255, 215, 0, 0.35)',
                  '&::before': {
                    left: '100%',
                  },
                },
                transition: 'all 0.3s ease',
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
                  minWidth: { xs: '50%', md: 60 },
                  px: 2,
                  py: { xs: 2, md: 0 },
                  height: { md: '60px' },
                  borderRadius: 0,
                  bgcolor: 'secondary.main',
                  color: 'white',
                  boxShadow: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'secondary.dark',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <TuneIcon sx={{ fontSize: 26 }} />
              </Button>
            </Tooltip>

            {/* Bouton Reset */}
            <Box sx={{ overflow: 'hidden', borderRadius: '0 50px 50px 0' }}>
              <Tooltip title="Réinitialiser tous les filtres" arrow>
                <IconButton
                  onClick={handleReset}
                  sx={{
                    borderRadius: '0 50px 50px 0',
                    px: 2.5,
                    height: { xs: 'auto', md: '60px' },
                    bgcolor: 'grey.100',
                    color: 'text.secondary',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'rotate(90deg)',
                    },
                  }}
                >
                  <RestartAltIcon sx={{ fontSize: 24 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
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
                        setFilters({ 
                          ...filters, 
                          category: filters.category === category ? undefined : category 
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
                  label="Annonces avec images uniquement"
                />
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


import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import type { Listing } from '@/types'
import { favoritesApi } from '@/services/api'
import { useAuthSafe } from '@/hooks/useAuthSafe'
import { DuckCard, CategoryChip } from './ui'
import { getCategoryIcon } from '@/constants/categoryIcons'
import { formatPrice } from '@/utils'

interface ListingCardProps {
  listing: Listing
  onFavoriteChange?: () => void
}

export default function ListingCard({ listing, onFavoriteChange }: ListingCardProps) {
  const navigate = useNavigate()
  const { isSignedIn } = useAuthSafe()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isSignedIn) {
      checkFavoriteStatus()
    }
  }, [isSignedIn, listing.id])

  const checkFavoriteStatus = async () => {
    try {
      const status = await favoritesApi.getFavoriteStatus(listing.id)
      setIsFavorited(status.isFavorited)
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
  }

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!isSignedIn) {
      navigate('/sign-in')
      return
    }

    setIsLoading(true)
    try {
      if (isFavorited) {
        await favoritesApi.removeFavorite(listing.id)
        setIsFavorited(false)
      } else {
        await favoritesApi.addFavorite(listing.id)
        setIsFavorited(true)
      }
      if (onFavoriteChange) {
        onFavoriteChange()
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClick = () => {
    navigate(`/listings/${listing.id}`)
  }

  const imageUrl = listing.imageUrls?.[0] || 'https://via.placeholder.com/400x300?text=🦆+Pas+d\'image'

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'À l\'instant'
    if (diffInHours < 24) return `Il y a ${diffInHours}h`
    if (diffInHours < 48) return 'Hier'
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `Il y a ${diffInDays}j`
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  const CategoryIcon = getCategoryIcon(listing.category)

  return (
    <DuckCard
      hover
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      tabIndex={0}
      role="article"
      aria-label={`Annonce: ${listing.title} - ${formatPrice(listing.price)}€ à ${listing.location}`}
      sx={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:focus-visible': {
          outline: '3px solid',
          outlineColor: 'primary.main',
          outlineOffset: '2px',
        },
      }}
    >
      {/* Image avec overlay gradient */}
      <Box 
        sx={{ 
          position: 'relative', 
          overflow: 'hidden',
          height: 200,
          backgroundColor: 'grey.100',
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={imageUrl}
          alt={`Photo principale de ${listing.title}`}
          loading="lazy"
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            width: '100%',
            height: '100%',
          }}
        />
        
        {/* Gradient overlay - Plus subtil */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.15) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Favorite button */}
        {isSignedIn && (
          <Tooltip title={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'} arrow>
            <IconButton
              onClick={handleFavoriteClick}
              disabled={isLoading}
              size="small"
              aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              aria-pressed={isFavorited}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
                transition: 'all 0.2s ease',
                width: 36,
                height: 36,
                '&:hover': {
                  backgroundColor: 'white',
                  transform: 'scale(1.15)',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                },
                '&:focus-visible': {
                  outline: '3px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: '2px',
                },
              }}
            >
              {isFavorited ? (
                <FavoriteIcon sx={{ color: '#F44336', fontSize: 20 }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              )}
            </IconButton>
          </Tooltip>
        )}

        {/* Category chip - Plus élégant */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
          }}
        >
          <CategoryChip
            label={listing.category}
            icon={<CategoryIcon fontSize="small" />}
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              fontWeight: 700,
              fontSize: '0.75rem',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
            }}
          />
        </Box>
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
        {/* Price - En évidence */}
        <Box sx={{ mb: 1.5 }}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 900,
              fontSize: '1.5rem',
              color: 'primary.main',
              letterSpacing: '-0.02em',
            }}
          >
            {formatPrice(listing.price)} €
          </Typography>
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            fontSize: '1rem',
            lineHeight: 1.4,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '2.8em',
            color: 'text.primary',
          }}
        >
          {listing.title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 'auto',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.5,
            fontSize: '0.875rem',
          }}
        >
          {listing.description}
        </Typography>

        {/* Footer info - Plus compact */}
        <Box 
          sx={{ 
            mt: 2, 
            pt: 1.5, 
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack spacing={0.5}>
            {/* Location */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOnIcon
                sx={{
                  fontSize: 16,
                  color: 'primary.main',
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.75rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {listing.location}
              </Typography>
            </Box>

            {/* Date */}
            {listing.createdAt && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon
                  sx={{
                    fontSize: 16,
                    color: 'text.disabled',
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 500, fontSize: '0.75rem' }}
                >
                  {listing.updatedAt && listing.updatedAt !== listing.createdAt 
                    ? `Modifié ${formatDate(listing.updatedAt)}`
                    : formatDate(listing.createdAt)
                  }
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </CardContent>
    </DuckCard>
  )
}

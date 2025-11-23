import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import type { Listing } from '@/types'
import { favoritesApi } from '@/services/api'
import { useAuthSafe } from '@/hooks/useAuthSafe'

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
    e.stopPropagation() // Prevent card navigation

    if (!isSignedIn) {
      // Redirect to sign in or show a message
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

  const imageUrl = listing.imageUrls?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={handleClick}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={imageUrl}
          alt={listing.title}
          sx={{ objectFit: 'cover' }}
        />
        {isSignedIn && (
          <Tooltip title={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
            <IconButton
              onClick={handleFavoriteClick}
              disabled={isLoading}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                },
              }}
            >
              {isFavorited ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600, flexGrow: 1 }}>
            {listing.title}
          </Typography>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 700, ml: 1 }}>
            {listing.price.toFixed(2)} €
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {listing.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip label={listing.category} size="small" color="primary" variant="outlined" />
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="caption">{listing.location}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}


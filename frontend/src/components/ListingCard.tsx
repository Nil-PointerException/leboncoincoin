import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import type { Listing } from '@/types'

interface ListingCardProps {
  listing: Listing
}

export default function ListingCard({ listing }: ListingCardProps) {
  const navigate = useNavigate()

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
      <CardMedia
        component="img"
        height="200"
        image={imageUrl}
        alt={listing.title}
        sx={{ objectFit: 'cover' }}
      />
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


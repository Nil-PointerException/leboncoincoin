import { useState } from 'react'
import { Box, IconButton, Paper, Stack, useTheme, alpha } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import CloseIcon from '@mui/icons-material/Close'

interface ImageSliderProps {
  images: string[]
  alt?: string
}

export default function ImageSlider({ images, alt = 'Image' }: ImageSliderProps) {
  const theme = useTheme()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index)
  }

  const handleZoom = () => {
    setIsZoomed(true)
  }

  const handleCloseZoom = () => {
    setIsZoomed(false)
  }

  if (images.length === 0) {
    return (
      <Paper
        sx={{
          height: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',
          borderRadius: 3,
        }}
      >
        <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
          <Box sx={{ fontSize: '4rem', mb: 2 }}>🦆</Box>
          Aucune image disponible
        </Box>
      </Paper>
    )
  }

  return (
    <Box>
      {/* Main Image */}
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'grey.900',
          height: { xs: 300, sm: 400, md: 500 },
        }}
      >
        {/* Current Image */}
        <Box
          component="img"
          src={images[currentIndex]}
          alt={`${alt} - ${currentIndex + 1}`}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Image Counter */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            px: 2,
            py: 0.5,
            borderRadius: 2,
            fontSize: '0.875rem',
            fontWeight: 600,
            backdropFilter: 'blur(8px)',
          }}
        >
          {currentIndex + 1} / {images.length}
        </Box>

        {/* Zoom Button */}
        <IconButton
          onClick={handleZoom}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            backdropFilter: 'blur(8px)',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.85)',
              transform: 'scale(1.05)',
            },
          }}
        >
          <ZoomInIcon />
        </IconButton>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevious}
              sx={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                backdropFilter: 'blur(8px)',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.85)',
                  transform: 'translateY(-50%) scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 20 }} />
            </IconButton>

            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                backdropFilter: 'blur(8px)',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.85)',
                  transform: 'translateY(-50%) scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </>
        )}

        {/* Gradient Overlay at bottom */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)',
            pointerEvents: 'none',
          }}
        />
      </Paper>

      {/* Thumbnails */}
      {images.length > 1 && (
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            mt: 2,
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'grey.100',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: theme.palette.primary.main,
              borderRadius: 4,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
            },
          }}
        >
          {images.map((image, index) => (
            <Paper
              key={index}
              onClick={() => handleThumbnailClick(index)}
              elevation={currentIndex === index ? 8 : 1}
              sx={{
                minWidth: { xs: 80, sm: 100 },
                height: { xs: 60, sm: 75 },
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer',
                border: currentIndex === index ? 3 : 2,
                borderColor: currentIndex === index ? 'primary.main' : 'transparent',
                transition: 'all 0.2s ease',
                opacity: currentIndex === index ? 1 : 0.6,
                '&:hover': {
                  opacity: 1,
                  transform: 'scale(1.05)',
                  borderColor: 'primary.main',
                },
              }}
            >
              <Box
                component="img"
                src={image}
                alt={`Thumbnail ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Paper>
          ))}
        </Stack>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <Box
          onClick={handleCloseZoom}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            cursor: 'zoom-out',
            animation: 'fadeIn 0.2s ease',
            '@keyframes fadeIn': {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleCloseZoom}
            sx={{
              position: 'absolute',
              top: 24,
              right: 24,
              color: 'white',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Image Counter in Zoom */}
          <Box
            sx={{
              position: 'absolute',
              top: 24,
              left: 24,
              color: 'white',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              px: 3,
              py: 1,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {currentIndex + 1} / {images.length}
          </Box>

          {/* Zoomed Image */}
          <Box
            component="img"
            src={images[currentIndex]}
            alt={`${alt} - Zoomed`}
            onClick={(e) => e.stopPropagation()}
            sx={{
              maxWidth: '95%',
              maxHeight: '95%',
              objectFit: 'contain',
              borderRadius: 2,
              boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.5)',
              cursor: 'default',
            }}
          />

          {/* Navigation in Zoom */}
          {images.length > 1 && (
            <>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrevious()
                }}
                sx={{
                  position: 'absolute',
                  left: 24,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-50%) scale(1.1)',
                  },
                }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>

              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                sx={{
                  position: 'absolute',
                  right: 24,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-50%) scale(1.1)',
                  },
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </>
          )}

          {/* Thumbnails in Zoom */}
          {images.length > 1 && (
            <Stack
              direction="row"
              spacing={1}
              onClick={(e) => e.stopPropagation()}
              sx={{
                position: 'absolute',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                maxWidth: '90%',
                overflowX: 'auto',
                p: 1,
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(8px)',
                borderRadius: 2,
                '&::-webkit-scrollbar': {
                  height: 6,
                },
                '&::-webkit-scrollbar-track': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                },
                '&::-webkit-scrollbar-thumb': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: 3,
                },
              }}
            >
              {images.map((image, index) => (
                <Box
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  sx={{
                    minWidth: 60,
                    height: 45,
                    borderRadius: 1,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: 2,
                    borderColor: currentIndex === index ? 'primary.main' : 'transparent',
                    opacity: currentIndex === index ? 1 : 0.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      opacity: 1,
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={image}
                    alt={`Thumb ${index + 1}`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      )}
    </Box>
  )
}



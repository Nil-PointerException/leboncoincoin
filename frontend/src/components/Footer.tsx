import { Box, Container, Typography, Link, Stack, IconButton, Divider } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import GitHubIcon from '@mui/icons-material/GitHub'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import FavoriteIcon from '@mui/icons-material/Favorite'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: 'Navigation',
      links: [
        { label: 'Accueil', path: '/' },
        { label: 'Mes Annonces', path: '/profile' },
        { label: 'Mes Favoris', path: '/favorites' },
        { label: 'Messages', path: '/messages' },
      ],
    },
    {
      title: 'Catégories',
      links: [
        { label: 'Électronique', path: '/?category=Électronique' },
        { label: 'Vêtements', path: '/?category=Vêtements' },
        { label: 'Maison & Jardin', path: '/?category=Maison & Jardin' },
        { label: 'Véhicules', path: '/?category=Véhicules' },
      ],
    },
    {
      title: 'À propos',
      links: [
        { label: 'Qui sommes-nous ?', path: '/about' },
        { label: 'Mentions légales', path: '/legal' },
        { label: 'Confidentialité', path: '/privacy' },
        { label: 'Contact', path: '/contact' },
      ],
    },
  ]

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* Main footer content */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={4}
          sx={{ mb: 4 }}
        >
          {/* Brand section */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                mb: 1,
                background: 'linear-gradient(135deg, #FFD700 0%, #FF9500 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              🦆 LeBonCoinCoin
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 280 }}>
              La plateforme de petites annonces qui met du soleil dans vos achats !
            </Typography>
            
            {/* Social links */}
            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                sx={{
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' },
                }}
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' },
                }}
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' },
                }}
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>

          {/* Links sections */}
          {footerLinks.map((section) => (
            <Box key={section.title} sx={{ flex: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, mb: 1.5, color: 'text.primary' }}
              >
                {section.title}
              </Typography>
              <Stack spacing={1}>
                {section.links.map((link) => (
                  <Link
                    key={link.label}
                    component={RouterLink}
                    to={link.path}
                    underline="hover"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                      transition: 'color 0.2s',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Bottom section */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} LeBonCoinCoin. Tous droits réservés.
          </Typography>
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            Fait avec <FavoriteIcon sx={{ fontSize: 16, color: 'error.main' }} /> et beaucoup de 🦆
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}



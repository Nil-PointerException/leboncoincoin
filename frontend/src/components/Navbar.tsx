import { useNavigate } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Badge,
  Tooltip,
  Stack,
  useScrollTrigger,
  Slide,
} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import MessageIcon from '@mui/icons-material/Message'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PersonIcon from '@mui/icons-material/Person'
import HomeIcon from '@mui/icons-material/Home'
import { useUserSafe } from '@/hooks/useUserSafe'
import { useNotifications } from '@/hooks/useNotifications'
import { PrimaryDuckButton, OutlinedDuckButton, DuckAvatar } from './ui'

const isDev = !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
              import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.trim() === ''

interface HideOnScrollProps {
  children: React.ReactElement
}

function HideOnScroll({ children }: HideOnScrollProps) {
  const trigger = useScrollTrigger()
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

export default function Navbar() {
  const navigate = useNavigate()
  const { isSignedIn, user } = useUserSafe()
  const { favoritesCount, unreadMessagesCount } = useNotifications()

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '2px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 1 }}>
            {/* Logo */}
            <Box
              sx={{
                flexGrow: 1,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                transition: 'transform 0.2s',
                userSelect: 'none',
                '&:hover': { transform: 'scale(1.05)' },
              }}
              onClick={() => navigate('/')}
            >
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #FFD700 0%, #FF9500 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              >
                <span style={{ fontSize: '1.5rem', userSelect: 'none', pointerEvents: 'none' }}>🦆</span>
                <span style={{ userSelect: 'none', pointerEvents: 'none' }}>LeBonCoinCoin</span>
              </Typography>
              {isDev && (
                <Box
                  sx={{
                    bgcolor: 'warning.main',
                    color: 'warning.contrastText',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.7 },
                    },
                  }}
                >
                  DEV
                </Box>
              )}
            </Box>

            {/* Navigation */}
            <Stack direction="row" spacing={1} alignItems="center">
              {isSignedIn ? (
                <>
                  {/* Home Icon (mobile friendly) */}
                  <Tooltip title="Accueil">
                    <IconButton
                      onClick={() => navigate('/')}
                      sx={{ display: { xs: 'flex', md: 'none' } }}
                    >
                      <HomeIcon />
                    </IconButton>
                  </Tooltip>

                  {/* Favorites */}
                  <Tooltip title={`Mes favoris${favoritesCount > 0 ? ` (${favoritesCount})` : ''}`}>
                    <IconButton 
                      onClick={() => navigate('/favorites')}
                      sx={{
                        color: 'text.primary',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        '&:hover': {
                          color: 'error.main',
                          transform: 'scale(1.1)',
                          bgcolor: 'error.lighter',
                        },
                      }}
                    >
                      <Badge 
                        badgeContent={favoritesCount} 
                        color="error"
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: '0.7rem',
                            height: '18px',
                            minWidth: '18px',
                            fontWeight: 700,
                          }
                        }}
                      >
                        <FavoriteIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  {/* Messages */}
                  <Tooltip title={`Messagerie${unreadMessagesCount > 0 ? ` (${unreadMessagesCount} non lus)` : ''}`}>
                    <IconButton 
                      onClick={() => navigate('/conversations')}
                      sx={{
                        color: 'text.primary',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        '&:hover': {
                          color: 'primary.main',
                          transform: 'scale(1.1)',
                          bgcolor: 'primary.lighter',
                        },
                      }}
                    >
                      <Badge 
                        badgeContent={unreadMessagesCount} 
                        color="primary"
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: '0.7rem',
                            height: '18px',
                            minWidth: '18px',
                            fontWeight: 700,
                          }
                        }}
                      >
                        <MessageIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  {/* Create Listing Button */}
                  <PrimaryDuckButton
                    startIcon={<AddCircleIcon />}
                    onClick={() => navigate('/create')}
                    sx={{
                      display: { xs: 'none', sm: 'flex' },
                      px: 3,
                    }}
                  >
                    Créer une annonce
                  </PrimaryDuckButton>

                  {/* Mobile Create Button */}
                  <Tooltip title="Créer une annonce">
                    <IconButton
                      onClick={() => navigate('/create')}
                      sx={{
                        display: { xs: 'flex', sm: 'none' },
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': { bgcolor: 'primary.dark' },
                      }}
                    >
                      <AddCircleIcon />
                    </IconButton>
                  </Tooltip>

                  {/* Profile */}
                  {isDev ? (
                    <Tooltip title="Mon profil">
                      <IconButton onClick={() => navigate('/profile')}>
                        <DuckAvatar sx={{ width: 40, height: 40 }}>
                          {user?.fullName?.[0] || 'D'}
                        </DuckAvatar>
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Box sx={{ ml: 1 }}>
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: {
                              width: '40px',
                              height: '40px',
                            },
                          },
                        }}
                      />
                    </Box>
                  )}
                </>
              ) : (
                <>
                  <OutlinedDuckButton
                    onClick={() => navigate('/sign-in')}
                    startIcon={<PersonIcon />}
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                  >
                    Connexion
                  </OutlinedDuckButton>
                  <PrimaryDuckButton
                    onClick={() => navigate('/sign-up')}
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                  >
                    Inscription
                  </PrimaryDuckButton>
                  
                  {/* Mobile auth buttons */}
                  <IconButton
                    onClick={() => navigate('/sign-in')}
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                  >
                    <PersonIcon />
                  </IconButton>
                </>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  )
}

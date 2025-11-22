import { useNavigate } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Chip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import MessageIcon from '@mui/icons-material/Message'
import { useUserSafe } from '@/hooks/useUserSafe'

const isDev = !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
              import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.trim() === ''

export default function Navbar() {
  const navigate = useNavigate()
  const { isSignedIn, user } = useUserSafe()

  return (
    <AppBar position="sticky" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 700 }}
            onClick={() => navigate('/')}
          >
            LMC Annonces
          </Typography>

          {isDev && (
            <Chip 
              label="MODE DEV" 
              color="warning" 
              size="small" 
              sx={{ mr: 2, fontWeight: 'bold' }} 
            />
          )}

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {isSignedIn ? (
              <>
                <Button
                  color="inherit"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/create')}
                  variant="outlined"
                  sx={{ borderColor: 'white', '&:hover': { borderColor: 'white' } }}
                >
                  Créer une annonce
                </Button>
                <Button color="inherit" onClick={() => navigate('/profile')}>
                  Mes annonces
                </Button>
                <Button color="inherit" startIcon={<MessageIcon />} onClick={() => navigate('/conversations')}>
                  Messagerie
                </Button>
                {isDev ? (
                  <Chip 
                    label={user?.fullName || 'Dev User'} 
                    size="small" 
                    sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 'bold' }} 
                  />
                ) : (
                  <UserButton afterSignOutUrl="/" />
                )}
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/sign-in')}>
                  Connexion
                </Button>
                <Button
                  variant="outlined"
                  sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white' } }}
                  onClick={() => navigate('/sign-up')}
                >
                  Inscription
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}


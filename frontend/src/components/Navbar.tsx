import { useNavigate } from 'react-router-dom'
import { useUser, UserButton } from '@clerk/clerk-react'
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
import { useDevAuth } from '@/hooks/useDevAuth'

export default function Navbar() {
  const navigate = useNavigate()
  const devAuth = useDevAuth()
  
  // Use dev auth if Clerk is not configured, otherwise use Clerk
  const isSignedIn = devAuth.isDev ? devAuth.isSignedIn : useUser().isSignedIn

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

          {devAuth.isDev && (
            <Chip 
              label="MODE DEV" 
              color="warning" 
              size="small" 
              sx={{ mr: 2 }} 
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
                {!devAuth.isDev && <UserButton afterSignOutUrl="/" />}
                {devAuth.isDev && (
                  <Chip 
                    label="dev-user-123" 
                    size="small" 
                    sx={{ bgcolor: 'white', color: 'primary.main' }} 
                  />
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


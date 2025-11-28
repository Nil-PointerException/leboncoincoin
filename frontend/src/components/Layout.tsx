import { Outlet } from 'react-router-dom'
import { Box, Link } from '@mui/material'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      {/* Skip to main content link for accessibility */}
      <Link
        href="#main-content"
        onClick={(e) => {
          e.preventDefault()
          const mainContent = document.getElementById('main-content')
          if (mainContent) {
            mainContent.focus()
            mainContent.scrollIntoView({ behavior: 'smooth' })
          }
        }}
        sx={{
          position: 'absolute',
          top: -40,
          left: 0,
          zIndex: 1000,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          px: 3,
          py: 1,
          textDecoration: 'none',
          borderRadius: 1,
          fontSize: '0.875rem',
          fontWeight: 600,
          '&:focus': {
            top: 0,
          },
        }}
      >
        Aller au contenu principal
      </Link>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Navbar />
        <Box
          component="main"
          id="main-content"
          tabIndex={-1}
          role="main"
          sx={{
            flexGrow: 1,
            py: { xs: 3, md: 6 },
            px: { xs: 2, md: 0 },
          }}
        >
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </>
  )
}


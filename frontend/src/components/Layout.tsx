import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'

export default function Layout() {
  return (
    <>
      <ScrollToTop />
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


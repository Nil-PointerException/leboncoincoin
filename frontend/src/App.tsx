import { Route, Routes } from 'react-router-dom'
import { SignIn, SignUp } from '@clerk/clerk-react'
import { Box } from '@mui/material'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ListingDetailPage from './pages/ListingDetailPage'
import CreateListingPage from './pages/CreateListingPage'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/listings/:id" element={<ListingDetailPage />} />
        
        {/* Protected Routes */}
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateListingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Auth Routes */}
      <Route
        path="/sign-in/*"
        element={
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <SignIn routing="path" path="/sign-in" />
          </Box>
        }
      />
      <Route
        path="/sign-up/*"
        element={
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <SignUp routing="path" path="/sign-up" />
          </Box>
        }
      />
    </Routes>
  )
}

export default App


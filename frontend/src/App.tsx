import { Route, Routes, Navigate } from 'react-router-dom'
import { SignIn, SignUp } from '@clerk/clerk-react'
import { Box } from '@mui/material'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ListingDetailPage from './pages/ListingDetailPage'
import CreateListingPage from './pages/CreateListingPage'
import EditListingPage from './pages/EditListingPage'
import ProfilePage from './pages/ProfilePage'
import ConversationsPage from './pages/ConversationsPage'
import ChatPage from './pages/ChatPage'
import FavoritesPage from './pages/FavoritesPage'
import ContactPage from './pages/ContactPage'
import LegalPage from './pages/LegalPage'
import PrivacyPage from './pages/PrivacyPage'
import SellerPage from './pages/SellerPage'
import ProtectedRoute from './components/ProtectedRoute'

const isDev = !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
              import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.trim() === ''

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/listings/:id" element={<ListingDetailPage />} />
        <Route path="/seller/:userId" element={<SellerPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        
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
          path="/listings/:id/edit"
          element={
            <ProtectedRoute>
              <EditListingPage />
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
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/conversations"
          element={
            <ProtectedRoute>
              <ConversationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/conversations/:conversationId"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Auth Routes - Use Clerk in prod, placeholder in dev */}
      {isDev ? (
        <>
          <Route path="/sign-in/*" element={<Navigate to="/" replace />} />
          <Route path="/sign-up/*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
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
        </>
      )}
    </Routes>
  )
}

export default App


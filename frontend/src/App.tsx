import { Route, Routes, Navigate } from 'react-router-dom'
import { SignIn, SignUp } from '@clerk/clerk-react'
import { Box, Typography, Paper } from '@mui/material'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ListingDetailPage from './pages/ListingDetailPage'
import CreateListingPage from './pages/CreateListingPage'
import ProfilePage from './pages/ProfilePage'
import ConversationsPage from './pages/ConversationsPage'
import ChatPage from './pages/ChatPage'
import ProtectedRoute from './components/ProtectedRoute'

const isDev = !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
              import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.trim() === ''

// Dev mode placeholder for auth pages
const DevAuthPlaceholder = ({ type }: { type: 'sign-in' | 'sign-up' }) => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="grey.100">
    <Paper sx={{ p: 4, maxWidth: 400 }}>
      <Typography variant="h5" gutterBottom>
        Mode Développement
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {type === 'sign-in' ? 'Connexion' : 'Inscription'} désactivée en mode dev.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Le backend accepte toutes les requêtes avec l'utilisateur de test <code>dev-user-123</code>.
      </Typography>
      <Typography variant="body2" color="info.main" sx={{ mt: 2 }}>
        Pour utiliser Clerk, configurez <code>VITE_CLERK_PUBLISHABLE_KEY</code> dans le fichier <code>.env</code>
      </Typography>
    </Paper>
  </Box>
)

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


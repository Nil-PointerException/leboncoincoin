import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { DevAuthProvider } from './contexts/DevAuthContext'
import App from './App'
import theme from './theme'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Dev mode: Clerk is optional when backend auth is disabled
const isDev = !clerkPubKey || clerkPubKey.trim() === ''

const AppContent = () => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </BrowserRouter>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isDev ? (
      <DevAuthProvider>
        <AppContent />
      </DevAuthProvider>
    ) : (
      <ClerkProvider publishableKey={clerkPubKey!}>
        <AppContent />
      </ClerkProvider>
    )}
  </React.StrictMode>,
)


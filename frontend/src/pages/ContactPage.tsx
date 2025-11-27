import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { contactApi, setAuthToken } from '@/services/api'
import { useAuthSafe } from '@/hooks/useAuthSafe'

type ContactReason = 
  | 'QUESTION'
  | 'BUG_REPORT'
  | 'FEATURE_REQUEST'
  | 'ACCOUNT_ISSUE'
  | 'OTHER'

const CONTACT_REASONS: { value: ContactReason; label: string }[] = [
  { value: 'QUESTION', label: 'Question générale' },
  { value: 'BUG_REPORT', label: 'Signaler un bug' },
  { value: 'FEATURE_REQUEST', label: 'Demande de fonctionnalité' },
  { value: 'ACCOUNT_ISSUE', label: 'Problème de compte' },
  { value: 'OTHER', label: 'Autre' },
]

export default function ContactPage() {
  const navigate = useNavigate()
  const { getToken, isSignedIn } = useAuthSafe()
  
  const [reason, setReason] = useState<ContactReason>('QUESTION')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!message.trim()) {
      setError('Veuillez saisir un message')
      return
    }

    if (message.trim().length < 10) {
      setError('Le message doit contenir au moins 10 caractères')
      return
    }

    setLoading(true)

    try {
      const token = isSignedIn ? await getToken() : null
      if (token) {
        setAuthToken(token)
      }

      // Envoyer le message via le service API
      await contactApi.sendContactMessage({
        reason,
        message: message.trim(),
      })

      setSuccess(true)
      setMessage('')
      setReason('QUESTION')
      
      // Rediriger après 2 secondes
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (err: any) {
      console.error('Error sending contact message:', err)
      setError(
        err.message || 
        'Erreur lors de l\'envoi du message. Veuillez réessayer.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Retour
      </Button>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          Nous contacter
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Une question ? Un problème ? N'hésitez pas à nous écrire, nous vous répondrons dans les plus brefs délais.
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Votre message a été envoyé avec succès ! Nous vous répondrons bientôt.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <FormControl fullWidth sx={{ mb: 3 }} required>
            <InputLabel id="contact-reason-label">Raison du contact</InputLabel>
            <Select
              labelId="contact-reason-label"
              id="contact-reason"
              value={reason}
              label="Raison du contact"
              onChange={(e) => setReason(e.target.value as ContactReason)}
            >
              {CONTACT_REASONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Sélectionnez la raison principale de votre contact
            </FormHelperText>
          </FormControl>

          <TextField
            fullWidth
            required
            multiline
            rows={8}
            label="Votre message"
            placeholder="Décrivez votre question, problème ou demande en détail..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            error={error !== null && message.trim().length < 10}
            helperText={
              message.trim().length < 10 && message.length > 0
                ? 'Le message doit contenir au moins 10 caractères'
                : `${message.length} caractères (minimum 10)`
            }
            inputProps={{ maxLength: 2000 }}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
              disabled={loading || !message.trim() || message.trim().length < 10}
              sx={{ minWidth: 150 }}
            >
              {loading ? 'Envoi...' : 'Envoyer'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}


import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthSafe } from '@/hooks/useAuthSafe'
import { useUserSafe } from '@/hooks/useUserSafe'
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { messagingApi } from '@/services/messagingApi'
import { setAuthToken } from '@/services/api'
import type { ConversationWithListing, Message } from '@/types/messaging'

export default function ChatPage() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const navigate = useNavigate()
  const { getToken } = useAuthSafe()
  const { user } = useUserSafe()

  const [conversation, setConversation] = useState<ConversationWithListing | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const fetchData = async () => {
      if (!conversationId) return

      try {
        setLoading(true)
        setError(null)
        const token = await getToken()
        setAuthToken(token)
        
        const [conversationData, messagesData] = await Promise.all([
          messagingApi.getConversation(conversationId),
          messagingApi.getMessages(conversationId),
        ])
        
        setConversation(conversationData)
        setMessages(messagesData)
        
        // Mark all messages as read
        await messagingApi.markAllAsRead(conversationId)
      } catch (err) {
        console.error('Error fetching conversation:', err)
        setError('Erreur lors du chargement de la conversation')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [conversationId, getToken])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !conversationId) return

    try {
      setSending(true)
      const message = await messagingApi.sendMessage(conversationId, {
        content: newMessage.trim(),
      })
      setMessages((prev) => [...prev, message])
      setNewMessage('')
    } catch (err) {
      console.error('Error sending message:', err)
      setError('Erreur lors de l\'envoi du message')
    } finally {
      setSending(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isOwnMessage = (message: Message) => {
    return message.senderId === user?.id
  }

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error || !conversation) {
    return (
      <Container>
        <Alert severity="error" sx={{ my: 4 }}>
          {error || 'Conversation non trouvée'}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/conversations')}>
          Retour aux conversations
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', py: 2 }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={() => navigate('/conversations')}>
            <ArrowBackIcon />
          </IconButton>
          <Avatar
            src={conversation.listing?.imageUrls?.[0]}
            alt={conversation.listing?.title}
            variant="rounded"
            sx={{ width: 48, height: 48 }}
          />
          <Box flexGrow={1}>
            <Typography variant="h6" fontWeight={600}>
              {conversation.listing?.title || 'Annonce supprimée'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {conversation.listing && `${conversation.listing.price.toFixed(2)} €`}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(`/listings/${conversation.listingId}`)}
            disabled={!conversation.listing}
          >
            Voir l'annonce
          </Button>
        </Box>
      </Paper>

      {/* Messages */}
      <Paper
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: 2,
          mb: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {messages.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography variant="body2" color="text.secondary">
              Aucun message pour le moment
            </Typography>
          </Box>
        ) : (
          messages.map((message) => (
            <Box
              key={message.id}
              display="flex"
              justifyContent={isOwnMessage(message) ? 'flex-end' : 'flex-start'}
            >
              <Box
                sx={{
                  maxWidth: '70%',
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: isOwnMessage(message) ? 'primary.main' : 'grey.200',
                  color: isOwnMessage(message) ? 'white' : 'text.primary',
                }}
              >
                <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                  {message.content}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 0.5,
                    opacity: 0.8,
                    textAlign: 'right',
                  }}
                >
                  {formatDate(message.sentAt)}
                </Typography>
              </Box>
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Paper>

      {/* Input */}
      <Paper component="form" onSubmit={handleSendMessage} sx={{ p: 2, display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Tapez votre message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={sending}
          variant="outlined"
          size="small"
        />
        <Button
          type="submit"
          variant="contained"
          disabled={!newMessage.trim() || sending}
          sx={{ minWidth: 'auto', px: 3 }}
        >
          {sending ? <CircularProgress size={24} /> : <SendIcon />}
        </Button>
      </Paper>
    </Container>
  )
}


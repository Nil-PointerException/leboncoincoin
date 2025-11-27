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
import { formatPrice } from '@/utils'

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
      <Paper 
        sx={{ 
          p: 2, 
          mb: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton 
            onClick={() => navigate('/conversations')}
            sx={{
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Avatar
            src={conversation.listing?.imageUrls?.[0]}
            alt={conversation.listing?.title}
            variant="rounded"
            sx={{ 
              width: 56, 
              height: 56,
              border: '2px solid',
              borderColor: 'grey.200',
            }}
          />
          <Box flexGrow={1} minWidth={0}>
            <Typography 
              variant="h6" 
              fontWeight={600}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {conversation.listing?.title || 'Annonce supprimée'}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {conversation.listing && `${formatPrice(conversation.listing.price)} €`}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(`/listings/${conversation.listingId}`)}
            disabled={!conversation.listing}
            sx={{
              flexShrink: 0,
            }}
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
          bgcolor: 'grey.50',
        }}
      >
        {messages.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography variant="body2" color="text.secondary">
              Aucun message pour le moment
            </Typography>
          </Box>
        ) : (
          messages.map((message) => {
            const isOwn = isOwnMessage(message)
            return (
              <Box
                key={message.id}
                display="flex"
                justifyContent={isOwn ? 'flex-end' : 'flex-start'}
                alignItems="flex-end"
                gap={1.5}
                sx={{
                  flexDirection: isOwn ? 'row-reverse' : 'row',
                }}
              >
                {/* Avatar */}
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: isOwn ? 'primary.main' : 'grey.400',
                    fontSize: '0.875rem',
                    flexShrink: 0,
                  }}
                >
                  {isOwn ? (user?.fullName?.[0] || 'M') : 'U'}
                </Avatar>

                {/* Message bubble */}
                <Box
                  sx={{
                    maxWidth: '70%',
                    minWidth: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: isOwn ? 'primary.main' : 'white',
                      color: isOwn ? 'white' : 'text.primary',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      border: isOwn ? 'none' : '1px solid',
                      borderColor: 'grey.200',
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        wordBreak: 'break-word',
                        lineHeight: 1.5,
                        fontSize: '0.95rem',
                      }}
                    >
                      {message.content}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      px: 1,
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                      alignSelf: isOwn ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {formatDate(message.sentAt)}
                  </Typography>
                </Box>
              </Box>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </Paper>

      {/* Input */}
      <Paper 
        component="form" 
        onSubmit={handleSendMessage} 
        sx={{ 
          p: 2, 
          display: 'flex', 
          gap: 1.5,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
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
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'white',
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={!newMessage.trim() || sending}
          sx={{ 
            minWidth: 'auto', 
            px: 3,
            minHeight: '40px',
            borderRadius: 2,
          }}
        >
          {sending ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
        </Button>
      </Paper>
    </Container>
  )
}


import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthSafe } from '@/hooks/useAuthSafe'
import { useUserSafe } from '@/hooks/useUserSafe'
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Divider,
} from '@mui/material'
import MessageIcon from '@mui/icons-material/Message'
import { messagingApi } from '@/services/messagingApi'
import { setAuthToken } from '@/services/api'
import type { ConversationWithListing } from '@/types/messaging'

export default function ConversationsPage() {
  const navigate = useNavigate()
  const { getToken } = useAuthSafe()
  const { user } = useUserSafe()

  const [conversations, setConversations] = useState<ConversationWithListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true)
        setError(null)
        const token = await getToken()
        setAuthToken(token)
        const data = await messagingApi.getConversations()
        setConversations(data)
      } catch (err) {
        console.error('Error fetching conversations:', err)
        setError('Erreur lors du chargement des conversations')
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [getToken])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    } else if (hours < 48) {
      return 'Hier'
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    }
  }

  const getOtherUserLabel = (conversation: ConversationWithListing) => {
    const currentUserId = user?.id
    if (conversation.buyerId === currentUserId) {
      return 'Vendeur'
    } else {
      return 'Acheteur'
    }
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

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ my: 4 }}>
          {error}
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MessageIcon fontSize="large" />
          Mes conversations
        </Typography>

        {conversations.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
            <MessageIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Aucune conversation pour le moment
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Contactez un vendeur depuis une annonce pour commencer une conversation
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ mt: 3 }}>
            <List sx={{ p: 0 }}>
              {conversations.map((conversation, index) => (
                <Box key={conversation.id}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate(`/conversations/${conversation.id}`)}>
                      <ListItemAvatar>
                        <Badge
                          badgeContent={conversation.unreadCount}
                          color="error"
                          invisible={conversation.unreadCount === 0}
                        >
                          <Avatar
                            src={conversation.listing?.imageUrls?.[0]}
                            alt={conversation.listing?.title}
                            variant="rounded"
                            sx={{ width: 56, height: 56 }}
                          >
                            <MessageIcon />
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1" fontWeight={conversation.unreadCount > 0 ? 700 : 400}>
                              {conversation.listing?.title || 'Annonce supprimée'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {conversation.lastMessage && formatDate(conversation.lastMessage.sentAt)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontWeight: conversation.unreadCount > 0 ? 600 : 400,
                              }}
                            >
                              {conversation.lastMessage?.content || 'Aucun message'}
                            </Typography>
                            <Box display="flex" gap={1} mt={0.5}>
                              <Chip label={getOtherUserLabel(conversation)} size="small" variant="outlined" />
                              {conversation.listing && (
                                <Chip
                                  label={`${conversation.listing.price.toFixed(2)} €`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < conversations.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </Container>
  )
}


import type {
  Conversation,
  ConversationWithListing,
  Message,
  CreateConversationRequest,
  SendMessageRequest,
} from '@/types/messaging'
import type { Listing } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const messagingApi = {
  /**
   * Get all conversations for the current user
   */
  async getConversations(): Promise<ConversationWithListing[]> {
    const response = await fetch(`${API_BASE_URL}/conversations`, {
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Failed to fetch conversations')
    }
    const conversations: Conversation[] = await response.json()
    
    // Enrich with listing data
    const enriched = await Promise.all(
      conversations.map(async (conversation) => {
        try {
          const listingResponse = await fetch(`${API_BASE_URL}/listings/${conversation.listingId}`, {
            credentials: 'include',
          })
          if (listingResponse.ok) {
            const listing: Listing = await listingResponse.json()
            return {
              ...conversation,
              listing: {
                id: listing.id,
                title: listing.title,
                price: listing.price,
                imageUrls: listing.imageUrls,
              },
            }
          }
        } catch (error) {
          console.error('Error fetching listing:', error)
        }
        return conversation as ConversationWithListing
      })
    )
    
    return enriched
  },

  /**
   * Backwards-compatible alias exposed to hooks/components
   * that expect getUserConversations on messagingApi.
   */
  async getUserConversations(): Promise<ConversationWithListing[]> {
    return this.getConversations()
  },

  /**
   * Get a specific conversation by ID
   */
  async getConversation(conversationId: string): Promise<ConversationWithListing> {
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}`, {
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Failed to fetch conversation')
    }
    const conversation: Conversation = await response.json()
    
    // Enrich with listing data
    try {
      const listingResponse = await fetch(`${API_BASE_URL}/listings/${conversation.listingId}`, {
        credentials: 'include',
      })
      if (listingResponse.ok) {
        const listing: Listing = await listingResponse.json()
        return {
          ...conversation,
          listing: {
            id: listing.id,
            title: listing.title,
            price: listing.price,
            imageUrls: listing.imageUrls,
          },
        }
      }
    } catch (error) {
      console.error('Error fetching listing:', error)
    }
    
    return conversation as ConversationWithListing
  },

  /**
   * Create a new conversation (or get existing one)
   */
  async createConversation(request: CreateConversationRequest): Promise<Conversation> {
    const response = await fetch(`${API_BASE_URL}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(request),
    })
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Failed to create conversation')
    }
    return response.json()
  },

  /**
   * Get all messages in a conversation
   */
  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Failed to fetch messages')
    }
    return response.json()
  },

  /**
   * Send a message in a conversation
   */
  async sendMessage(conversationId: string, request: SendMessageRequest): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(request),
    })
    if (!response.ok) {
      throw new Error('Failed to send message')
    }
    return response.json()
  },

  /**
   * Mark a specific message as read
   */
  async markMessageAsRead(conversationId: string, messageId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/conversations/${conversationId}/messages/${messageId}/read`,
      {
        method: 'PUT',
        credentials: 'include',
      }
    )
    if (!response.ok) {
      throw new Error('Failed to mark message as read')
    }
  },

  /**
   * Mark all messages in a conversation as read
   */
  async markAllAsRead(conversationId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/conversations/${conversationId}/messages/mark-all-read`,
      {
        method: 'PUT',
        credentials: 'include',
      }
    )
    if (!response.ok) {
      throw new Error('Failed to mark all messages as read')
    }
  },
}





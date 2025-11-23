export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  sentAt: string
  isRead: boolean
}

export interface Conversation {
  id: string
  listingId: string
  buyerId: string
  sellerId: string
  createdAt: string
  updatedAt: string
  lastMessage: Message | null
  unreadCount: number
}

export interface CreateConversationRequest {
  listingId: string
  initialMessage: string
}

export interface SendMessageRequest {
  content: string
}

export interface ConversationWithListing extends Conversation {
  listing?: {
    id: string
    title: string
    price: number
    imageUrls: string[]
  }
}



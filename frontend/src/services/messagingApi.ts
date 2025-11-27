import { api } from '@/services/api' // On utilise ton client HTTP centralisé
import type {
  Conversation,
  ConversationWithListing,
  Message,
  CreateConversationRequest,
  SendMessageRequest,
} from '@/types/messaging'

export const messagingApi = {
  /**
   * Get all conversations for the current user
   * CORRECTION : On utilise l'alias getUserConversations directement ici
   */
  async getUserConversations(): Promise<ConversationWithListing[]> {
    // Ton backend Java renvoie déjà le listing et le unreadCount dedans !
    // Pas besoin de refaire des fetch manuels.
    const response = await api.get('/conversations')
    return response.data
  },

  /**
   * Garder cet alias pour la compatibilité si d'autres fichiers appellent getConversations
   */
  async getConversations(): Promise<ConversationWithListing[]> {
    return this.getUserConversations()
  },

  /**
   * Get a specific conversation by ID
   */
  async getConversation(conversationId: string): Promise<ConversationWithListing> {
    const response = await api.get(`/conversations/${conversationId}`)
    return response.data
  },

  /**
   * Create a new conversation
   */
  async createConversation(request: CreateConversationRequest): Promise<Conversation> {
    const response = await api.post('/conversations', request)
    return response.data
  },

  /**
   * Get messages
   * Note : Ton backend n'a pas forcément cette route "/messages" dédiée si tout est dans getConversation
   * Mais si elle existe :
   */
  async getMessages(conversationId: string): Promise<Message[]> {
    // Vérifie si ton backend a bien cette route.
    // Souvent on récupère les messages via getConversation(id)
    const response = await api.get(`/conversations/${conversationId}/messages`)
    return response.data
  },

  /**
   * Send a message
   */
  async sendMessage(conversationId: string, request: SendMessageRequest): Promise<Message> {
    // Si ta route Java est POST /conversations/{id}/messages
    // Sinon adapte l'URL selon ton ConversationResource
    const response = await api.post(`/conversations/${conversationId}/messages`, request)
    return response.data
  },

  /**
   * Mark as read
   */
  async markMessageAsRead(conversationId: string, messageId: string): Promise<void> {
    await api.put(`/conversations/${conversationId}/messages/${messageId}/read`)
  },

  async markAllAsRead(conversationId: string): Promise<void> {
    await api.put(`/conversations/${conversationId}/messages/mark-all-read`)
  }
}
/**
 * Hook to get notification counts for favorites and unread messages
 */

import { useState, useEffect } from 'react'
import { useAuthSafe } from './useAuthSafe'
import { favoritesApi, setAuthToken } from '@/services/api'
import { messagingApi } from '@/services/messagingApi'

export function useNotifications() {
  const { isSignedIn, getToken } = useAuthSafe()
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCounts = async () => {
      if (!isSignedIn) {
        setFavoritesCount(0)
        setUnreadMessagesCount(0)
        return
      }

      try {
        setLoading(true)
        const token = await getToken()
        setAuthToken(token)

        // Fetch favorites count
        const favorites = await favoritesApi.getFavorites()
        setFavoritesCount(favorites.length)

        // Fetch unread messages count
        try {
          const conversations = await messagingApi.getUserConversations()
          // Count conversations with unread messages
          const unreadCount = conversations.reduce((count, conv) => {
            // This would require backend support to track unread status
            // For now, we'll just return 0
            return count
          }, 0)
          setUnreadMessagesCount(unreadCount)
        } catch (err) {
          console.error('Error fetching messages:', err)
          setUnreadMessagesCount(0)
        }
      } catch (error) {
        console.error('Error fetching notification counts:', error)
        setFavoritesCount(0)
        setUnreadMessagesCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchCounts()

    // Refresh every 30 seconds
    const interval = setInterval(fetchCounts, 30000)
    return () => clearInterval(interval)
  }, [isSignedIn, getToken])

  return {
    favoritesCount,
    unreadMessagesCount,
    loading,
  }
}



import axios from 'axios'
import type { Listing, User, CreateListingRequest, PresignedUrlResponse } from '@/types'

// Use proxy in dev mode, direct URL in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

console.log('API Base URL:', API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status < 500, // Don't throw on 4xx errors
})

// Request interceptor to add auth token
export const setAuthToken = (token: string | null) => {
  if (token) {
    console.log('Setting auth token:', token.substring(0, 20) + '...')
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    console.log('Clearing auth token')
    delete api.defaults.headers.common['Authorization']
  }
}

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    // Log only errors for cleaner console
    return response
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      message: error.message
    })
    
    // Provide helpful hints for common errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('   💡 Authentification requise. Vérifiez votre configuration Clerk.')
    } else if (!error.response) {
      console.error('   💡 Backend non accessible. Vérifiez que le backend est démarré.')
    }
    
    return Promise.reject(error)
  }
)

// Listings API
export const listingsApi = {
  getAll: async (filters?: {
    category?: string
    location?: string
    minPrice?: number
    maxPrice?: number
    search?: string
  }): Promise<Listing[]> => {
    const { data } = await api.get('/listings', { params: filters })
    return data
  },

  getById: async (id: string): Promise<Listing> => {
    const { data } = await api.get(`/listings/${id}`)
    return data
  },

  create: async (request: CreateListingRequest): Promise<Listing> => {
    const { data } = await api.post('/listings', request)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/listings/${id}`)
  },
}

// User API
export const userApi = {
  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get('/me')
    return data
  },

  getCurrentUserListings: async (): Promise<Listing[]> => {
    const { data } = await api.get('/me/listings')
    return data
  },
}

// Upload API
export const uploadApi = {
  getPresignedUrl: async (filename: string, contentType: string): Promise<PresignedUrlResponse> => {
    const { data } = await api.post('/uploads/presigned-url', {
      filename,
      contentType,
    })
    return data
  },

  uploadToS3: async (presignedUrl: string, file: File): Promise<void> => {
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    })
  },
}

export default api


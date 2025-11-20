import axios from 'axios'
import type { Listing, User, CreateListingRequest, PresignedUrlResponse } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

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


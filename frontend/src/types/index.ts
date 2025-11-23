export interface Listing {
  id: string
  title: string
  description: string
  price: number
  category: string
  location: string
  imageUrls: string[]
  userId: string
  createdAt: string
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface CreateListingRequest {
  title: string
  description: string
  price: number
  category: string
  location: string
  imageUrls: string[]
}

export interface PresignedUrlResponse {
  uploadUrl: string
  objectKey: string
  publicUrl: string
}

export interface ListingFilter {
  category?: string
  location?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}

export interface Favorite {
  id: string
  userId: string
  listingId: string
  createdAt: string
}

export interface FavoriteStatus {
  isFavorited: boolean
}

export * from './messaging'


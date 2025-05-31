import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: number
  nama: string
}

interface Barang {
  id: number
  nama_barang: string
  kode_barang: string
  harga_jual: string
}

interface Rating {
  id: number
  rating: number
  komentar: string
  created_at: string
  user: User
  barang: Barang
}

interface CreateRatingData {
  user_id: number
  barang_id: number
  rating: number
  komentar: string
}

interface UpdateRatingData {
  rating: number
  komentar: string
}

interface ApiResponse<T> {
  data: T
}

export const useRatingStore = defineStore('rating', () => {
  // State
  const ratings = ref<Rating[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Base URL
  const baseURL = 'http://127.0.0.1:8000/api'

  // Helper function untuk handle request
  const handleRequest = async <T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<T> => {
    try {
      loading.value = true
      error.value = null

      // Get token from localStorage
      const token = localStorage.getItem('token') || localStorage.getItem('authToken')

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers as Record<string, string>,
      }

      // Add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(url, {
        headers,
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions

  // Tambah rating
  const createRating = async (ratingData: CreateRatingData): Promise<Rating> => {
    const response = await handleRequest<Rating>(`${baseURL}/ratings/`, {
      method: 'POST',
      body: JSON.stringify(ratingData),
    })

    // Refresh list setelah menambah
    await fetchRatings()
    
    return response
  }

  // List rating
  const fetchRatings = async (): Promise<Rating[]> => {
    const response = await handleRequest<ApiResponse<Rating[]>>(`${baseURL}/ratings/`)
    ratings.value = response.data
    return response.data
  }

  // Menghapus rating
  const deleteRating = async (id: number): Promise<void> => {
    await handleRequest(`${baseURL}/ratings/${id}`, {
      method: 'DELETE',
    })

    // Remove dari state local
    ratings.value = ratings.value.filter(rating => rating.id !== id)
  }

  // Mengedit rating
  const updateRating = async (id: number, updateData: UpdateRatingData): Promise<Rating> => {
    const response = await handleRequest<Rating>(`${baseURL}/ratings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    })

    // Update di state local
    const index = ratings.value.findIndex(rating => rating.id === id)
    if (index !== -1) {
      ratings.value[index] = response
    }

    return response
  }

  // Get rating by ID
  const getRatingById = (id: number): Rating | undefined => {
    return ratings.value.find(rating => rating.id === id)
  }

  // Get ratings by barang ID
  const getRatingsByBarangId = (barangId: number): Rating[] => {
    return ratings.value.filter(rating => rating.barang.id === barangId)
  }

  // Get ratings by user ID
  const getRatingsByUserId = (userId: number): Rating[] => {
    return ratings.value.filter(rating => rating.user.id === userId)
  }

  // Calculate average rating for a barang
  const getAverageRatingByBarangId = (barangId: number): number => {
    const barangRatings = getRatingsByBarangId(barangId)
    if (barangRatings.length === 0) return 0
    
    const total = barangRatings.reduce((sum, rating) => sum + rating.rating, 0)
    return Math.round((total / barangRatings.length) * 10) / 10 // Round to 1 decimal
  }

  // Reset state
  const resetState = (): void => {
    ratings.value = []
    error.value = null
    loading.value = false
  }

  return {
    // State
    ratings,
    loading,
    error,

    // Actions
    createRating,
    fetchRatings,
    deleteRating,
    updateRating,
    getRatingById,
    getRatingsByBarangId,
    getRatingsByUserId,
    getAverageRatingByBarangId,
    resetState,
  }
})
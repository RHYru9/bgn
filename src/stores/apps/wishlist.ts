import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'

// Sesuaikan tipe Barang jika tersedia
interface Barang {
  id: number
  nama: string
}

interface WishlistItem {
  id: number
  barang_id: number
  barang: Barang
  user_id: number
}

interface ErrorResponse {
  message?: string
}

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    wishlist: [] as WishlistItem[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchWishlist(userId?: number) {
      this.loading = true
      this.error = null
      try {
        const url = userId ? `/wishlist?user_id=${userId}` : `/wishlist`
        const response = await api.get<WishlistItem[]>(url)
        this.wishlist = response.data
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>
        this.error = error.response?.data?.message || 'Gagal memuat wishlist'
      } finally {
        this.loading = false
      }
    },

    async addToWishlist(barangId: number) {
      this.error = null
      try {
        const response = await api.post<WishlistItem>('/wishlist', {
          barang_id: barangId
        })
        this.wishlist.push(response.data)
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>
        this.error = error.response?.data?.message || 'Gagal menambahkan ke wishlist'
      }
    },

    async removeFromWishlist(id: number) {
      this.error = null
      try {
        await api.delete(`/wishlist/${id}`)
        this.wishlist = this.wishlist.filter(item => item.id !== id)
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>
        this.error = error.response?.data?.message || 'Gagal menghapus wishlist'
      }
    }
  }
})

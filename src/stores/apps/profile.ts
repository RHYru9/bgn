import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, ApiError } from '@/types/user'
import api from '@/services/axiosInstance'

export const useProfileStore = defineStore('profile', () => {
  const user = ref<User | null>(null)
  const users = ref<User[]>([]) // Hanya digunakan oleh admin
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ----------------------
  // FUNGSI UMUM (UNTUK SEMUA ROLE)
  // ----------------------

  const getProfile = async (): Promise<User> => {
    try {
      loading.value = true
      const response = await api.get('/user')
      user.value = response.data
      error.value = null
      return response.data
    } catch (err: unknown) {
      const apiError = err as ApiError
      error.value = apiError.response?.data?.message || apiError.message || 'Gagal memuat profil'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (data: Partial<User> & { old_password?: string }): Promise<User> => {
    try {
      loading.value = true
      
      const updateData: Partial<User> & { old_password?: string } = {
        nama: data.nama,
        email: data.email,
        no_hp: data.no_hp,
        alamat: data.alamat,
        kode_pos: data.kode_pos,
      }

      // Jika password baru ada, tambahkan password dan old_password
      if (data.password) {
        updateData.password = data.password
        updateData.old_password = data.old_password
      }

      console.log('Sending update data:', updateData)

      const response = await api.put('/user', updateData)

      console.log('Full API Response:', response)
      console.log('Response status:', response.status)
      console.log('Response data:', response.data)

      // Update user data berdasarkan response dari Laravel controller
      if (response.data && response.data.user) {
        user.value = response.data.user
        error.value = null
        return response.data.user
      } else {
        console.error('Unexpected response format:', response.data)
        throw new Error('Invalid response format')
      }

    } catch (err: unknown) {
      console.error('Update profile error:', err)
      const apiError = err as ApiError

      console.log('Error response:', apiError.response?.data)
      console.log('Error status:', apiError.response?.status)
      console.log('Full error object:', apiError)

      // Handle validation errors
      if (apiError.response?.status === 400) {
        if (apiError.response?.data && typeof apiError.response.data === 'object') {
          // Laravel validation errors format
          const validationErrors = apiError.response.data
          const errorMessages = Object.values(validationErrors).flat().join(', ')
          error.value = errorMessages
        } else {
          error.value = apiError.response?.data?.message || 'Validation error occurred'
        }
      } else if (apiError.response?.status === 403) {
        // Handle incorrect old password
        error.value = apiError.response?.data?.message || 'Password lama tidak benar'
      } else {
        error.value = apiError.response?.data?.message || apiError.message || 'Gagal memperbarui profil'
      }

      throw err
    } finally {
      loading.value = false
    }
  }

  // Method khusus untuk update password
  const updatePassword = async (oldPassword: string, newPassword: string): Promise<User> => {
    try {
      loading.value = true
      
      const updateData = {
        password: newPassword,
        old_password: oldPassword
      }

      console.log('Updating password...')

      const response = await api.put('/user', updateData)

      if (response.data && response.data.user) {
        user.value = response.data.user
        error.value = null
        return response.data.user
      } else {
        throw new Error('Invalid response format')
      }

    } catch (err: unknown) {
      console.error('Update password error:', err)
      const apiError = err as ApiError

      if (apiError.response?.status === 403) {
        error.value = 'Password lama tidak benar'
      } else if (apiError.response?.status === 400) {
        if (apiError.response?.data && typeof apiError.response.data === 'object') {
          const validationErrors = apiError.response.data
          const errorMessages = Object.values(validationErrors).flat().join(', ')
          error.value = errorMessages
        } else {
          error.value = 'Data tidak valid'
        }
      } else {
        error.value = apiError.response?.data?.message || apiError.message || 'Gagal mengubah password'
      }

      throw err
    } finally {
      loading.value = false
    }
  }

  // ----------------------
  // FUNGSI ADMIN ONLY
  // ----------------------

  const getUsers = async (role?: string): Promise<User[]> => {
    try {
      loading.value = true
      const params = role ? { role } : {}
      const response = await api.get('/users', { params })
      users.value = response.data.data
      error.value = null
      return response.data.data
    } catch (err: unknown) {
      const apiError = err as ApiError
      error.value = apiError.response?.data?.message || apiError.message || 'Gagal memuat daftar pengguna'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getUserById = async (id: number): Promise<User> => {
    try {
      loading.value = true
      const response = await api.get(`/users/${id}`)
      error.value = null
      return response.data
    } catch (err: unknown) {
      const apiError = err as ApiError
      error.value = apiError.response?.data?.message || apiError.message || 'Gagal memuat data pengguna'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id: number, data: Partial<User>): Promise<User> => {
    try {
      loading.value = true
      const response = await api.put(`/users/${id}`, data)
      
      // Update local user if it's the same user
      if (user.value && user.value.id === id) {
        user.value = response.data.user || response.data.data || response.data
      }
      
      // Update users array
      const userIndex = users.value.findIndex(u => u.id === id)
      if (userIndex !== -1) {
        users.value[userIndex] = response.data.user || response.data.data || response.data
      }
      
      error.value = null
      return response.data.user || response.data.data || response.data
    } catch (err: unknown) {
      const apiError = err as ApiError
      
      if (apiError.response?.status === 400) {
        if (apiError.response?.data && typeof apiError.response.data === 'object') {
          const validationErrors = apiError.response.data
          const errorMessages = Object.values(validationErrors).flat().join(', ')
          error.value = errorMessages
        } else {
          error.value = 'Data tidak valid'
        }
      } else {
        error.value = apiError.response?.data?.message || apiError.message || 'Gagal memperbarui pengguna'
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id: number): Promise<void> => {
    try {
      loading.value = true
      await api.delete(`/users/${id}`)
      users.value = users.value.filter(u => u.id !== id)
      error.value = null
    } catch (err: unknown) {
      const apiError = err as ApiError
      error.value = apiError.response?.data?.message || apiError.message || 'Gagal menghapus pengguna'
      throw err
    } finally {
      loading.value = false
    }
  }

  const reset = (): void => {
    user.value = null
    users.value = []
    loading.value = false
    error.value = null
  }

  return {
    user,
    users,
    loading,
    error,

    getProfile,
    updateProfile,
    updatePassword,

    getUsers,
    getUserById,
    updateUser,
    deleteUser,

    reset
  }
})
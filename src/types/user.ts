// src/types/user.ts

export interface User {
  id: number
  nama: string
  email: string
  email_verified_at?: string | null
  role: 'admin' | 'user' | 'driver'
  no_hp?: string | null
  alamat?: string | null
  kode_pos?: string | null
  password?: string // Hanya untuk keperluan update
  created_at?: string
  updated_at?: string
}

export interface UserResponse {
  message?: string
  data?: User | User[]
  success?: boolean
}

export interface ApiError {
  response?: {
    status?: number
    data?: {
      message?: string
      errors?: Record<string, string[]>
    }
  }
  message?: string
}

// Untuk payload update profile
export interface UpdateProfilePayload {
  nama?: string
  email?: string
  no_hp?: string | null
  alamat?: string | null
  kode_pos?: string | null
  password?: string
}

// Untuk payload update user oleh admin
export interface AdminUpdateUserPayload extends UpdateProfilePayload {
  role?: 'admin' | 'user' | 'driver'
}

// Untuk response pagination (jika diperlukan)
export interface PaginatedUserResponse {
  data: User[]
  current_page: number
  per_page: number
  total: number
  last_page: number
  from: number
  to: number
}

// Untuk filter get users
export interface UserFilter {
  role?: 'admin' | 'user' | 'driver' | 'all'
  page?: number
  per_page?: number
  search?: string
}
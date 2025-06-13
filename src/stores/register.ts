import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface RegisterData {
  email: string
  nama: string
  password: string
  password_confirmation: string
}

interface RegisterResponse {
  status: string
  message: string
  data: {
    nama: string
    email: string
    no_hp: string | null
    alamat: string | null
    kode_pos: string | null
    role: string
    updated_at: string
    created_at: string
    id: number
  }
}

interface OTPResponse {
  success: boolean
  message: string
  data: {
    email: string
    expires_at: string
    expires_in_seconds: number
  }
}

interface VerifyOTPResponse {
  success: boolean
  message: string
  data: {
    email: string
    email_verified: boolean
    verified_at: string
  }
}

export const useRegisterStore = defineStore('register', () => {
  const router = useRouter()
  
  // State
  const isLoading = ref(false)
  const isOTPLoading = ref(false)
  const isVerifyLoading = ref(false)
  const error = ref<string | null>(null)
  const otpError = ref<string | null>(null)
  const currentEmail = ref<string>('')
  const otpExpiry = ref<string>('')
  const isOTPSent = ref(false)
  
  // Actions
  // Ganti function register di register.ts dengan yang ini:
const register = async (data: RegisterData): Promise<boolean> => {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await fetch('http://127.0.0.1:8000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Registration failed')
    }
    
    const result: RegisterResponse = await response.json()
    
    if (result.status === 'success') {
      currentEmail.value = data.email
      // Redirect to verification page
      await router.push('/verifikasi')
      // HAPUS auto send OTP - biarkan user klik tombol kirim manual
      // await sendOTP(data.email)  // <-- Hapus baris ini
      return true
    }
    
    throw new Error(result.message || 'Registration failed')
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Registration failed'
    return false
  } finally {
    isLoading.value = false
  }
}
  
  const sendOTP = async (email: string): Promise<boolean> => {
    isOTPLoading.value = true
    otpError.value = null
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/otp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to send OTP')
      }
      
      const result: OTPResponse = await response.json()
      
      if (result.success) {
        isOTPSent.value = true
        otpExpiry.value = result.data.expires_at
        return true
      }
      
      throw new Error(result.message || 'Failed to send OTP')
      
    } catch (err) {
      otpError.value = err instanceof Error ? err.message : 'Failed to send OTP'
      return false
    } finally {
      isOTPLoading.value = false
    }
  }
  
  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    isVerifyLoading.value = true
    otpError.value = null
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/otp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, otp })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'OTP verification failed')
      }
      
      const result: VerifyOTPResponse = await response.json()
      
      if (result.success && result.data.email_verified) {
        // Redirect to dashboard after successful verification
        await router.push('/user/dashboard')
        return true
      }
      
      throw new Error(result.message || 'OTP verification failed')
      
    } catch (err) {
      otpError.value = err instanceof Error ? err.message : 'OTP verification failed'
      return false
    } finally {
      isVerifyLoading.value = false
    }
  }
  
  const resendOTP = async (email: string): Promise<boolean> => {
    return await sendOTP(email)
  }
  
  const clearErrors = () => {
    error.value = null
    otpError.value = null
  }
  
  const resetStore = () => {
    isLoading.value = false
    isOTPLoading.value = false
    isVerifyLoading.value = false
    error.value = null
    otpError.value = null
    currentEmail.value = ''
    otpExpiry.value = ''
    isOTPSent.value = false
  }
  
  return {
    // State
    isLoading,
    isOTPLoading,
    isVerifyLoading,
    error,
    otpError,
    currentEmail,
    otpExpiry,
    isOTPSent,

    // Actions
    register,
    sendOTP,
    verifyOTP,
    resendOTP,
    clearErrors,
    resetStore
}
})
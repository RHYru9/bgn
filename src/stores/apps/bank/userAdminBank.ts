import { defineStore } from 'pinia'
import api from '@/services/axiosInstance'
import axios from 'axios'

// Tipe data
interface Bank {
  id: number
  user_id: number
  nama_rekening: string
  bank_tipe: 'dana' | 'ovo' | 'gopay' | 'bca' | 'bni' | 'bri' | 'mandiri' | 'btn' | 'transfer'
  no_rekening: string
  created_at?: string
  updated_at?: string
  user?: {
    id: number
    name: string
    role: string
  }
}

interface PermintaanBuatBank {
  nama_rekening: string
  bank_tipe: Bank['bank_tipe']
  no_rekening: string
  user_id?: number // Hanya untuk admin
}

interface PermintaanUbahBank {
  nama_rekening: string
  bank_tipe: Bank['bank_tipe']
  no_rekening: string
  user_id?: number // Hanya untuk admin
}

interface BankAdminSaja {
  nama_rekening: string
  bank_tipe: string
  no_rekening: string
}

export const useUserAdminBankStore = defineStore('userAdminBank', {
  state: () => ({
    semuaBank: [] as Bank[],
    bankSaya: [] as Bank[],
    bankAdmin: [] as BankAdminSaja[],
    bankTerpilih: null as Bank | null,
    memuat: false,
    galat: null as string | null
  }),

  actions: {
    // ===== UNTUK PENGGUNA BIASA =====

    async ambilBankSaya() {
      this.memuat = true
      this.galat = null

      try {
        const response = await api.get('/my-banks')
        this.bankSaya = response.data
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          this.galat = error.response.data?.message || 'Gagal mengambil data bank saya'
        } else {
          this.galat = 'Gagal mengambil data bank saya'
        }
        throw error
      } finally {
        this.memuat = false
      }
    },

    async ambilBankAdmin() {
      this.memuat = true
      this.galat = null

      try {
        const response = await api.get('/admin-banks')
        this.bankAdmin = response.data
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          this.galat = error.response.data?.message || 'Gagal mengambil data bank admin'
        } else {
          this.galat = 'Gagal mengambil data bank admin'
        }
        throw error
      } finally {
        this.memuat = false
      }
    },

    async ambilDetailBank(id: number) {
      this.memuat = true
      this.galat = null

      try {
        const response = await api.get(`/banks/${id}`)
        this.bankTerpilih = response.data
        return response.data
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          this.galat = error.response.data?.message || 'Gagal mengambil detail bank'
        } else {
          this.galat = 'Gagal mengambil detail bank'
        }
        throw error
      } finally {
        this.memuat = false
      }
    },

    async buatBankSaya(dataBank: Omit<PermintaanBuatBank, 'user_id'>) {
      this.memuat = true
      this.galat = null

      try {
        const response = await api.post('/banks', dataBank)
        this.bankSaya.push(response.data)
        return response.data
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          this.galat = error.response.data?.message || 'Gagal membuat bank'
        } else {
          this.galat = 'Gagal membuat bank'
        }
        throw error
      } finally {
        this.memuat = false
      }
    },

    async ubahBankSaya(id: number, dataBank: Omit<PermintaanUbahBank, 'user_id'>) {
      this.memuat = true
      this.galat = null

      try {
        const response = await api.put(`/banks/${id}`, dataBank)

        const index = this.bankSaya.findIndex(bank => bank.id === id)
        if (index !== -1) {
          this.bankSaya[index] = response.data
        }

        if (this.bankTerpilih?.id === id) {
          this.bankTerpilih = response.data
        }

        return response.data
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          this.galat = error.response.data?.message || 'Gagal mengubah bank'
        } else {
          this.galat = 'Gagal mengubah bank'
        }
        throw error
      } finally {
        this.memuat = false
      }
    },

    async hapusBankSaya(id: number) {
      this.memuat = true
      this.galat = null

      try {
        await api.delete(`/banks/${id}`)
        this.bankSaya = this.bankSaya.filter(bank => bank.id !== id)

        if (this.bankTerpilih?.id === id) {
          this.bankTerpilih = null
        }

        return true
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          this.galat = error.response.data?.message || 'Gagal menghapus bank'
        } else {
          this.galat = 'Gagal menghapus bank'
        }
        throw error
      } finally {
        this.memuat = false
      }
    },

    // ===== UNTUK ADMIN =====

    async ambilSemuaBank() {
      this.memuat = true
      this.galat = null

      try {
        const response = await api.get('/banks')
        this.semuaBank = response.data
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          this.galat = error.response.data?.message || 'Gagal mengambil semua bank'
        } else {
          this.galat = 'Gagal mengambil semua bank'
        }
        throw error
      } finally {
        this.memuat = false
      }
    },

    async buatBankSebagaiAdmin(dataBank: PermintaanBuatBank) {
      this.memuat = true
      this.galat = null

      try {
        const response = await api.post('/banks', dataBank)
        this.semuaBank.push(response.data)
        return response.data
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          this.galat = error.response.data?.message || 'Gagal membuat bank'
        } else {
          this.galat = 'Gagal membuat bank'
        }
        throw error
      } finally {
        this.memuat = false
      }
    },

    async ubahBankSebagaiAdmin(id: number, dataBank: PermintaanUbahBank) {
      this.memuat = true
      this.galat = null

      try {
        const response = await api.put(`/banks/${id}`, dataBank)

        const index = this.semuaBank.findIndex(bank => bank.id === id)
        if (index !== -1) {
          this.semuaBank[index] = response.data
        }

        if (this.bankTerpilih?.id === id) {
          this.bankTerpilih = response.data
        }

        return response.data
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          this.galat = error.response.data?.message || 'Gagal mengubah bank'
        } else {
          this.galat = 'Gagal mengubah bank'
        }
        throw error
      } finally {
        this.memuat = false
      }
    },

    async hapusBankSebagaiAdmin(id: number) {
      this.memuat = true
      this.galat = null

      try {
        await api.delete(`/banks/${id}`)
        this.semuaBank = this.semuaBank.filter(bank => bank.id !== id)

        if (this.bankTerpilih?.id === id) {
          this.bankTerpilih = null
        }

        return true
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          this.galat = error.response.data?.message || 'Gagal menghapus bank'
        } else {
          this.galat = 'Gagal menghapus bank'
        }
        throw error
      } finally {
        this.memuat = false
      }
    },

    // ===== UTILITAS BERSAMA =====

    hapusGalat() {
      this.galat = null
    },

    hapusBankTerpilih() {
      this.bankTerpilih = null
    },

    resetStore() {
      this.semuaBank = []
      this.bankSaya = []
      this.bankAdmin = []
      this.bankTerpilih = null
      this.memuat = false
      this.galat = null
    },

    validasiDataBank(dataBank: PermintaanBuatBank | PermintaanUbahBank): boolean {
      const { bank_tipe, no_rekening } = dataBank

      const tipeValid = ['dana', 'ovo', 'gopay', 'bca', 'bni', 'bri', 'mandiri', 'btn', 'transfer']
      if (!tipeValid.includes(bank_tipe)) {
        this.galat = 'Tipe bank tidak valid'
        return false
      }

      const panjangMaksimum = ['dana', 'ovo', 'gopay'].includes(bank_tipe) ? 14 : 20
      if (no_rekening.length > panjangMaksimum) {
        this.galat = `Nomor rekening tidak boleh lebih dari ${panjangMaksimum} digit untuk ${bank_tipe}`
        return false
      }

      return true
    }
  },

  getters: {
    bankBerdasarkanPeran: (state) => (role: string) => {
      return state.semuaBank.filter(bank => bank.user?.role === role)
    },

    ambilBankDenganId: (state) => (id: number) => {
      return state.semuaBank.find(bank => bank.id === id) ||
             state.bankSaya.find(bank => bank.id === id)
    },

    sayaPunyaBank: (state) => {
      return state.bankSaya.length > 0
    },

    bankDenganTipe: (state) => (tipe: Bank['bank_tipe']) => {
      return state.semuaBank.filter(bank => bank.bank_tipe === tipe)
    },

    bankSayaDenganTipe: (state) => (tipe: Bank['bank_tipe']) => {
      return state.bankSaya.filter(bank => bank.bank_tipe === tipe)
    }
  }
})

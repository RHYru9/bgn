import { defineStore } from 'pinia'
import axios from 'axios'

interface User {
  id: number
  nama: string
  email: string
  no_hp: string
  alamat: string
  kode_pos: string
  role: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

interface Transaksi {
  id: number
  kode_transaksi: string
  user_id: number
  tanggal_pesanan: string
  total_harga: string
  status_pembayaran: string
  status_pengiriman: string
  jenis_pengiriman: string
  metode_pembayaran: string
  tanggal_jatuh_tempo: string
  alamat_pengiriman: string
  kode_pos: string
  catatan_pembeli: string
  created_at: string
  updated_at: string
  user: User
}

export const useTransaksiStore = defineStore('transaksi', {
  state: () => ({
    transaksiList: [] as Transaksi[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    totalTransaksi(): number {
      return this.transaksiList.length
    },
    totalNilaiTransaksi(): number {
      return this.transaksiList.reduce((sum, transaksi) => sum + parseFloat(transaksi.total_harga), 0)
    },
    paidTransaksi(): Transaksi[] {
      return this.transaksiList.filter(t => t.status_pembayaran === 'lunas')
    },
    pendingTransaksi(): Transaksi[] {
      return this.transaksiList.filter(t => t.status_pembayaran === 'belum_bayar')
    },
    overdueTransaksi(): Transaksi[] {
      const today = new Date()
      return this.transaksiList.filter(t => {
        const dueDate = new Date(t.tanggal_jatuh_tempo)
        return t.status_pembayaran === 'belum_bayar' && dueDate < today
      })
    },
    monthlyData(): any {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
      const data = {
        total: Array(12).fill(0),
        paid: Array(12).fill(0),
        pending: Array(12).fill(0),
        overdue: Array(12).fill(0)
      }

      this.transaksiList.forEach(transaksi => {
        const date = new Date(transaksi.tanggal_pesanan)
        const month = date.getMonth()
        
        data.total[month] += parseFloat(transaksi.total_harga)
        
        if (transaksi.status_pembayaran === 'lunas') {
          data.paid[month] += parseFloat(transaksi.total_harga)
        } else if (transaksi.status_pembayaran === 'belum_bayar') {
          data.pending[month] += parseFloat(transaksi.total_harga)
          
          const dueDate = new Date(transaksi.tanggal_jatuh_tempo)
          if (dueDate < new Date()) {
            data.overdue[month] += parseFloat(transaksi.total_harga)
          }
        }
      })

      return { months, data }
    }
  },

  actions: {
    async fetchTransaksi(token: string) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/transaksi', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        this.transaksiList = response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Gagal memuat transaksi.'
      } finally {
        this.loading = false
      }
    },
  },
})
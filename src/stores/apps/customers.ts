import { defineStore } from 'pinia';
import axios from 'axios';

interface Customer {
  id: number;
  nama: string;
  email: string;
  no_hp?: string;
  alamat?: string;
  kode_pos?: string;
  role: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Transaction {
  id: number;
  kode_transaksi: string;
  user_id: number;
  tanggal_pesanan: string;
  total_harga: string;
  status_pembayaran: string;
  id_barang: number;
  status_pengiriman: string;
  jenis_pengiriman: string;
  metode_pembayaran: string;
  tanggal_jatuh_tempo: string;
  alamat_pengiriman: string;
  kode_pos: string;
  catatan_pembeli: string;
  created_at: string;
  updated_at: string;
  user?: Customer;
}

interface TransactionCreate {
  user_id: number;
  tanggal_pesanan: string;
  total_harga: number;
  status_pembayaran: string;
  status_pengiriman: string;
  jenis_pengiriman: string;
  metode_pembayaran: string;
  tanggal_jatuh_tempo: string;
  alamat_pengiriman: string;
  kode_pos: string;
  catatan_pembeli: string;
}

interface TransactionUpdate {
  status_pembayaran?: string;
  status_pengiriman?: string;
  tanggal_jatuh_tempo?: string;
  alamat_pengiriman?: string;
  kode_pos?: string;
  catatan_pembeli?: string;
}

export const useCustomers = defineStore('customers', {
  state: () => ({
    customers: [] as Customer[],
    currentCustomer: null as Customer | null,
    transactions: [] as Transaction[],
    currentTransaction: null as Transaction | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    // Customer management methods
    async fetchCustomers() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token tidak ditemukan');

        const res = await axios.get('http://localhost:8000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data && res.data.data) {
          this.customers = res.data.data;
        } else {
          throw new Error('Format respons tidak valid');
        }
      } catch (error: any) {
        console.error('Gagal mengambil data:', error);
        this.error = error.response?.data?.message || error.message || 'Gagal mengambil data';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchCustomer(id: number) {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token tidak ditemukan');

        const response = await axios.get(`http://localhost:8000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.currentCustomer = response.data;
        return response.data;
      } catch (error: any) {
        console.error('Gagal mengambil data customer:', error);
        this.error = error.response?.data?.message || error.message || 'Gagal mengambil data customer';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateCustomer(id: number, data: Partial<Customer>) {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token tidak ditemukan');

        const response = await axios.put(`http://localhost:8000/api/users/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Update local state
        const index = this.customers.findIndex(c => c.id === id);
        if (index !== -1) {
          this.customers[index] = { ...this.customers[index], ...response.data.user };
        }

        if (this.currentCustomer && this.currentCustomer.id === id) {
          this.currentCustomer = { ...this.currentCustomer, ...response.data.user };
        }

        return response.data;
      } catch (error: any) {
        console.error('Gagal mengupdate customer:', error);
        this.error = error.response?.data?.message || error.message || 'Gagal mengupdate customer';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteCustomer(id: number) {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token tidak ditemukan');

        const response = await axios.delete(`http://localhost:8000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Remove from local state
        this.customers = this.customers.filter(customer => customer.id !== id);
        
        // Clear current customer if it's the one being deleted
        if (this.currentCustomer && this.currentCustomer.id === id) {
          this.currentCustomer = null;
        }

        return response.data?.message || 'User berhasil dihapus';
      } catch (error: any) {
        console.error('Error menghapus user:', error);
        
        let errorMessage = 'Gagal menghapus user';
        if (error.response) {
          if (error.response.status === 404) {
            errorMessage = 'User tidak ditemukan';
          } else if (error.response.status === 400) {
            errorMessage = error.response.data.message || 'Tidak dapat menghapus akun admin sendiri';
          } else if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.error = errorMessage;
        throw new Error(errorMessage);
      } finally {
        this.loading = false;
      }
    },

    async fetchTransactions() {
      try {
        this.loading = true;
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token tidak ditemukan');

        const response = await axios.get('http://localhost:8000/api/transaksi', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        this.transactions = Array.isArray(response.data) ? response.data : (response.data.data || []);
        this.loading = false;
      } catch (error: any) {
        this.loading = false;
        this.error = error.response?.data?.message || error.message || 'Gagal mengambil data transaksi';
        console.error('Error fetching transactions:', error);
        throw error;
      }
    },
    
    async createTransaction(data: TransactionCreate) {
      try {
        this.loading = true;
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token tidak ditemukan');

        const response = await axios.post('http://localhost:8000/api/transaksi', data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const newTransaction = response.data.data;
        
        // Add to local state if successful
        if (newTransaction && newTransaction.id) {
          this.transactions.push(newTransaction);
        }
        
        this.loading = false;
        return response.data;
      } catch (error: any) {
        this.loading = false;
        this.error = error.response?.data?.message || error.message || 'Gagal membuat transaksi';
        console.error('Error creating transaction:', error);
        throw error;
      }
    },
    
    async deleteTransaction(id: number) {
      try {
        this.loading = true;
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token tidak ditemukan');

        await axios.delete(`http://localhost:8000/api/transaksi/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Remove the deleted transaction from the state
        this.transactions = this.transactions.filter(item => item.id !== id);
        this.loading = false;
        return 'Transaksi berhasil dihapus';
      } catch (error: any) {
        this.loading = false;
        this.error = error.response?.data?.message || error.message || 'Gagal menghapus transaksi';
        console.error('Error deleting transaction:', error);
        throw error;
      }
    },
    
    async getTransactionById(id: number) {
      try {
        this.loading = true;
        this.error = null;
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token tidak ditemukan');

        const response = await axios.get(`http://localhost:8000/api/transaksi/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Store the current transaction
        this.currentTransaction = response.data.data || response.data;
        
        this.loading = false;
        return this.currentTransaction;
      } catch (error: any) {
        this.loading = false;
        this.error = error.response?.data?.message || error.message || `Gagal mengambil transaksi #${id}`;
        console.error(`Error fetching transaction #${id}:`, error);
        throw error;
      }
    },
    
    async updateTransaction(id: number, data: TransactionUpdate) {
      try {
        this.loading = true;
        this.error = null;
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token tidak ditemukan');

        const response = await axios.put(`http://localhost:8000/api/transaksi/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const updatedTransaction = response.data.data;
        
        // Update both transactions list and current transaction in state
        if (updatedTransaction) {
          // Update in transactions array
          const index = this.transactions.findIndex(item => item.id === id);
          if (index !== -1) {
            this.transactions[index] = { 
              ...this.transactions[index], 
              ...updatedTransaction
            };
          }
          
          // Update currentTransaction if it's the one being updated
          if (this.currentTransaction && this.currentTransaction.id === id) {
            this.currentTransaction = {
              ...this.currentTransaction,
              ...updatedTransaction
            };
          }
        }
        
        this.loading = false;
        return response.data;
      } catch (error: any) {
        this.loading = false;
        this.error = error.response?.data?.message || error.message || `Gagal memperbarui transaksi #${id}`;
        console.error(`Error updating transaction #${id}:`, error);
        throw error;
      }
    },
  },

  getters: {
    getCustomers: (state) => state.customers,
    getTransactions: (state) => state.transactions,
    getCurrentTransaction: (state) => state.currentTransaction
  }
});
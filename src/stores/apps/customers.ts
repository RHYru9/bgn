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

export const useCustomers = defineStore('customers', {
  state: () => ({
    customers: [] as Customer[],
    currentCustomer: null as Customer | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
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
    }
  },

  getters: {
    getCustomers: (state) => state.customers
  }
});
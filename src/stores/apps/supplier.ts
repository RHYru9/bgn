import { defineStore } from 'pinia';
import axios from 'axios';

export interface Supplier {
  id: number;
  nama: string;          // sesuaikan properti 'nama' (bukan nama_supplier)
  alamat: string;
  no_telp: string;        // sesuaikan properti 'no_telp' (bukan telepon)
  email?: string;
  kontak_person?: string;
  kategori?: string;      // tambahan properti kategori
  kode_pos?: string;      // tambahan properti kode_pos
  created_at: string;
  updated_at: string;
}

export const useSuppliers = defineStore('suppliers', {
  state: () => ({
    suppliers: [] as Supplier[],
    currentSupplier: null as Supplier | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    getSuppliers: (state) => state.suppliers,
    getCurrentSupplier: (state) => state.currentSupplier,
    isLoading: (state) => state.loading,
    getError: (state) => state.error
  },

  actions: {
    getAuthHeader() {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan');
      return {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      };
    },

    async fetchSuppliers() {
      this.loading = true;
      this.error = null;
      try {
        const config = this.getAuthHeader();
        const response = await axios.get('http://localhost:8000/api/suppliers', config);
        if (response.data && Array.isArray(response.data.data)) {
          this.suppliers = response.data.data;
        } else {
          throw new Error('Format respons tidak valid');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Gagal mengambil data supplier';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchSupplier(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const config = this.getAuthHeader();
        const response = await axios.get(`http://localhost:8000/api/suppliers/${id}`, config);
        this.currentSupplier = response.data.data || response.data;
        return this.currentSupplier;
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Gagal mengambil data supplier';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createSupplier(data: Partial<Supplier>) {
      this.loading = true;
      this.error = null;
      try {
        const config = this.getAuthHeader();
        config.headers['Content-Type'] = 'application/json';
        const response = await axios.post('http://localhost:8000/api/suppliers', data, config);
        if (response.data && response.data.data) {
          this.suppliers.push(response.data.data);
        }
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Gagal membuat supplier';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateSupplier(id: number, data: Partial<Supplier>) {
      this.loading = true;
      this.error = null;
      try {
        const config = this.getAuthHeader();
        config.headers['Content-Type'] = 'application/json';
        const response = await axios.put(`http://localhost:8000/api/suppliers/${id}`, data, config);
        if (response.data && response.data.data) {
          const index = this.suppliers.findIndex(s => s.id === id);
          if (index !== -1) {
            this.suppliers[index] = { ...this.suppliers[index], ...response.data.data };
          }
          if (this.currentSupplier && this.currentSupplier.id === id) {
            this.currentSupplier = { ...this.currentSupplier, ...response.data.data };
          }
        }
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Gagal memperbarui supplier';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteSupplier(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const config = this.getAuthHeader();
        await axios.delete(`http://localhost:8000/api/suppliers/${id}`, config);
        this.suppliers = this.suppliers.filter(s => s.id !== id);
        if (this.currentSupplier && this.currentSupplier.id === id) {
          this.currentSupplier = null;
        }
        return 'Supplier berhasil dihapus';
      } catch (error: any) {
        if (error.response?.status === 404) {
          this.error = 'Supplier tidak ditemukan';
        } else {
          this.error = error.response?.data?.message || error.message || 'Gagal menghapus supplier';
        }
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    },
  }
});

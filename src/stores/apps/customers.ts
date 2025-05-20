import { defineStore } from 'pinia';
import axios from 'axios';

export const useCustomers = defineStore('customers', {
    state: () => ({
        customers: [] as any[],
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

        async deleteCustomer(id: number) {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Token tidak ditemukan');

                const response = await axios.delete(`http://localhost:8000/api/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Periksa jika penghapusan berhasil
                if (response.status === 200) {
                    // Hapus dari state lokal
                    this.customers = this.customers.filter(customer => customer.id !== id);
                    return response.data?.message || 'User berhasil dihapus';
                }
                throw new Error('Gagal menghapus user');
            } catch (error: any) {
                console.error('Error menghapus user:', error);
                
                let errorMessage = 'Gagal menghapus user';
                if (error.response) {
                    // Handle error spesifik dari API
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
                
                throw new Error(errorMessage);
            }
        }
    },

    getters: {
        getCustomers: (state) => state.customers
    }
});
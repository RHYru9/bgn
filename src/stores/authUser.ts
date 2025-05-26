// src/stores/authuser.ts
import { defineStore } from 'pinia';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

export const useUsersStore = defineStore('authuser', {
  state: () => ({
    currentUser: null as null | {
      id: number;
      name: string;
      email: string;
      role: string;
      // tambahkan properti lain sesuai response /auth/me
    },
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.currentUser,
    isAdmin: (state) => state.currentUser?.role === 'admin',
    isCustomer: (state) => state.currentUser?.role === 'user',
    isDriver: (state) => state.currentUser?.role === 'driver',
  },

  actions: {
    async getCurrentUser() {
      this.loading = true;
      this.error = null;

      try {
        const user = await fetchWrapper.get(`${baseUrl}/auth/me`);
        this.currentUser = user;
      } catch (err: any) {
        this.error = err.message || 'Gagal mengambil data user';
        this.currentUser = null;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.currentUser = null;
      localStorage.removeItem('token');
    }
  }
});

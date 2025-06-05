import { defineStore } from 'pinia';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';

const baseUrl = 'http://127.0.0.1:8000/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'driver' | string;
}

export const useUsersStore = defineStore('authuser', {
  state: () => ({
    currentUser: null as User | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.currentUser,
    isAdmin: (state): boolean => state.currentUser?.role === 'admin',
    isCustomer: (state): boolean => state.currentUser?.role === 'user',
    isDriver: (state): boolean => state.currentUser?.role === 'driver',
    currentRole: (state): string | null => state.currentUser?.role || null,
  },

  actions: {
    async getCurrentUser(): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('token');
        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        const user = await fetchWrapper.get<User>(`${baseUrl}/auth/me`, headers);
        this.currentUser = user;
      } catch (err: unknown) {
        if (err instanceof Error) {
          this.error = err.message;
        } else {
          this.error = 'Gagal mengambil data user';
        }
        this.currentUser = null;
      } finally {
        this.loading = false;
      }
    },

    logout(): void {
      this.currentUser = null;
      localStorage.removeItem('token');
    }
  }
});

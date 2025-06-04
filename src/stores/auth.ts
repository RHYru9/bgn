import { defineStore } from 'pinia';
import axios, { AxiosError } from 'axios';
import { router } from '@/router';

interface User {
  id: number;
  nama: string;
  email: string;
  role: 'admin' | 'user' | 'driver';
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
    token: localStorage.getItem('token') as string | null,
    returnUrl: null as string | null,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!(state.token && state.user),
    isAdmin: (state): boolean => state.user?.role === 'admin',
  },

  actions: {
    async login(email: string, password: string): Promise<void> {
      try {
        const response = await axios.post('/api/auth/login', { email, password });

        const { access_token, user } = response.data.data;

        this.token = access_token;
        this.user = user;

        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

        // ✅ Redirect berdasarkan role
        let redirectPath = '/dashboard/default';
        if (user.role === 'user') {
          redirectPath = '/user/dashboard';
        } else if (user.role === 'driver') {
          redirectPath = '/driver/dashboard';
        }

        router.push(this.returnUrl || redirectPath);
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        const message = err.response?.data?.message || 'Login gagal';
        throw new Error(message);
      }
    },

    logout(): void {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      router.push('/login');
    },

    initializeAuth(): void {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user) {
        this.token = token;
        this.user = JSON.parse(user) as User;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    }
  }
});

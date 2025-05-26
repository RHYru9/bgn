// src/stores/auth.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import { router } from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as any,
    token: localStorage.getItem('token') as string | null,
    returnUrl: null as string | null,
  }),
  
  getters: {
    // Tambahkan getter isAuthenticated
    isAuthenticated: (state) => {
      return !!(state.token && state.user);
    },
    
    // Getter tambahan untuk mengecek role admin (opsional)
    isAdmin: (state) => {
      return state.user?.role === 'admin';
    }
  },

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await axios.post('/api/auth/login', {
          email,
          password,
        });

        const { access_token, user } = response.data.data;
        
        this.token = access_token;
        this.user = user;
        
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        // Arahkan ke returnUrl atau dashboard default
        router.push(this.returnUrl || '/dashboard/default');
      } catch (error: any) {
        const message = error.response?.data?.message || 'Login gagal';
        throw message;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');  
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      router.push('/login');
    },

    // Method untuk initialize auth state saat aplikasi dimuat
    initializeAuth() {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        this.token = token;
        this.user = JSON.parse(user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    }
  }
});
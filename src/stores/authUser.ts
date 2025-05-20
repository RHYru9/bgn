// src/stores/authuser.ts
import { defineStore } from 'pinia';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

export const useUsersStore = defineStore('authuser', {
  state: () => ({
    currentUser: null as any,
    loading: false,
    error: null as any,
  }),

  actions: {
    async getCurrentUser() {
      this.loading = true;
      this.error = null;

      try {
        // Panggil API /auth/me yang mengembalikan data user
        const user = await fetchWrapper.get(`${baseUrl}/auth/me`);
        this.currentUser = user;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    }
  }
});

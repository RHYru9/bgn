// stores/sudahVerifikasi.ts
import { defineStore } from 'pinia';
import api from '@/services/axiosInstance';

export const useVerifikasiStore = defineStore('verifikasi', {
  state: () => ({
    isVerified: false,
    userData: null as null | { 
      id: number;
      nama: string;
      email: string; //ambil ini email
      email_verifikasi: boolean;
      no_hp: string | null;
      alamat: string | null;
      kode_pos: string | null;
      role: string;
    },
  }),

  getters: {
    userEmail: (state) => state.userData?.email || '',
    isEmailVerified: (state) => state.userData?.email_verifikasi || false,
  },

  actions: {
    async checkVerifikasi() {
      try {
        const response = await api.get('/auth/me');
        const userData = response.data.data;
        
        this.userData = {
          id: userData.id,
          nama: userData.nama,
          email: userData.email,
          email_verifikasi: userData.email_verifikasi,
          no_hp: userData.no_hp,
          alamat: userData.alamat,
          kode_pos: userData.kode_pos,
          role: userData.role,
        };
        
        this.isVerified = userData.email_verifikasi;
      } catch (error) {
        console.error('Gagal memeriksa verifikasi:', error);
      }
    },
  },
});
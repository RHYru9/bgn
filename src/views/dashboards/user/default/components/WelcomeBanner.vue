<script setup lang="ts">
import Banner from '@/assets/images/analytics/welcome-banner.png';
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';

const authStore = useAuthStore();

const userName = computed(() => authStore.user?.nama || 'Pengguna');
</script>

<template>
  <v-card class="welcomeBanner text-surface overflow-hidden" elevation="0" rounded="lg">
    <v-card-text class="py-5 px-md-12 px-6">
      <v-row>
        <v-col cols="12" xl="6" md="7" sm="10">
          <div class="pb-md-8 pt-md-7 pt-5 pb-6">
            <h2 class="text-sm-h2 text-h3">Selamat Datang, {{ userName }}!</h2>
            <p class="text-h6 mb-7">
              Lihat ringkasan aktivitas, pantau status pesanan, dan kelola akun Anda dengan mudah melalui dashboard ini.
            </p>
            <v-btn color="white" variant="outlined" rounded="md" to="/user/dashboard">Lihat Aktivitas Saya</v-btn>
          </div>
        </v-col>
        <v-col cols="12" xl="6" md="5" class="d-md-block d-none">
          <div class="pe-8">
            <v-img :src="Banner" cover class="ms-auto" width="200" alt="welcome banner" />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>


<style lang="scss">
.welcomeBanner {
  background: rgb(var(--v-theme-darkprimary));
  position: relative;
  &::after {
    content: '';
    background-image: url(@/assets/images/analytics/img-dropbox-bg.svg);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    opacity: 0.5;
    background-position: bottom right;
    background-size: 100%;
    background-repeat: no-repeat;
  }
}
</style>

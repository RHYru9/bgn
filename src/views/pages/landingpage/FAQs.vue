<script setup lang="ts">
import { ref } from 'vue';

import Appbar from './Components/AppBarMenu.vue';
import FooterSection from './Components/FooterSection.vue';
import NewsLetter from './Components/NewsLetter.vue';
import { useCustomizerStore } from '@/stores/customizer';

const panel = ref(['pengiriman']);
const customizer = useCustomizerStore();
</script>

<template>
  <v-layout class="flex-column" :class="customizer.actTheme === 'dark' ? 'bg-containerBg' : 'bg-surface'">
    <Appbar />

    <v-row class="justify-center">
      <v-col cols="12" class="py-0">
        <v-main class="mx-0 pt-16 pb-0 position-relative overflow-hidden">
          <div class="bg-blur">
            <div class="round-1"></div>
            <div class="round-2"></div>
          </div>
          <v-container class="maxWidth">
            <v-row class="justify-center py-10">
              <v-col cols="12" lg="5" md="6" sm="8">
                <div class="text-center position-relative pt-3">
                  <h2 class="text-h2 mb-2">Punya Pertanyaan?</h2>
                  <p class="text-h6 text-lightText mb-0">
                    Lihat daftar pertanyaan yang sering diajukan seputar layanan dan pengiriman di BangunGO.
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-main>
      </v-col>

      <v-col cols="12" md="8" lg="7" class="pt-0">
        <div class="py-md-16 py-8 px-4">
          <v-card elevation="0" class="py-0">
            <v-expansion-panels v-model="panel" multiple>
              <v-expansion-panel
                elevation="0"
                value="pengiriman"
              >
                <template #title>
                  <span class="faq-title">Kapan pesanan saya dikirim?</span>
                </template>
                <template #text>
                  Pesanan akan diproses dalam waktu maksimal 1x24 jam hari kerja. Pengiriman dilakukan sesuai dengan area yang Anda pilih dan jadwal pengiriman mitra BangunGO.
                </template>
              </v-expansion-panel>

              <v-expansion-panel
                elevation="0"
                value="cod"
              >
                <template #title>
                  <span class="faq-title">Apakah bisa bayar di tempat (COD)?</span>
                </template>
                <template #text>
                  Untuk saat ini, BangunGO hanya menerima metode pembayaran non-tunai seperti transfer bank, kartu kredit, dan e-wallet.
                </template>
              </v-expansion-panel>

              <v-expansion-panel
                elevation="0"
                value="retur"
              >
                <template #title>
                  <span class="faq-title">Apakah saya bisa mengembalikan barang yang sudah dibeli?</span>
                </template>
                <template #text>
                  Pengembalian barang hanya bisa dilakukan maksimal 3 hari setelah barang diterima dan dalam kondisi belum digunakan. Silakan hubungi layanan pelanggan kami.
                </template>
              </v-expansion-panel>

              <v-expansion-panel
                elevation="0"
                value="mitra"
              >
                <template #title>
                  <span class="faq-title">Bagaimana cara menjadi mitra BangunGO?</span>
                </template>
                <template #text>
                  Anda bisa mendaftar sebagai mitra toko atau supplier melalui halaman 'Gabung Jadi Mitra'. Tim kami akan menghubungi Anda untuk proses verifikasi.
                </template>
              </v-expansion-panel>

              <v-expansion-panel
                elevation="0"
                value="ongkir"
              >
                <template #title>
                  <span class="faq-title">Apakah harga di BangunGO sudah termasuk ongkos kirim?</span>
                </template>
                <template #text>
                  Harga produk belum termasuk ongkos kirim. Biaya pengiriman akan dihitung otomatis saat checkout berdasarkan lokasi pengiriman dan berat pesanan.
                </template>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <NewsLetter />
    <FooterSection />
  </v-layout>
</template>

<style scoped>
.faq-title {
  color: #1e88e5; /* Warna biru (Vuetify primary default) */
  font-weight: 600;
}
</style>

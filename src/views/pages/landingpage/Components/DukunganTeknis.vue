<script setup lang="ts">
import { ref } from 'vue';
import Appbar from './AppBarMenu.vue';
import FooterSection from './FooterSection.vue';
import NewsLetter from './NewsLetter.vue';
import { useCustomizerStore } from '@/stores/customizer';

const customizer = useCustomizerStore();
const panel = ref(['faq']);
</script>

<template>
  <v-layout class="flex-column" :class="customizer.actTheme === 'dark' ? 'bg-containerBg' : 'bg-surface'">
    <Appbar />

    <v-main>
      <v-container class="py-16">
        <v-row class="justify-center mb-10">
          <v-col cols="12" md="8" class="text-center">
            <h1 class="text-h2 mb-2">Pusat Dukungan</h1>
            <p class="text-h6 text-lightText">
              Temukan jawaban dan bantuan seputar layanan BangunGO di sini.
            </p>
          </v-col>
        </v-row>

        <v-row class="justify-center">
          <v-col cols="12" md="8">
            <v-expansion-panels v-model="panel" multiple>
              <v-expansion-panel value="faq">
                <v-expansion-panel-title>
                  <span class="text-primary font-weight-medium">FAQ (Pertanyaan Umum)</span>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  Jawaban atas pertanyaan seputar cara pembelian, pembayaran, pengiriman, dan retur.
                </v-expansion-panel-text>
              </v-expansion-panel>

              <v-expansion-panel value="kontak">
                <v-expansion-panel-title>
                  <span class="text-primary font-weight-medium">Hubungi Kami</span>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  Anda bisa menghubungi kami melalui:
                  <ul class="mt-2">
                    <li>📞 WhatsApp: 0812-3456-7890</li>
                    <li>✉️ Email: support@bangungo.id</li>
                    <li>🕒 Jam Operasional: Senin - Sabtu, 09:00 - 20:00</li>
                  </ul>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <v-expansion-panel value="retur">
                <v-expansion-panel-title>
                  <span class="text-primary font-weight-medium">Pengembalian & Refund</span>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  Pengembalian produk dapat dilakukan maksimal 3 hari setelah diterima, selama produk belum digunakan dan dikembalikan dalam kondisi baik.
                </v-expansion-panel-text>
              </v-expansion-panel>

              <v-expansion-panel value="tracking">
                <v-expansion-panel-title>
                  <span class="text-primary font-weight-medium">Pelacakan Pesanan</span>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  Anda dapat melacak pesanan Anda melalui halaman "Lacak Pesanan" menggunakan nomor invoice Anda.
                </v-expansion-panel-text>
              </v-expansion-panel>

              <v-expansion-panel value="mitra">
                <v-expansion-panel-title>
                  <span class="text-primary font-weight-medium">Dukungan untuk Mitra Toko</span>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  Ingin menjadi mitra BangunGO? Kunjungi halaman "karir" dan "Gabung Jadi Mitra" atau hubungi tim kemitraan kami.
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <NewsLetter />
    <FooterSection />
  </v-layout>
</template>

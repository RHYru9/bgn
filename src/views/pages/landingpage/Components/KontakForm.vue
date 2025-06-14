<script setup lang="ts">
import Appbar from './AppBarMenu.vue';
import FooterSection from './FooterSection.vue';
import NewsLetter from './NewsLetter.vue';
import { useCustomizerStore } from '@/stores/customizer';

const customizer = useCustomizerStore();
</script>

<template>
  <v-layout class="flex-column" :class="customizer.actTheme === 'dark' ? 'bg-containerBg' : 'bg-surface'">
    <Appbar />

    <v-main class="bg-surface">
      <v-container class="py-16">
        <!-- Header Section -->
        <v-row class="justify-center mb-10">
          <v-col cols="12" md="8" class="text-center">
            <h1 class="text-h2 mb-4 text-primary">Hubungi Kami</h1>
            <p class="text-h6 text-lightText">
              Kami siap membantu Anda! Jangan ragu untuk menghubungi tim BangunGO melalui informasi kontak atau kirim pesan langsung.
            </p>
          </v-col>
        </v-row>

        <!-- Informasi Kontak & Form -->
        <v-row class="justify-center mb-16">
          <v-col cols="12" md="5" class="px-4">
            <v-card elevation="1" class="pa-6 rounded-xl">
              <h2 class="text-h5 mb-6 text-primary">Informasi Kontak</h2>
              
              <div class="d-flex align-center mb-4">
                <v-icon class="me-3">mdi-map-marker</v-icon>
                <div>
                  <p class="text-subtitle-2 mb-1">Alamat</p>
                  <p class="text-body-1">Jl. Al.Baidho I, Lubang Buaya, Jakarta Timur, 13810</p>
                </div>
              </div>

              <div class="d-flex align-center mb-4">
                <v-icon class="me-3">mdi-phone</v-icon>
                <div>
                  <p class="text-subtitle-2 mb-1">Telepon</p>
                  <p class="text-body-1">0812-3456-7890</p>
                </div>
              </div>

              <div class="d-flex align-center mb-4">
                <v-icon class="me-3">mdi-email</v-icon>
                <div>
                  <p class="text-subtitle-2 mb-1">Email</p>
                  <p class="text-body-1">support@bangungo.id</p>
                </div>
              </div>

              <div class="d-flex align-center">
                <v-icon class="me-3">mdi-clock</v-icon>
                <div>
                  <p class="text-subtitle-2 mb-1">Jam Operasional</p>
                  <p class="text-body-1">Senin - Jumat, 09.00 - 17.00 WIB</p>
                </div>
              </div>
            </v-card>
            <v-card class="mt-6 pa-4 rounded-lg">
                <h3 class="text-h6 text-primary mb-2">Info Lainnya</h3>
                <p class="text-body-1">
                  Kami juga menyediakan berbagai macam layanan untuk proyek konstruksi skala besar dan kecil.
                  Jika Anda membutuhkan konsultasi atau layanan lainnya, silakan hubungi kami di nomor yang tertera.
                </p>
              </v-card>
          </v-col>

          <v-col cols="12" md="7" class="px-4">
            <v-card elevation="1" class="pa-6 rounded-xl">
              <h2 class="text-h5 mb-6 text-primary">Kirim Pesan</h2>

              <v-form>
                <v-text-field
                  label="Nama Anda"
                  variant="outlined"
                  color="primary"
                  class="mb-4"
                  persistent-placeholder
                ></v-text-field>

                <v-text-field
                  label="Email"
                  type="email"
                  variant="outlined"
                  color="primary"
                  class="mb-4"
                  persistent-placeholder
                ></v-text-field>

                <v-textarea
                  label="Pesan"
                  variant="outlined"
                  color="primary"
                  rows="4"
                  class="mb-4"
                  persistent-placeholder
                ></v-textarea>

                <v-btn 
                  color="primary"
                  size="large"
                  block
                  rounded="md"
                >
                  Kirim Pesan
                </v-btn>
              </v-form>
            </v-card>
          </v-col>
        </v-row>

        <!-- Google Map -->
        <v-row class="justify-center">
          <v-col cols="12">
            <v-card elevation="0" class="overflow-hidden rounded-xl" style="height: 450px;">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1982.8781922555834!2d106.8989855282666!3d-6.29571206371258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ed5885fc9dbf%3A0x46f52d650b8b7019!2sJl.%20Al.Baidho%20I%2C%20Lubang%20Buaya%2C%20Kec.%20Cipayung%2C%20Kota%20Jakarta%20Timur%2C%20Daerah%20Khusus%20Ibukota%20Jakarta%2013810!5e0!3m2!1sen!2sid!4v1748512201988!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style="border: 0;"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <NewsLetter />
    <FooterSection />
  </v-layout>
</template>

<style scoped>
/* No additional CSS needed - using Vuetify classes */
</style>
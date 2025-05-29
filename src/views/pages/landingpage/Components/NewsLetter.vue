<template>
  <div class="spacer custom-blue">
    <v-container class="py-8">
      <v-row class="align-center">
        <v-col cols="12" md="8" lg="9">
          <h2 class="text-h2 text-white mb-2">Tetap terhubung dengan kami</h2>
          <p class="text-body-1 text-white">
            Masukkan email Anda, dan kami akan membagikan kabar terbaru seputar pembaruan fitur, roadmap, dan berita Toko BangunGO.
          </p>
        </v-col>
        <v-col cols="12" sm="12" md="4" lg="3">
          <v-form @submit.prevent="submitEmail">
            <div class="d-flex flex-column flex-sm-row align-center">
              <v-text-field
                v-model="email"
                variant="outlined"
                density="comfortable"
                placeholder="Masukkan email Anda"
                hide-details
                :rules="emailRules"
                class="bg-white rounded-lg me-sm-2 mb-2 mb-sm-0"
                style="flex: 1"
              ></v-text-field>
              <v-btn
                color="white"
                variant="flat"
                size="large"
                rounded="md"
                class="text-primary font-weight-bold elevation-2"
                @click="submitEmail"
              >
                Berlangganan
              </v-btn>
            </div>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
  <v-divider></v-divider>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const emailRules = [
  (v) => !!v || 'Email wajib diisi',
  (v) => /.+@.+\..+/.test(v) || 'Format email tidak valid',
];

const submitEmail = () => {
  if (email.value && /.+@.+\..+/.test(email.value)) {
    alert(`Berhasil berlangganan: ${email.value}`);
    email.value = '';
  }
};
</script>

<style scoped>
.custom-blue {
  background-color: #0066A1;
}
</style>

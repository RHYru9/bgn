<script setup lang="ts">
import SvgSprite from '@/components/shared/SvgSprite.vue';
import imageEmpty from '@/assets/images/e-commerce/empty.png';

interface Props {
  isLoggedIn: boolean;
}

const props = defineProps<Props>();
</script>

<template>
  <v-card variant="outlined" class="bg-surface" rounded="lg">
    <v-card-text>
      <v-row class="justify-center align-center text-lg-start text-center pt-16 pb-6">
        <v-col lg="6" md="8" cols="8" class="text-center">
          <v-img :src="imageEmpty" alt="cover" width="70%" class="mx-auto" />
        </v-col>
        <v-col lg="6" md="8" cols="12">
          <template v-if="!isLoggedIn">
            <h1 class="text-lg-h1 text-h3 mb-1">Anda Belum Login</h1>
            <p class="text-h5 text-lightText">Silakan login terlebih dahulu untuk mengakses keranjang belanja Anda.</p>
            <v-btn class="mt-3" to="/login" rounded="md" variant="flat" size="large" color="primary">
              Login
              <template v-slot:append>
                <SvgSprite name="custom-chevron-outline" style="width: 18px; height: 18px" />
              </template>
            </v-btn>
          </template>

          <template v-else>
            <h1 class="text-lg-h1 text-h3 mb-1">Keranjang Anda Kosong</h1>
            <p class="text-h5 text-lightText">Jelajahi produk kami untuk menambahkan item ke keranjang belanja Anda.</p>
            <v-btn class="mt-3" to="/produk" rounded="md" variant="flat" size="large" color="primary">
              Lihat Produk
              <template v-slot:append>
                <SvgSprite name="custom-chevron-outline" style="width: 18px; height: 18px" />
              </template>
            </v-btn>
          </template>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
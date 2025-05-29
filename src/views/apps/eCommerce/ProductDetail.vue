<script setup lang="ts">
import ProductDetail from '@/components/apps/ecommerce/detail/ProductDetail.vue';
import RelatedProducts from '@/components/apps/ecommerce/detail/RelatedProducts.vue';
import ProductTab from '@/components/apps/ecommerce/detail/ProductTab.vue';
import Appbar from '@/views/pages/landingpage/Components/AppBarMenu.vue';
import FooterSection from '@/views/pages/landingpage/Components/FooterSection.vue';

import { useBarangStore } from '@/stores/apps/barang';
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const store = useBarangStore();
const route = useRoute();
const router = useRouter();

const currentBarangId = computed(() => store.detailBarang?.id || 0);

onMounted(() => {
  store.ambilBarangById(Number(route.params.id));
});

watch(
  () => route.params.id,
  (newId) => {
    store.ambilBarangById(Number(newId));
  }
);
</script>

<template>
  <v-app>
    <!-- Appbar -->
    <Appbar />

    <!-- Main Content -->
    <v-main>
      <v-container class="py-6">
        <v-btn
          prepend-icon="mdi-arrow-left"
          color="secondary"
          variant="outlined"
          class="mb-2"
          @click="router.push('/produk')"
        >
          Halaman Produk
        </v-btn>

        <!-- Detail Produk -->
        <v-card elevation="0" variant="outlined" rounded="lg" class="bg-surface mb-6">
          <v-card-text>
            <ProductDetail />
          </v-card-text>
        </v-card>

        <v-row>
          <!-- Tab Deskripsi / Spesifikasi -->
          <v-col cols="12" md="8">
            <v-card elevation="0" variant="outlined" class="bg-surface" rounded="lg">
              <v-card-text>
                <ProductTab />
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Produk Terkait -->
          <v-col cols="12" md="4">
            <RelatedProducts :currentBarangId="currentBarangId" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Footer -->
    <FooterSection />
  </v-app>
</template>

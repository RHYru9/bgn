<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import ProductDetail from '@/components/apps/ecommerce/detail/ProductDetail.vue';


const route = useRoute();
const barangId = route.params.id as string;
const barang = ref(null);
const loading = ref(true);
const error = ref('');

const fetchDetailBarang = async () => {
  try {
    const res = await axios.get(`/api/barang/${barangId}`);
    if (res.data.success) {
      barang.value = res.data.data;
    } else {
      error.value = res.data.message || 'Gagal memuat data barang';
    }
  } catch (err) {
    error.value = 'Terjadi kesalahan saat mengambil data barang.';
    console.error('Gagal memuat detail barang:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDetailBarang);
</script>

<template>
  <div>
    <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
    <v-skeleton-loader v-if="loading" type="card" class="my-4" />
    <template v-else>
      <v-card elevation="0" variant="outlined" rounded="lg" class="bg-surface mt-2 mb-6">
        <v-card-text>
          <ProductDetail :barang="barang" />
        </v-card-text>
      </v-card>

      <v-row>
        <v-col cols="12" md="8">
          <v-card elevation="0" variant="outlined" class="bg-surface" rounded="lg">
            <v-card-text>
              <ProductTab :barang="barang" />
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <RelatedProducts :kategori="barang?.kategori?.nama" />
        </v-col>
      </v-row>
    </template>
  </div>
</template>

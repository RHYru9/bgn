<script setup lang="ts">
import { computed } from 'vue';
import { useBarangStore } from '@/stores/apps/barang';
import { useRoute } from 'vue-router';
import ProductCarousel from './ProductCarousel.vue';

const store = useBarangStore();
const route = useRoute();

// Ambil detail barang berdasarkan ID dari URL
store.ambilBarangById(route.params.id);

const detailBarang = computed(() => store.detailBarang);
</script>

<template>
  <v-row>
    <v-col cols="12" md="6">
      <ProductCarousel />
    </v-col>
    <v-col cols="12" md="6">
      <div class="d-flex align-center mb-1">
        <v-chip color="primary" variant="flat" size="small" class="me-2" v-if="detailBarang?.kategori">
          {{ detailBarang.kategori.nama_kategori }}
        </v-chip>
        <v-rating
          color="inputBorder"
          active-color="warning"
          half-increments
          :model-value="4.5"
          density="comfortable"
          size="small"
          readonly
        />
      </div>
      <h2 class="text-h2 mb-2">{{ detailBarang?.nama_barang }}</h2>
      <h3 class="text-h3 mb-4">Rp{{ Number(detailBarang?.harga_jual).toLocaleString('id-ID') }}</h3>
      
      <div class="d-flex align-center ga-4 mb-4">
        <div class="d-flex align-center ga-2">
          <span class="text-subtitle-1 text-lightText">Merek:</span>
          <span class="text-subtitle-1">{{ detailBarang?.merek }}</span>
        </div>
        <v-divider vertical></v-divider>
        <div class="d-flex align-center ga-2">
          <span class="text-subtitle-1 text-lightText">Stok:</span>
          <span class="text-subtitle-1">{{ detailBarang?.stok }} {{ detailBarang?.satuan }}</span>
        </div>
      </div>
      
      <p class="text-subtitle-1 text-lightText mb-6">{{ detailBarang?.deskripsi }}</p>
      
      <v-divider class="mb-4"></v-divider>
      
      <div class="d-flex align-center ga-4 mb-6">
        <v-btn
          color="primary"
          variant="flat"
          rounded="md"
          size="large"
          @click="store.tambahKeKeranjang({
            id: detailBarang?.id || 0,
            kode_barang: detailBarang?.kode_barang || '',
            nama_barang: detailBarang?.nama_barang || '',
            harga_jual: detailBarang?.harga_jual || '0',
            quantity: 1,
            gambar_barang: detailBarang?.gambar_barang || ''
          })"
        >
          <v-icon start icon="$shoppingCartOutline"></v-icon>
          Tambah ke Keranjang
        </v-btn>
        
        <v-btn variant="outlined" color="primary" rounded="md" size="large">
          <v-icon start icon="$heartOutline"></v-icon>
          Favorit
        </v-btn>
      </div>
      
      <div class="bg-containerBg pa-4 rounded-lg">
        <div class="d-flex align-center ga-2 mb-2">
          <v-icon color="primary" icon="$truckOutline"></v-icon>
          <span class="text-subtitle-1">Pengiriman</span>
        </div>
        <p class="text-subtitle-1 text-lightText mb-0">
          Gratis ongkir untuk pembelian di atas Rp500.000. Estimasi pengiriman 2-3 hari kerja.
        </p>
      </div>
    </v-col>
  </v-row>
</template>
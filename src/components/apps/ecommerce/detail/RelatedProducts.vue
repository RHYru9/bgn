<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import { useBarangStore } from '@/stores/apps/barang';
import 'vue3-carousel/dist/carousel.css';
import FloatingCart from '../cart/FloatingCart.vue';

const router = useRouter();
const store = useBarangStore();

const props = defineProps({
  currentBarangId: {
    type: Number,
    required: true
  }
});

onMounted(() => {
  store.ambilSemuaBarang();
});

const wishlist = ref<number[]>([]);
const successSnackbar = ref(false);
const snackbarMessage = ref('');

function toggleWishlist(barangId: number) {
  if (wishlist.value.includes(barangId)) {
    wishlist.value = wishlist.value.filter((id) => id !== barangId);
    snackbarMessage.value = 'Dihapus dari favorit';
  } else {
    wishlist.value.push(barangId);
    snackbarMessage.value = 'Ditambahkan ke favorit';
  }
  successSnackbar.value = true;
}

function isInWishlist(barangId: number) {
  return wishlist.value.includes(barangId);
}
</script>

<template>
  <v-card variant="outlined" class="bg-surface overflow-hidden" rounded="lg">
    <v-card-item>
      <v-card-title class="text-subtitle-1 pa-0">Produk Serupa</v-card-title>
    </v-card-item>
    <v-divider></v-divider>
    <v-card-text class="pa-0">
      <perfect-scrollbar style="height: 265px">
        <v-list class="relatedCar py-0" aria-label="daftar produk" aria-busy="true">
          <v-list-item 
            v-for="(barang, i) in store.barangSerupa(props.currentBarangId)" 
            :value="barang.nama_barang" 
            class="py-2 pt-4 cursor-pointer" 
            :key="i" 
            border
            @click="router.push(`/produk/detail/${barang.id}`)"
          >
            <div class="d-flex">
              <v-avatar size="62" rounded="md" variant="outlined" color="borderLight" class="bg-containerBg">
                <img 
                  :src="`http://127.0.0.1:8000/${barang.gambar_barang}`" 
                  :alt="barang.nama_barang" 
                  width="62" 
                  style="min-width: 62px" 
                />
              </v-avatar>
              <div class="ms-3">
                <h5 class="text-subtitle-1 text-lightText mb-0">{{ barang.nama_barang }}</h5>
                <p class="text-h6 text-lightText text-truncate mb-1">{{ barang.merek }}</p>
                <h5 class="text-h5 text-lightText mb-1">Rp{{ Number(barang.harga_jual).toLocaleString('id-ID') }}</h5>
                <div class="text-caption text-lightText">Stok: {{ barang.stok }} {{ barang.satuan }}</div>
              </div>
            </div>

            <template v-slot:append>
              <v-btn 
                icon 
                variant="text" 
                aria-label="favorit" 
                color="lightText" 
                rounded="md" 
                @click.stop="toggleWishlist(barang.id)"
              >
                <SvgSprite
                  :name="isInWishlist(barang.id) ? 'custom-heart-fill' : 'custom-heart-outline'"
                  :class="isInWishlist(barang.id) ? 'text-error' : 'text-lightText'"
                  style="width: 20px; height: 20px"
                />
              </v-btn>
            </template>
          </v-list-item>

          <v-list-item class="pa-6">
            <v-btn color="secondary" rounded="md" href="/produk" variant="outlined" block>
              Lihat semua produk
            </v-btn>
          </v-list-item>
        </v-list>
      </perfect-scrollbar>
    </v-card-text>

    <v-snackbar
      variant="flat"
      location="top right"
      min-width="100"
      color="success"
      rounded="md"
      class="text-surface"
      v-model="successSnackbar"
    >
      <v-icon class="me-1" size="small" icon="$checkboxMarkedCircleOutline"></v-icon>
      {{ snackbarMessage }}
    </v-snackbar>
  </v-card>

  <FloatingCart />
</template>

<style lang="scss">
.relatedCar {
  .v-list-item {
    .v-list-item__append {
      align-self: flex-start;
    }
    .text-truncate {
      white-space: unset !important;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
}
</style>

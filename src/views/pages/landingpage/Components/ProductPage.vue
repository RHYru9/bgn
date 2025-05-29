<script setup lang="ts">
import { ref, onMounted, computed, watchEffect } from 'vue';
import ProductItemVue from '@/components/apps/ecommerce/listing/ProductItem.vue';
import ProductEmpty from '@/components/apps/ecommerce/listing/ProductEmplty.vue';
import FloatingCart from '@/components/apps/ecommerce/cart/FloatingCart.vue';
import { useBarangStore } from '@/stores/apps/barang';
import { useCartStore } from '@/stores/cart';

const barangStore = useBarangStore();
const cartStore = useCartStore();

const selectedCategory = ref('all');
const priceRange = ref([0, 1000000000]);
const currentPage = ref(1);
const itemsPerPage = 6;

onMounted(async () => {
  cartStore.loadFromStorage();
  await barangStore.ambilSemuaBarang();
  await barangStore.ambilKategori();
});

// Kategori dari store
const kategori = computed(() => {
  return barangStore.kategoriList.map(k => k.nama_kategori);
});

// Filter produk berdasarkan kategori & rentang harga
const filteredProducts = computed(() => {
  if (!barangStore.barangList.length) return [];
  return barangStore.barangList.filter(barang => {
    const kategoriNama = barang.kategori?.nama_kategori ?? '';
    const harga = parseInt(barang.harga_jual);
    const inCategory = selectedCategory.value === 'all' || kategoriNama === selectedCategory.value;
    const inPriceRange = harga >= priceRange.value[0] && harga <= priceRange.value[1];
    return inCategory && inPriceRange;
  });
});

// Paginasi produk
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProducts.value.slice(start, start + itemsPerPage);
});

// Total halaman
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage));

// Tambah produk ke keranjang
function handleAddToCart(product: any) {
  cartStore.addToCart({
    id: product.id,
    kode_barang: product.kode_barang,
    nama_barang: product.nama_barang,
    harga_jual: product.harga_jual,
    quantity: 1,
    gambar_barang: product.gambar_barang
  });
}

// Reset filter
function resetFilters() {
  selectedCategory.value = 'all';
  priceRange.value = [0, 1000000];
  currentPage.value = 1;
}

// Format harga
function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
}

// Debug log (opsional)
watchEffect(() => {
  console.log('Selected Category:', selectedCategory.value);
  console.log('Filtered:', filteredProducts.value.length);
});
</script>

<template>
  <section class="product-section">
    <v-container class="pt-8">
      <div class="text-center mb-6">
        <h2 class="text-h2 mb-2">Produk Yang Tersedia</h2>
        <p class="text-h6 mb-0">Jelajahi Produk Berkualitas, Terjangkau, dan Gratis Antar, untuk pembelian tertentu.</p>
      </div>

      <!-- Filter -->
      <v-card variant="outlined" class="mb-6" rounded="lg">
        <v-card-text class="pa-4">
          <v-row align="center" no-gutters>
            <!-- Category -->
            <v-col cols="12" md="6" class="pe-md-3">
              <v-select
                v-model="selectedCategory"
                :items="[
                  { title: 'Semua Kategori', value: 'all' },
                  ...kategori.map(k => ({ title: k, value: k }))
                ]"
                label="Kategori"
                variant="outlined"
                density="compact"
                hide-details
                prepend-inner-icon="mdi-tag-outline"
                @update:model-value="() => currentPage = 1"
              >
                <template v-slot:selection="{ item }">
                  <span class="text-truncate">{{ item.title }}</span>
                </template>
              </v-select>
            </v-col>

            <!-- Price -->
            <v-col cols="12" md="5" class="px-md-2">
              <div class="price-filter">
                <label class="text-caption text-medium-emphasis mb-1 d-block">
                  Rentang Harga: {{ formatPrice(priceRange[0]) }} - {{ formatPrice(priceRange[1]) }}
                </label>
                <v-range-slider
                  v-model="priceRange"
                  :min="0"
                  :max="1000000"
                  :step="10000"
                  color="primary"
                  track-color="grey-lighten-2"
                  thumb-label="persistent"
                  hide-details
                  @end="() => currentPage = 1"
                >
                  <template v-slot:thumb-label="{ modelValue }">
                    <span class="text-caption">{{ Math.round(modelValue / 1000) }}K</span>
                  </template>
                </v-range-slider>
              </div>
            </v-col>

            <!-- Reset -->
            <v-col cols="12" md="1" class="ps-md-3">
              <v-btn
                v-if="selectedCategory !== 'all' || priceRange[0] !== 0 || priceRange[1] !== 1000000"
                color="error"
                variant="text"
                size="small"
                @click="resetFilters"
                class="w-100"
              >
                <v-icon size="small">mdi-refresh</v-icon>
                <span class="d-md-none ms-2">Reset</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-row>
        <!-- Loading -->
        <v-col cols="12" v-if="barangStore.loading">
          <v-card variant="outlined" class="bg-surface mb-6" rounded="lg">
            <v-card-text class="text-center py-12">
              <v-progress-circular indeterminate color="primary" size="64" />
              <p class="text-h6 mt-4 text-lightText">Memuat produk...</p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Error -->
        <v-col cols="12" v-else-if="barangStore.error">
          <v-card variant="outlined" class="bg-surface mb-6" rounded="lg">
            <v-card-text class="text-center py-12">
              <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
              <p class="text-h6 text-error">{{ barangStore.error }}</p>
              <v-btn color="primary" @click="barangStore.ambilSemuaBarang()" class="mt-4">
                Coba Lagi
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Produk -->
        <v-col cols="12" v-else>
          <div class="d-flex justify-space-between align-center mb-4">
            <div>
              <h3 class="text-h6 mb-1">
                Menampilkan {{ paginatedProducts.length }} dari {{ filteredProducts.length }} produk
              </h3>
              <p class="text-caption text-medium-emphasis" v-if="totalPages > 1">
                Halaman {{ currentPage }} dari {{ totalPages }}
              </p>
            </div>

            <div class="text-end" v-if="filteredProducts.length > 0">
              <v-chip size="small" color="primary" variant="tonal">
                <v-icon start size="small">mdi-package-variant</v-icon>
                {{ filteredProducts.length }} produk
              </v-chip>
            </div>
          </div>

          <!-- Grid Produk -->
          <v-row v-if="paginatedProducts.length" class="mt-2">
            <v-col
              cols="12"
              sm="6"
              md="4"
              lg="4"
              v-for="product in paginatedProducts"
              :key="product.id"
            >
              <ProductItemVue
                :name="product.nama_barang"
                :image="product.gambar_barang ? `http://127.0.0.1:8000/${product.gambar_barang}` : 'https://via.placeholder.com/300x300?text=No+Image'"
                :desc="product.deskripsi"
                :salePrice="parseInt(product.harga_jual)"
                :rating="5"
                :goto="product.id"
                :product="product"
                @handlecart="handleAddToCart"
                @handlewishlist="() => {}"
              />
            </v-col>
          </v-row>

          <ProductEmpty v-else />

          <!-- Pagination -->
          <div class="d-flex justify-center align-center mt-8" v-if="totalPages > 1">
            <v-btn
              :disabled="currentPage === 1"
              variant="outlined"
              size="small"
              @click="currentPage--"
              class="me-2"
            >
              <v-icon size="small">mdi-chevron-left</v-icon>
              <span class="d-none d-sm-inline ms-1">Sebelumnya</span>
            </v-btn>

            <div class="d-flex align-center mx-4">
              <span class="text-body-2 text-medium-emphasis">
                Halaman {{ currentPage }} dari {{ totalPages }}
              </span>
            </div>

            <v-btn
              :disabled="currentPage === totalPages"
              variant="outlined"
              size="small"
              @click="currentPage++"
              class="ms-2"
            >
              <span class="d-none d-sm-inline me-1">Selanjutnya</span>
              <v-icon size="small">mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <FloatingCart />
  </section>
</template>

<style scoped>
.price-filter {
  padding: 0 8px;
}

.v-range-slider :deep(.v-slider-thumb__label) {
  background: rgb(var(--v-theme-primary));
}

.product-section {
  min-height: 60vh;
}

@media (max-width: 960px) {
  .price-filter {
    margin-top: 16px;
    padding: 12px 0;
    border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  }
}
</style>

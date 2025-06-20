<script setup lang="ts">
import { ref, onMounted, computed, watchEffect } from 'vue';
import ProductItemVue from '@/components/apps/ecommerce/listing/ProductItem.vue';
import ProductEmpty from '@/components/apps/ecommerce/listing/ProductEmplty.vue';
import FloatingCart from '@/components/apps/ecommerce/cart/FloatingCart.vue';
import { useBarangStore } from '@/stores/apps/barang';
import { useCartStore } from '@/stores/cart';
import { useWishlistStore } from '@/stores/apps/wishlist';

// Type definitions
interface Product {
  id: number;
  kode_barang: string;
  nama_barang: string;
  harga_jual: string | number;
  deskripsi: string;
  gambar_barang?: string;
  kategori?: {
    nama_kategori: string;
  };
}

interface CartItem {
  id: number;
  kode_barang: string;
  nama_barang: string;
  harga_jual: string | number;
  quantity: number;
  gambar_barang?: string;
}

interface WishlistItem {
  id: number;
  barang_id: number;
}

interface Kategori {
  nama_kategori: string;
}

interface SelectItem {
  title: string;
  value: string;
}

const barangStore = useBarangStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();

const selectedCategory = ref<string>('all');
const priceRange = ref<[number, number]>([0, 1000000000]);
const currentPage = ref<number>(1);
const itemsPerPage: number = 8;

// Snackbar states
const snackbar = ref<boolean>(false);
const snackbarText = ref<string>('');
const snackbarColor = ref<string>('success');

onMounted(async (): Promise<void> => {
  try {
    cartStore.loadFromStorage();
    await barangStore.ambilSemuaBarang();
    await barangStore.ambilKategori();
    await wishlistStore.fetchWishlist();
  } catch (error) {
    console.error('Error loading data:', error);
    showSnackbar('Gagal memuat data', 'error');
  }
});

const kategori = computed((): string[] => {
  return barangStore.kategoriList.map((k: Kategori) => k.nama_kategori);
});

const categoryItems = computed((): SelectItem[] => {
  return [
    { title: 'Semua Kategori', value: 'all' },
    ...kategori.value.map((k: string) => ({ title: k, value: k }))
  ];
});

const filteredProducts = computed((): Product[] => {
  if (!barangStore.barangList.length) return [];
  return barangStore.barangList.filter((barang: Product) => {
    const kategoriNama = barang.kategori?.nama_kategori ?? '';
    const harga = parseInt(barang.harga_jual.toString());
    const inCategory = selectedCategory.value === 'all' || kategoriNama === selectedCategory.value;
    const inPriceRange = harga >= priceRange.value[0] && harga <= priceRange.value[1];
    return inCategory && inPriceRange;
  });
});

const paginatedProducts = computed((): Product[] => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProducts.value.slice(start, start + itemsPerPage);
});

const totalPages = computed((): number => Math.ceil(filteredProducts.value.length / itemsPerPage));

// Check if product is in wishlist
const isInWishlist = (productId: number): boolean => {
  return wishlistStore.wishlist.some((item: WishlistItem) => item.barang_id === productId);
};

function handleAddToCart(product: Product): void {
  const cartItem: CartItem = {
    id: product.id,
    kode_barang: product.kode_barang,
    nama_barang: product.nama_barang,
    harga_jual: product.harga_jual,
    quantity: 1,
    gambar_barang: product.gambar_barang
  };
  cartStore.addToCart(cartItem);
  showSnackbar('Produk ditambahkan ke keranjang');
}

async function handleToggleWishlist(product: Product): Promise<void> {
  try {
    const existingWishlistItem = wishlistStore.wishlist.find(
      (item: WishlistItem) => item.barang_id === product.id
    );
    
    if (existingWishlistItem) {
      // Remove from wishlist if already exists
      await wishlistStore.removeFromWishlist(existingWishlistItem.id);
      showSnackbar('Berhasil dihapus dari wishlist');
    } else {
      // Add to wishlist if not exists
      await wishlistStore.addToWishlist(product.id);
      showSnackbar('Ditambahkan ke wishlist');
    }
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    showSnackbar('Gagal memproses wishlist', 'error');
  }
}

function showSnackbar(message: string, color: string = 'success'): void {
  snackbarText.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
}

function resetFilters(): void {
  selectedCategory.value = 'all';
  priceRange.value = [0, 1000000];
  currentPage.value = 1;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
}

function onCategoryChange(): void {
  currentPage.value = 1;
}

function onPriceRangeEnd(): void {
  currentPage.value = 1;
}

function goToPreviousPage(): void {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function goToNextPage(): void {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

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

      <v-card variant="outlined" class="mb-6" rounded="lg">
        <v-card-text class="pa-4">
          <v-row align="center" no-gutters>
            <v-col cols="12" md="6" class="pe-md-3">
              <v-select
                v-model="selectedCategory"
                :items="categoryItems"
                label="Kategori"
                variant="outlined"
                density="compact"
                hide-details
                prepend-inner-icon="mdi-tag-outline"
                @update:model-value="onCategoryChange"
              >
                <template v-slot:selection="{ item }">
                  <span class="text-truncate">{{ item.title }}</span>
                </template>
              </v-select>
            </v-col>

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
                  @end="onPriceRangeEnd"
                >
                  <template v-slot:thumb-label="{ modelValue }">
                    <span class="text-caption">{{ Math.round(Number(modelValue) / 1000) }}K</span>
                  </template>
                </v-range-slider>
              </div>
            </v-col>

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
        <v-col cols="12" v-if="barangStore.loading">
          <v-card variant="outlined" class="bg-surface mb-6" rounded="lg">
            <v-card-text class="text-center py-12">
              <v-progress-circular indeterminate color="primary" size="64" />
              <p class="text-h6 mt-4 text-lightText">Memuat produk...</p>
            </v-card-text>
          </v-card>
        </v-col>

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

          <v-row v-if="paginatedProducts.length" class="mt-2">
            <v-col
              cols="12"
              sm="6"
              md="3"
              lg="3"
              v-for="product in paginatedProducts"
              :key="product.id"
            >
              <ProductItemVue
                :name="product.nama_barang"
                :image="product.gambar_barang ? `http://127.0.0.1:8000/${product.gambar_barang}` : 'https://via.placeholder.com/300x300?text=No+Image'"
                :desc="product.deskripsi"
                :salePrice="parseInt(product.harga_jual.toString())"
                :rating="5"
                :goto="product.id"
                :product="product"
                :isWishlisted="isInWishlist(product.id)"
                @handlecart="handleAddToCart"
                @handlewishlist="handleToggleWishlist"
              />
            </v-col>
          </v-row>

          <ProductEmpty v-else />

          <!-- Pagination Navigation -->
          <div class="d-flex justify-center align-center mt-8" v-if="totalPages > 1">
            <v-btn
              :disabled="currentPage === 1"
              variant="outlined"
              size="small"
              @click="goToPreviousPage"
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
              @click="goToNextPage"
              class="ms-2"
            >
              <span class="d-none d-sm-inline me-1">Selanjutnya</span>
              <v-icon size="small">mdi-chevron-right</v-icon>
            </v-btn>
          </div>

          <!-- Jelajahi Semua Produk Link -->
          <div class="text-center mt-8 mb-6">
            <router-link to="/produk" class="explore-all-link">
              <span class="text-h6 text-primary">Jelajahi Semua Produk</span>
              <v-icon color="primary" class="ms-2">mdi-arrow-right</v-icon>
            </router-link>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Snackbar Notification -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
      location="bottom right"
    >
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar = false"
        >
          Tutup
        </v-btn>
      </template>
    </v-snackbar>

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

.explore-all-link {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
  padding: 12px 24px;
  border-radius: 8px;
}

.explore-all-link:hover {
  background-color: rgba(var(--v-theme-primary), 0.08);
  transform: translateY(-2px);
}

.explore-all-link:hover .text-h6 {
  text-decoration: underline;
}

@media (max-width: 960px) {
  .price-filter {
    margin-top: 16px;
    padding: 12px 0;
    border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  }
}
</style>
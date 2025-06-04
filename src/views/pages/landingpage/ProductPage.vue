<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import ProductItemVue from '@/components/apps/ecommerce/listing/ProductItem.vue';
import ProductEmpty from '@/components/apps/ecommerce/listing/ProductEmplty.vue';
import ProductFilters from '@/components/apps/ecommerce/listing/ProductFilters.vue';
import FloatingCart from '@/components/apps/ecommerce/cart/FloatingCart.vue';
import { useDisplay } from 'vuetify';
import { useBarangStore } from '@/stores/apps/barang';
import { useCartStore } from '@/stores/cart';
import { useWishlistStore } from '@/stores/apps/wishlist';

import Appbar from './Components/AppBarMenu.vue';
import Footer from './Components/FooterSection.vue';

// Type definitions
interface Product {
  id: number;
  kode_barang: string;
  nama_barang: string;
  harga_jual: string | number;
  deskripsi: string;
  gambar_barang?: string;
  kategori_id: number;
  supplier_id: number;
  merek: string;
  stok: number;
}

interface CartItem {
  id: number;
  kode_barang: string;
  nama_barang: string;
  harga_jual: string;
  quantity: number;
  gambar_barang: string;
}

interface WishlistItem {
  id: number;
  barang_id: number;
}

const barangStore = useBarangStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();

const searchValue = ref<string>('');
const selected = ref<string>('Harga: Rendah ke Tinggi');
const sortbyname: string[] = ['Harga: Tinggi ke Rendah', 'Harga: Rendah ke Tinggi', 'Populer', 'Produk Terbaru'];
const { lgAndUp } = useDisplay();
const sDrawer = ref<boolean>(false);
const toggleSide = ref<boolean>(true);

// Snackbar states
const snackbar = ref<boolean>(false);
const snackbarText = ref<string>('');
const snackbarColor = ref<string>('success');

// Filter states
const selectedCategory = ref<string>('all');
const priceRange = ref<[number, number]>([0, 1000000000]);

const filteredProducts = computed(() => {
  return barangStore.filteredProducts(selectedCategory.value, priceRange.value);
});

const isLoading = computed(() => barangStore.loading);
const error = computed(() => barangStore.error);

const isInWishlist = (productId: number): boolean => {
  return wishlistStore.wishlist.some((item: WishlistItem) => item.barang_id === productId);
};

function handleAddToCart(product: Product): void {
  try {
    // Check if product has sufficient stock
    if (product.stok <= 0) {
      showSnackbar('Produk tidak tersedia dalam stok', 'error');
      return;
    }

    // Create cart item with proper format matching store interface
    const cartItem: CartItem = {
      id: product.id,
      kode_barang: product.kode_barang,
      nama_barang: product.nama_barang,
      harga_jual: String(product.harga_jual), // Ensure it's string format
      quantity: 1,
      gambar_barang: product.gambar_barang || ''
    };

    // Use barangStore method instead of cartStore if cart is managed in barangStore
    barangStore.tambahKeKeranjang(cartItem);
    
    // Alternative: if using separate cartStore
    // cartStore.addToCart(cartItem);
    
    showSnackbar(`${product.nama_barang} ditambahkan ke keranjang`, 'success');
  } catch (error) {
    console.error('Error adding to cart:', error);
    showSnackbar('Gagal menambahkan ke keranjang', 'error');
  }
}

function showSnackbar(message: string, color: string = 'success'): void {
  snackbarText.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
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

function applyFilters(): void {
  // Filters are already reactive through computed property
  // This function can be used for additional filter logic if needed
  console.log('Filters applied:', {
    category: selectedCategory.value,
    priceRange: priceRange.value
  });
}

// Watch for search input changes
function handleSearchInput(value: string): void {
  searchValue.value = value;
  barangStore.setSearchQuery(value);
}

// Watch for sort changes
function handleSortChange(value: string): void {
  selected.value = value;
  barangStore.setSortBy(value);
}

onMounted(async (): Promise<void> => {
  try {
    // Load cart from storage if using separate cartStore
    if (cartStore && cartStore.loadFromStorage) {
      cartStore.loadFromStorage();
    }
    
    // Load all necessary data
    await Promise.all([
      barangStore.ambilSemuaBarang(),
      barangStore.ambilKategori(),
      wishlistStore.fetchWishlist?.() || Promise.resolve()
    ]);
    
  } catch (error) {
    console.error('Error loading data:', error);
    showSnackbar('Gagal memuat data', 'error');
  }
});
</script>

<template>
  <v-app>
    <Appbar />

    <v-main>
      <v-container class="pt-4">
        <v-row>
          <!-- Sidebar Filters -->
          <v-col v-if="lgAndUp && toggleSide" cols="12" md="3" order-md="first">
            <v-card variant="outlined" class="bg-surface mb-4 sticky-sidebar" rounded="lg">
              <v-card-text class="pa-5">
                <ProductFilters
                  v-model:modelValueCategory="selectedCategory"
                  v-model:modelValuePrice="priceRange"
                  @applyFilters="applyFilters"
                />
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" :md="lgAndUp && toggleSide ? 9 : 12">
            <v-card variant="outlined" class="bg-surface mb-6" rounded="lg">
              <v-card-item>
                <div class="d-flex flex-wrap ga-2 align-center">
                  <v-btn
                    variant="text"
                    rounded="md"
                    color="dark"
                    @click="!lgAndUp ? sDrawer = !sDrawer : toggleSide = !toggleSide"
                    class="mr-2"
                  >
                    <v-icon left>mdi-filter</v-icon>
                    Filter
                  </v-btn>

                  <v-text-field
                    :model-value="searchValue"
                    @update:model-value="handleSearchInput"
                    placeholder="Cari Produk..."
                    hide-details
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    style="max-width: 250px"
                    prepend-inner-icon="mdi-magnify"
                  ></v-text-field>

                  <div v-if="lgAndUp" class="ms-auto">
                    <v-select
                      :model-value="selected"
                      @update:model-value="handleSortChange"
                      :items="sortbyname"
                      hide-details
                      variant="outlined"
                      density="comfortable"
                      color="primary"
                      style="min-width: 220px"
                    ></v-select>
                  </div>
                </div>
              </v-card-item>
            </v-card>

            <!-- Loading State -->
            <v-card v-if="isLoading" variant="outlined" class="bg-surface mb-6" rounded="lg">
              <v-card-text class="text-center py-12">
                <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
                <p class="text-h6 mt-4 text-lightText">Memuat produk...</p>
              </v-card-text>
            </v-card>

            <!-- Error State -->
            <v-card v-else-if="error" variant="outlined" class="bg-surface mb-6" rounded="lg">
              <v-card-text class="text-center py-12">
                <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
                <p class="text-h6 text-error">{{ error }}</p>
                <v-btn color="primary" @click="barangStore.ambilSemuaBarang()" class="mt-4">
                  Coba Lagi
                </v-btn>
              </v-card-text>
            </v-card>

            <!-- Products Grid -->
            <template v-else>
              <div class="d-flex justify-space-between align-center mb-4">
                <h3 class="text-h5">
                  Menampilkan {{ filteredProducts.length }} produk
                </h3>
              </div>

              <v-row v-if="filteredProducts.length" class="mt-2">
                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                  lg="4"
                  v-for="product in filteredProducts"
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
                    :stock="product.stok"
                    @handlecart="handleAddToCart"
                    @handlewishlist="handleToggleWishlist"
                  />
                </v-col>
              </v-row>

              <!-- Empty State -->
              <ProductEmpty v-else />
            </template>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Mobile Filter Drawer -->
    <v-navigation-drawer 
      temporary 
      v-model="sDrawer" 
      width="320" 
      location="left" 
      v-if="!lgAndUp"
    >
      <template v-slot:prepend>
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h6">Filter Produk</span>
          <v-btn icon="mdi-close" variant="text" @click="sDrawer = false"></v-btn>
        </v-card-title>
      </template>
      <v-divider></v-divider>
      <v-card-text class="pa-5">
        <ProductFilters
          v-model:modelValueCategory="selectedCategory"
          v-model:modelValuePrice="priceRange"
          @applyFilters="() => { applyFilters(); sDrawer = false; }"
        />
      </v-card-text>
    </v-navigation-drawer>

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

    <Footer />
    <FloatingCart />
  </v-app>
</template>

<style scoped>
.sticky-sidebar {
  position: sticky;
  top: 80px;
  height: fit-content;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.v-main {
  padding-top: 64px;
}
</style>
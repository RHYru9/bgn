<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import ProductItemVue from '@/components/apps/ecommerce/listing/ProductItem.vue';
import ProductEmpty from '@/components/apps/ecommerce/listing/ProductEmplty.vue';
import ProductFilters from '@/components/apps/ecommerce/listing/ProductFilters.vue';
import FloatingCart from '@/components/apps/ecommerce/cart/FloatingCart.vue';
import { useDisplay } from 'vuetify';
import { useBarangStore } from '@/stores/apps/barang';
import { useCartStore } from '@/stores/cart';

import Appbar from './Components/AppBarMenu.vue';
import Footer from './Components/FooterSection.vue';

const barangStore = useBarangStore();
const cartStore = useCartStore();
const searchValue = ref('');
const selected = ref('Harga: Rendah ke Tinggi');
const sortbyname = ['Harga: Tinggi ke Rendah', 'Harga: Rendah ke Tinggi', 'Populer', 'Produk Terbaru'];
const { lgAndUp } = useDisplay();
const sDrawer = ref(false);
const toggleSide = ref(true);

// Filter states
const selectedCategory = ref('all');
const priceRange = ref([0, 1000000000]);

const filteredProducts = computed(() => {
  return barangStore.filteredProducts(selectedCategory.value, priceRange.value);
});

const isLoading = computed(() => barangStore.loading);
const error = computed(() => barangStore.error);

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

function handleToggleWishlist(product: any) {
}

function applyFilters() {
}

onMounted(async () => {
  cartStore.loadFromStorage();
  await barangStore.ambilSemuaBarang();
  await barangStore.ambilKategori();
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

          <v-col cols="12" md="9">
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
                    v-model="searchValue"
                    placeholder="Cari Produk..."
                    hide-details
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    style="max-width: 250px"
                    @update:modelValue="barangStore.setSearchQuery(searchValue)"
                    prepend-inner-icon="mdi-magnify"
                  ></v-text-field>

                  <div v-if="lgAndUp" class="ms-auto">
                    <v-select
                      v-model="selected"
                      :items="sortbyname"
                      hide-details
                      variant="outlined"
                      density="comfortable"
                      color="primary"
                      @update:modelValue="barangStore.setSortBy(selected)"
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
                    :salePrice="parseInt(product.harga_jual)"
                    :rating="5"
                    :goto="product.id"
                    :product="product"
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
    <v-navigation-drawer temporary v-model="sDrawer" width="320" location="left" v-if="!lgAndUp">
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
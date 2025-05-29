<script setup lang="ts">
import { ref, computed } from 'vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import { useCartStore } from '@/stores/cart';
import type { Product } from '@/stores/products';

const props = defineProps<{
  name: string;
  image: string;
  desc: string;
  rating: number;
  salePrice: number;
  offerPrice?: number;
  goto: number | string;
  product: Product;
}>();

const emit = defineEmits<{
  handlecart: [product: Product];
  handlewishlist: [product: Product];
}>();

const cartStore = useCartStore();
const successsnackbar = ref(false);
const successsnackbar2 = ref(false);
const rate = ref(props.rating);

// Computed
const isInWishlist = computed(() => cartStore.isInWishlist(props.product.id));
const isInCart = computed(() => cartStore.isInCart(props.product.id));
const cartQuantity = computed(() => {
  const cartItem = cartStore.getCartItem(props.product.id);
  return cartItem ? cartItem.quantity : 0;
});

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(props.salePrice);
});

const formattedOfferPrice = computed(() => {
  if (!props.offerPrice) return null;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(props.offerPrice);
});

const stockStatus = computed(() => {
  if (props.product.stok <= 0) return 'Stok Habis';
  if (props.product.stok <= props.product.stok_minimum) return 'Stok Terbatas';
  return 'Tersedia';
});

const stockColor = computed(() => {
  if (props.product.stok <= 0) return 'error';
  if (props.product.stok <= props.product.stok_minimum) return 'warning';
  return 'success';
});

// Methods
function toggleWishlist() {
  emit('handlewishlist', props.product);
  successsnackbar2.value = true;
}

function addToCart() {
  if (props.product.stok > 0) {
    emit('handlecart', props.product);
    successsnackbar.value = true;
  }
}

function updateCartQuantity(newQuantity: number) {
  if (newQuantity === 0) {
    cartStore.removeFromCart(props.product.id);
  } else {
    cartStore.updateQuantity(props.product.id, newQuantity);
  }
}
</script>

<template>
  <v-card variant="outlined" rounded="lg" class="white bg-surface overflow-hidden h-100">
    <div class="position-relative">
      <router-link :to="`/produk/detail/${goto}`">
        <v-img
          :src="image"
          :alt="name"
          height="200"
          cover
          class="product-image"
        >
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
          </template>
        </v-img>
      </router-link>
      
      <!-- Wishlist Button -->
      <v-btn 
        icon 
        color="secondary" 
        aria-label="wishlist" 
        variant="text" 
        class="wishlist-icon" 
        rounded="md" 
        @click="toggleWishlist"
      >
        <SvgSprite
          :name="isInWishlist ? 'custom-heart-fill' : 'custom-heart-outline'"
          :class="isInWishlist ? 'text-error' : 'text-lightText'"
          style="width: 18px; height: 18px"
        />
      </v-btn>

      <!-- Stock Status Badge -->
      <v-chip
        :color="stockColor"
        size="small"
        class="stock-badge"
        variant="flat"
      >
        {{ stockStatus }}
      </v-chip>
    </div>

    <v-divider></v-divider>
    
    <v-card-item class="pb-2 px-4 pt-3">
      <v-card-title class="text-h5 pa-0">{{ name }}</v-card-title>
      <p class="text-lightText mb-2 text-body-2">{{ product.merek }}</p>
      <p class="text-lightText mb-3 text-body-2 descriptionH">{{ desc }}</p>
    </v-card-item>

    <v-card-text class="pt-0">
      <div class="d-flex align-end ga-2 justify-space-between flex-wrap">
        <div>
          <div class="d-flex align-center flex-wrap">
            <h4 class="text-h5 mb-0">{{ formattedPrice }}</h4>
            <p 
              v-if="formattedOfferPrice" 
              class="text-decoration-line-through text-lightText text-body-2 mb-0 ms-2"
            >
              {{ formattedOfferPrice }}
            </p>
          </div>
          
          <div class="text-medium-emphasis align-center d-flex ga-2 mb-2">
            <v-rating 
              color="inputBorder" 
              active-color="warning" 
              half-increments 
              size="small" 
              v-model="rate" 
              density="compact" 
              readonly
            />
            <small>({{ rating }}+)</small>
          </div>

          <div class="text-body-2 text-lightText">
            Stok: {{ product.stok }} {{ product.satuan }}
          </div>
        </div>

        <!-- Cart Controls -->
        <div class="d-flex align-center ga-2">
          <div v-if="isInCart" class="d-flex align-center ga-1">
            <v-btn
              icon
              size="small"
              variant="outlined"
              color="primary"
              @click="updateCartQuantity(cartQuantity - 1)"
              :disabled="cartQuantity <= 1"
            >
              <v-icon size="16">mdi-minus</v-icon>
            </v-btn>
            <span class="px-2 text-body-2">{{ cartQuantity }}</span>
            <v-btn
              icon
              size="small"
              variant="outlined"
              color="primary"
              @click="updateCartQuantity(cartQuantity + 1)"
              :disabled="cartQuantity >= product.stok"
            >
              <v-icon size="16">mdi-plus</v-icon>
            </v-btn>
          </div>
          
          <v-btn
            v-else
            icon
            rounded="md"
            color="primary"
            aria-label="cart"
            variant="flat"
            size="small"
            @click="addToCart"
            :disabled="product.stok <= 0"
          >
            <SvgSprite name="custom-shopping-cart" style="width: 18px; height: 18px" />
          </v-btn>
        </div>
      </div>
    </v-card-text>

    <!-- Success Snackbars -->
    <v-snackbar
      variant="flat"
      location="top right"
      min-width="100"
      color="success"
      rounded="md"
      class="text-surface"
      v-model="successsnackbar"
      timeout="3000"
    >
      <div class="d-flex align-center">
        <v-icon class="me-2" size="small">mdi-check-circle-outline</v-icon>
        Berhasil ditambahkan ke keranjang
      </div>
    </v-snackbar>

    <v-snackbar
      variant="flat"
      location="top right"
      min-width="100"
      color="success"
      rounded="md"
      class="text-surface"
      v-model="successsnackbar2"
      timeout="3000"
    >
      <div class="d-flex align-center">
        <v-icon class="me-2" size="small">mdi-check-circle-outline</v-icon>
        {{ isInWishlist ? 'Ditambahkan ke favorit' : 'Dihapus dari favorit' }}
      </div>
    </v-snackbar>
  </v-card>
</template>

<style scoped>
.descriptionH {
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.wishlist-icon {
  position: absolute;
  right: 8px;
  top: 8px;
  z-index: 2;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
}

.stock-badge {
  position: absolute;
  left: 8px;
  top: 8px;
  z-index: 2;
}

.product-image {
  transition: transform 0.3s ease;
}

.product-image:hover {
  transform: scale(1.05);
}
</style>
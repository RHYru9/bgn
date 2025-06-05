<script setup lang="ts">
import { ref, computed } from 'vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import { useCartStore } from '@/stores/cart';
import { tambahKeranjang, type KeranjangData } from '@/stores/apps/keranjang/keranjangUserHaha';
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
const errorsnackbar = ref(false);
const errorMessage = ref('');
const isAddingToCart = ref(false);
const rate = ref(props.rating);

// Computed
const isInWishlist = computed(() => cartStore.isInWishlist(props.product.id));
const isInCart = computed(() => cartStore.isInCart(props.product.id));
const cartQuantity = computed(() => {
  const cartItem = cartStore.getCartItem(props.product.id);
  return cartItem ? cartItem.quantity : 0;
});

const formattedPrice = computed(() =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(props.salePrice)
);

const formattedOfferPrice = computed(() => {
  if (!props.offerPrice) return null;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
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
}

async function addToCart() {
  if (props.product.stok <= 0 || isAddingToCart.value) return;

  try {
    isAddingToCart.value = true;

    const keranjangData: KeranjangData = {
      barang_id: props.product.id,
      jumlah: 1,
    };

    await tambahKeranjang(keranjangData);

    emit('handlecart', props.product);
    successsnackbar.value = true;
  } catch (error: any) {
    console.error('Error adding to cart:', error);

    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message;
    } else if (error.message) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'Gagal menambahkan ke keranjang';
    }

    errorsnackbar.value = true;
  } finally {
    isAddingToCart.value = false;
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
          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular indeterminate color="primary" />
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

    <v-divider />

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

        <!-- Cart Button dengan loading state -->
        <v-btn
          icon
          rounded="md"
          color="primary"
          aria-label="cart"
          variant="flat"
          size="small"
          @click="addToCart"
          :disabled="product.stok <= 0 || isAddingToCart"
          :loading="isAddingToCart"
        >
          <SvgSprite
            v-if="!isAddingToCart"
            name="custom-shopping-cart"
            style="width: 18px; height: 18px"
          />
          <v-tooltip activator="parent" location="top">
            {{ isInCart ? `Sudah di keranjang (${cartQuantity})` : 'Tambahkan ke keranjang' }}
          </v-tooltip>
        </v-btn>
      </div>
    </v-card-text>

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

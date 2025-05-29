<script setup lang="ts">
import { ref, computed } from 'vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import { useBarangStore } from '@/stores/apps/barang';
import { Carousel, Slide, Navigation } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

const store = useBarangStore();
const currentSlide = ref(0);
const isWishlisted = ref(false);

const gambarBarang = computed(() => {
  if (!store.detailBarang) return [];
  const gambarUtama = {
    image: `http://127.0.0.1:8000/${store.detailBarang.gambar_barang}`,
    id: 1
  };
  return [gambarUtama];
});

const toggleWishlist = () => {
  isWishlisted.value = !isWishlisted.value;
  // Add your wishlist logic here
};
</script>

<template>
  <div class="image-carousel-container">
    <Carousel
      id="gallery"
      class="product-carousel"
      aria-hidden="true"
      :items-to-show="1"
      :wrap-around="false"
      v-model="currentSlide"
    >
      <Slide v-for="(slide, i) in gambarBarang" :key="i">
        <div class="carousel-item">
          <!-- Image Container with proper aspect ratio -->
          <div class="image-container">
            <img
              :alt="store.detailBarang?.nama_barang || 'Produk'"
              :src="slide.image"
              class="product-image"
              @error="handleImageError"
            />
          </div>
          
          <!-- Wishlist Button with smooth hover effects -->
          <v-btn
            variant="text"
            icon
            class="wishlist-btn"
            :class="{ 'wishlisted': isWishlisted }"
            rounded="md"
            @click="toggleWishlist"
            aria-label="Add to wishlist"
          >
            <SvgSprite
              :name="isWishlisted ? 'custom-heart-filled' : 'custom-heart-outline'"
              class="heart-icon"
              :class="{ 'filled': isWishlisted }"
            />
          </v-btn>
        </div>
      </Slide>
    </Carousel>
  </div>
</template>

<style lang="scss" scoped>
.image-carousel-container {
  position: relative;
  
  .product-carousel {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-radius: 12px;
    margin-bottom: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
  }

  .carousel-item {
    position: relative;
    width: 100%;
    
    .image-container {
      width: 100%;
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border-radius: 12px;
      overflow: hidden;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
        pointer-events: none;
      }
    }

    .product-image {
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      object-fit: contain;
      border-radius: 8px;
      transition: transform 0.3s ease, filter 0.3s ease;
      
      &:hover {
        transform: scale(1.02);
        filter: brightness(1.05);
      }
    }

    .wishlist-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 10;

      &:hover {
        background: rgba(255, 255, 255, 0.95);
        transform: translateY(-2px) scale(1.1);
        box-shadow: 0 8px 12px -2px rgba(0, 0, 0, 0.15);
      }

      &.wishlisted {
        background: rgba(239, 68, 68, 0.1);
        border-color: rgba(239, 68, 68, 0.3);
        
        &:hover {
          background: rgba(239, 68, 68, 0.15);
        }
      }

      .heart-icon {
        width: 20px;
        height: 20px;
        color: #64748b;
        transition: all 0.3s ease;
        
        &.filled {
          color: #ef4444;
          animation: heartBeat 0.6s ease;
        }
      }
    }
  }
}

// Animation for heart beat effect
@keyframes heartBeat {
  0% { transform: scale(1); }
  20% { transform: scale(1.3); }
  40% { transform: scale(1.1); }
  60% { transform: scale(1.25); }
  80% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

// Responsive adjustments
@media (max-width: 768px) {
  .image-carousel-container {
    .carousel-item {
      .image-container {
        height: 300px;
      }
      
      .wishlist-btn {
        top: 12px;
        right: 12px;
        
        .heart-icon {
          width: 18px;
          height: 18px;
        }
      }
    }
  }
}

// Loading state placeholder
.product-image[src=""],
.product-image:not([src]) {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
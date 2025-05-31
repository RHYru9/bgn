<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ProductDescription from './ProductDescription.vue';
import ProductReview from './ProductReview.vue';
import ProductSpecification from './ProductSpecification.vue';
import { useRatingStore } from '@/stores/apps/ranting';

const tab = ref(null);
const route = useRoute();
const ratingStore = useRatingStore();

// Get barangId from route params
const barangId = computed(() => {
  const idFromParams = Number(route.params.id);
  const idFromQuery = Number(route.query.id);
  return idFromParams || idFromQuery || 0;
});

// Get review count for current product
const reviewCount = computed(() => {
  const reviews = ratingStore.getRatingsByBarangId(barangId.value);
  return reviews.length;
});

// Format review count display (show 10+ if more than 10)
const reviewCountDisplay = computed(() => {
  const count = reviewCount.value;
  return count > 10 ? '10+' : count.toString();
});

// Load ratings on component mount
onMounted(async () => {
  try {
    await ratingStore.fetchRatings();
  } catch (error) {
    console.error('Failed to load ratings:', error);
  }
});

// Watch for tab changes
watch(tab, async (newTab) => {
  if (newTab === 'three') { // When "Ulasan" tab is selected
    try {
      await ratingStore.fetchRatings();
      console.log('Ratings reloaded successfully');
    } catch (error) {
      console.error('Failed to reload ratings:', error);
    }
  }
});

// Watch for barangId changes to reload ratings
watch(barangId, async (newId) => {
  if (newId) {
    try {
      await ratingStore.fetchRatings();
    } catch (error) {
      console.error('Failed to reload ratings for new product:', error);
    }
  }
});
</script>

<template>
  <v-tabs v-model="tab" color="primary" class="border-bottom">
    <v-tab value="one">Deskripsi</v-tab>
    <v-tab value="two">Spesifikasi</v-tab>
    <v-tab value="three">
      Ulasan
      <v-chip 
        v-if="reviewCount > 0"
        color="secondary" 
        size="small" 
        class="ms-1"
      >
        {{ reviewCountDisplay }}
      </v-chip>
    </v-tab>
  </v-tabs>
  
  <div class="mt-5">
    <v-window v-model="tab" class="mx-n6 px-6">
      <v-window-item value="one">
        <ProductDescription />
      </v-window-item>
      <v-window-item value="two">
        <ProductSpecification />
      </v-window-item>
      <v-window-item value="three">
        <ProductReview />
      </v-window-item>
    </v-window>
  </div>
</template>
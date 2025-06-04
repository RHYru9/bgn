<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useRatingStore } from '@/stores/apps/ranting';
import { useAuthStore } from '@/stores/auth';

// Get barangId from route params
const route = useRoute();
const barangId = computed(() => {
  const idFromParams = Number(route.params.id);
  const idFromQuery = Number(route.query.id);
  return idFromParams || idFromQuery || 0;
});

// Stores
const ratingStore = useRatingStore();
const authStore = useAuthStore();

// State
const newComment = ref('');
const newRating = ref(0);
const loading = ref(false);
const showReviewForm = ref(true); // Add this to control form visibility

// Fetch product reviews when component mounts or product changes
onMounted(async () => {
  await authStore.checkAuth(); // Ensure auth status is checked
  await fetchProductReviews();
});

// Watch for barangId changes
watch(barangId, async (newId) => {
  if (newId) {
    await fetchProductReviews();
  }
});

// Computed properties
const productReviews = computed(() => {
  return ratingStore.getRatingsByBarangId(barangId.value);
});

const averageRating = computed(() => {
  return ratingStore.getAverageRatingByBarangId(barangId.value);
});

const ratingDistribution = computed(() => {
  // Initialize array for ratings 1-5 (index 0 = 1 star, index 4 = 5 stars)
  const distribution = [0, 0, 0, 0, 0];
  productReviews.value.forEach(review => {
    const rating = Math.round(review.rating);
    const starIndex = rating - 1; // Convert rating (1-5) to array index (0-4)
    if (starIndex >= 0 && starIndex < 5) {
      distribution[starIndex]++;
    }
  });
  return distribution;
});


// Methods
const fetchProductReviews = async () => {
  if (!barangId.value) return;

  loading.value = true;
  try {
    await ratingStore.fetchRatings();
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
  } finally {
    loading.value = false;
  }
};

const submitReview = async () => {
  if (!newComment.value.trim() || newRating.value <= 0 || !barangId.value) return;
  if (!authStore.isAuthenticated) {
    return;
  }

  loading.value = true;
  try {
    await ratingStore.createRating({
      user_id: authStore.user?.id || 0,
      barang_id: barangId.value,
      rating: Math.round(newRating.value),
      komentar: newComment.value
    });
    
    newComment.value = '';
    newRating.value = 0;
    await fetchProductReviews();
  } catch (error) {
    console.error('Failed to submit review:', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};
</script>

<template>
  <v-row>
    <!-- Rating Summary Section -->
    <v-col cols="12">
      <v-card variant="outlined" elevation="0" rounded="lg">
        <v-row class="mx-0 align-center">
          <v-col cols="12" md="7" sm="4" class="pa-sm-4">
            <div class="pt-sm-0 pt-5">
              <h2 class="text-h2 mb-2 d-flex align-center">
                {{ averageRating.toFixed(1) }}
                <span class="text-h4 text-lightText mb-0 ms-1">/5</span>
              </h2>
              <p class="text-h6 text-lightText mb-1">Berdasarkan {{ productReviews.length }} ulasan</p>
              <div class="text-medium-emphasis align-center d-flex ga-2">
                <v-rating 
                  color="inputBorder" 
                  active-color="warning" 
                  half-increments 
                  :model-value="averageRating" 
                  density="compact"
                  readonly
                />
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="5" sm="8" class="pa-sm-4">
            <div class="pa-sm-4">
              <!-- Fixed the star distribution display -->
              <div v-for="(count, index) in ratingDistribution.slice().reverse()" :key="index" class="d-flex align-center ga-4 my-2">
                <v-progress-linear
                  :model-value="(count / productReviews.length) * 100 || 0"
                  height="6"
                  color="warning"
                  bg-color="gray100"
                  rounded
                />
                <div class="text-no-wrap text-caption text-lightText">
                  {{ 5 - index }} Bintang ({{ count }})
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <!-- Reviews List -->
    <v-col cols="12">
      <v-card 
        v-for="(review, i) in productReviews" 
        :key="i"
        variant="flat" 
        class="mb-4"
        rounded="lg"
      >
        <div class="d-flex align-start pa-4">
          <v-avatar size="40" color="primary" class="mr-3">
            <span class="text-white">{{ review.user.nama.charAt(0) }}</span>
          </v-avatar>
          <div>
            <h6 class="text-subtitle-1 mb-0">{{ review.user.nama }}</h6>
            <span class="text-caption text-lightText">{{ formatDate(review.created_at) }}</span>
            <div class="my-1">
              <v-rating
                :model-value="review.rating"
                size="small"
                readonly
                color="warning"
                half-increments
              />
            </div>
            <p class="text-body-2 mt-2">{{ review.komentar }}</p>
          </div>
        </div>
      </v-card>

      <v-alert
        v-if="productReviews.length === 0"
        type="info"
        variant="tonal"
        class="my-4"
      >
        Belum ada ulasan untuk produk ini.
      </v-alert>
    </v-col>

    <!-- Review Form -->
    <v-col cols="12">
      <v-card v-if="showReviewForm" class="mt-4" variant="outlined">
        <v-card-text>
          <div v-if="authStore.isAuthenticated">
            <v-textarea
              v-model="newComment"
              label="Tulis ulasan Anda"
              variant="outlined"
              :disabled="loading"
              rows="3"
              class="mb-4"
            ></v-textarea>
            
            <div class="d-flex align-center mb-4">
              <span class="text-caption mr-2">Rating:</span>
              <v-rating
                v-model="newRating"
                size="small"
                half-increments
                color="warning"
                :disabled="loading"
              />
            </div>
            
            <v-btn
              color="primary"
              @click="submitReview"
              :loading="loading"
              :disabled="!newComment.trim() || newRating <= 0"
              block
            >
              Kirim Ulasan
            </v-btn>
          </div>
          
          <v-alert v-else type="info" variant="tonal">
            Silakan login untuk memberikan ulasan.
          </v-alert>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}

.v-avatar {
  flex-shrink: 0;
}
</style>
<script setup lang="ts">
import { ref } from 'vue';
import ProductDescription from './ProductDescription.vue';
import ProductReview from './ProductReview.vue';
import ProductSpecification from './ProductSpecification.vue';

const tab = ref(null);
</script>

<template>
  <v-tabs v-model="tab" color="primary" class="border-bottom">
    <v-tab value="one">Deskripsi</v-tab>
    <v-tab value="two">Spesifikasi</v-tab>
    <v-tab value="three">
      Ulasan
      <v-chip color="secondary" size="small" class="ms-1">+10</v-chip>
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

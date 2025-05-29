<script setup lang="ts">
import { ref, watch } from 'vue';
import { useBarangStore } from '@/stores/apps/barang';

const props = defineProps({
  modelValueCategory: {
    type: [String, Number],
    default: 'all',
  },
  modelValuePrice: {
    type: Array as () => number[],
    default: () => [0, 1000000],
  },
});

const emit = defineEmits([
  'update:modelValueCategory', 
  'update:modelValuePrice', 
  'applyFilters'
]);

const selectedCategory = ref(
  props.modelValueCategory === 'all' ? 'all' : Number(props.modelValueCategory)
);
const priceRange = ref([...props.modelValuePrice]);

const barangStore = useBarangStore();

function applyFilters() {
  emit(
    'update:modelValueCategory',
    selectedCategory.value === 'all' ? 'all' : Number(selectedCategory.value)
  );
  emit('update:modelValuePrice', [...priceRange.value]);
  emit('applyFilters');
}

function resetFilters() {
  selectedCategory.value = 'all';
  priceRange.value = [0, 1000000];
  applyFilters();
}

watch(
  () => props.modelValueCategory,
  (val) => {
    selectedCategory.value = val === 'all' ? 'all' : Number(val);
  }
);

watch(
  () => props.modelValuePrice,
  (val) => {
    priceRange.value = [...val];
  },
  { deep: true }
);
</script>

<template>
  <v-card variant="flat" class="mb-3">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Filter</span>
      <v-btn 
        variant="text" 
        color="primary" 
        size="small"
        @click="resetFilters"
      >
        Reset
      </v-btn>
    </v-card-title>
  </v-card>

  <!-- Kategori Filter -->
  <v-list lines="one" class="mb-3" aria-label="categories list">
    <v-list-item-title class="text-h6">Kategori</v-list-item-title>

    <v-radio-group v-model="selectedCategory" color="primary" class="pl-2" @update:modelValue="applyFilters">
      <v-radio
        label="Semua Kategori"
        value="all"
        hide-details
      />
      <v-radio
        v-for="kategori in barangStore.kategoriList"
        :key="kategori.id"
        :label="kategori.nama_kategori"
        :value="kategori.id"
        hide-details
      />
    </v-radio-group>
  </v-list>

  <v-divider class="my-4"></v-divider>

  <!-- Rentang Harga -->
  <div class="mb-3">
    <h5 class="text-h6 mb-3">Rentang Harga (Rp)</h5>
    <v-row>
      <v-col cols="6">
        <v-text-field 
          v-model.number="priceRange[0]" 
          label="Minimum" 
          type="number" 
          variant="outlined"
          :min="0"
          density="compact"
          @update:modelValue="applyFilters"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field 
          v-model.number="priceRange[1]" 
          label="Maksimum" 
          type="number" 
          variant="outlined"
          :min="priceRange[0]"
          density="compact"
          @update:modelValue="applyFilters"
        />
      </v-col>
    </v-row>

    <v-range-slider
      v-model="priceRange"
      :max="1000000"
      :min="0"
      :step="10000"
      thumb-label="always"
      thumb-size="24"
      color="primary"
      track-color="grey-lighten-2"
      class="mt-2"
      @update:modelValue="applyFilters"
    />
  </div>
</template>

<style scoped>
.v-list-item {
  min-height: 40px;
}
</style>
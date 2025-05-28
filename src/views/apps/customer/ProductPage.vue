<script setup lang="ts">
import { ref } from 'vue';
import FooterSection from '@/views/pages/landingpage/Components/FooterSection.vue';
import Products from '@/components/apps/ecommerce/listing/ProductList.vue';
import { useCustomizerStore } from '@/stores/customizer';

const customizer = useCustomizerStore();
const page = ref({ title: 'Produk' });
</script>

<template>
      <Products />
    <FooterSection />
</template>

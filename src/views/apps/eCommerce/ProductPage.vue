<script setup lang="ts">
import { ref } from 'vue';

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import Products from '@/components/apps/ecommerce/listing/ProductList.vue';

const page = ref({ title: 'Products' });
const breadcrumbs = ref([
  {
    title: 'Ecommerce',
    disabled: false,
    href: '#'
  },
  {
    title: 'Halaman Produk',
    disabled: true,
    href: '#'
  }
]);
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <Products />
</template>

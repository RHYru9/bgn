<script setup lang="ts">
import { computed } from 'vue';
import { useBarangStore } from '@/stores/apps/barang';

const store = useBarangStore();

const generalItem = computed(() => [
  {
    title: 'Kategori Produk:',
    desc: store.currentBarang?.kategori?.nama_kategori || '-'
  },
  {
    title: 'Deskripsi Kategori:',
    desc: store.currentBarang?.kategori?.deskripsi || '-'
  }
]);

const specificationItem = computed(() => [
  {
    title: 'Supplier:',
    desc: store.currentBarang?.supplier?.nama || '-'
  },
  {
    title: 'Alamat Supplier:',
    desc: store.currentBarang?.supplier?.alamat || '-'
  },
  {
    title: 'Kontak Supplier:',
    desc: store.currentBarang?.supplier?.no_telp || '-'
  }
]);
</script>

<template>
  <v-row>
    <v-col cols="12" sm="6">
      <h5 class="text-h5 mb-4">Product Category</h5>
      <v-divider></v-divider>
      <v-table class="mt-4">
        <tr v-for="(gen, i) in generalItem" :key="i">
          <td class="py-2">
            <span class="text-h6 text-lightText">{{ gen.title }}</span>
          </td>
          <td>{{ gen.desc }}</td>
        </tr>
      </v-table>
    </v-col>
    <v-col cols="12" sm="6">
      <h5 class="text-h5 mb-4">Supplier Details</h5>
      <v-divider></v-divider>
      <v-table class="mt-4">
        <tr v-for="(item, i) in specificationItem" :key="i">
          <td class="py-2">
            <span class="text-h6 text-lightText">{{ item.title }}</span>
          </td>
          <td>{{ item.desc }}</td>
        </tr>
      </v-table>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useBarangStore } from '@/stores/apps/barang';

const store = useBarangStore();

const detailBarang = computed(() => store.detailBarang);

const spesifikasiBarang = computed(() => [
  {
    title: 'Merek:',
    desc: detailBarang.value?.merek || '-'
  },
  {
    title: 'Kategori:',
    desc: detailBarang.value?.kategori?.nama_kategori || '-'
  },
  {
    title: 'Berat:',
    desc: `${detailBarang.value?.berat_barang || 0} ${detailBarang.value?.satuan || ''}`
  },
  {
    title: 'Stok Minimum:',
    desc: detailBarang.value?.stok_minimum.toString() || '0'
  }
  //{
    //title: 'Supplier:',
    //desc: detailBarang.value?.supplier?.nama || '-'
  //}
]);
</script>

<template>
  <v-table>
    <tr v-for="(spesifikasi, i) in spesifikasiBarang" :key="i">
      <td class="py-2">
        <span class="text-h6 text-lightText">{{ spesifikasi.title }}</span>
      </td>
      <td>{{ spesifikasi.desc }}</td>
    </tr>
  </v-table>
</template>
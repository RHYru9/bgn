<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Daftar Transaksi (JSON Output)</h1>

    <div v-if="loading">Memuat data transaksi...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else>
      <pre class="bg-gray-100 p-4 rounded overflow-x-auto">
        {{ JSON.stringify(transaksiList, null, 2) }}
      </pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTransaksiStore } from '@/stores/apps/transaksi'
import { storeToRefs } from 'pinia'

const transaksiStore = useTransaksiStore()
const { transaksiList, loading, error } = storeToRefs(transaksiStore)

onMounted(() => {
  const token = localStorage.getItem('token') || ''
  transaksiStore.fetchTransaksi(token)
})
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>

<script setup lang="ts">
import { computed } from 'vue';
import { useTransaksiStore } from '@/stores/apps/transaksi';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import CardHeader from '@/components/shared/CardHeader.vue';

const transaksiStore = useTransaksiStore();

const formatCurrency = (value: string) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(parseFloat(value));
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'baru saja';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} minggu lalu`;
  return `${Math.floor(diffInSeconds / 2592000)} bulan lalu`;
};

const recentTransactions = computed(() => {
  return transaksiStore.transaksiList
    .slice(0, 5) // Ambil 5 transaksi terbaru
    .map(transaksi => ({
      name: transaksi.user.nama,
      id: transaksi.kode_transaksi,
      time: formatDate(transaksi.tanggal_pesanan),
      price: formatCurrency(transaksi.total_harga),
      status: transaksi.status_pembayaran === 'lunas' ? 'Lunas' : 'Belum Bayar'
    }));
});
</script>

<template>
  <CardHeader title="Transaksi Terbaru" class="overflow-hidden">
    <template v-slot:header>
      <v-btn variant="text" aria-label="menu" color="secondary" icon rounded="md" size="small">
        <SvgSprite name="custom-more-outline" style="width: 20px; height: 20px" />
      </v-btn>
    </template>
    <v-list lines="two" class="py-3" aria-label="daftar transaksi" aria-busy="true">
      <v-list-item 
        v-for="(item, i) in recentTransactions" 
        :key="i" 
        rounded="sm" 
        class="px-6"
      >
        <template v-slot:prepend>
          <v-avatar size="40" color="primary" class="py-2">
            <span class="text-white text-subtitle-1">{{ item.name.charAt(0) }}</span>
          </v-avatar>
        </template>
        <div class="d-inline-flex align-center justify-space-between w-100">
          <div>
            <h6 class="text-subtitle-1 mb-0">
              {{ item.name }} -
              <span class="ms-1 text-h6 text-lightText">{{ item.id }}</span>
            </h6>
            <div class="d-flex align-center">
              <p class="text-h6 mb-0" :class="item.status === 'Lunas' ? 'text-success' : 'text-warning'">
                {{ item.price }}
              </p>
              <v-chip 
                small
                :color="item.status === 'Lunas' ? 'success' : 'warning'"
                class="ms-2"
                text-color="white"
              >
                {{ item.status }}
              </v-chip>
            </div>
          </div>
          <span class="text-caption text-lightText">{{ item.time }}</span>
        </div>
      </v-list-item>
    </v-list>
    <v-card-item class="pt-0">
      <v-btn variant="outlined" color="secondary" rounded="md" block>Lihat Semua</v-btn>
    </v-card-item>
  </CardHeader>
</template>
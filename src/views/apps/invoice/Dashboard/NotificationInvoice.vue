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

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'baru saja';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' });
};

const notifications = computed(() => {
  // Get last 5 transactions
  const recentTransactions = transaksiStore.transaksiList.slice(0, 5);
  
  return recentTransactions.map(transaksi => {
    const isPaid = transaksi.status_pembayaran === 'lunas';
    const isOverdue = transaksi.status_pembayaran === 'belum_bayar' && 
                     new Date(transaksi.tanggal_jatuh_tempo) < new Date();
    
    return {
      icon: isPaid ? 'custom-document-check' : 
            isOverdue ? 'custom-danger' : 'custom-document-text-outline',
      color: isPaid ? 'success' : 
             isOverdue ? 'error' : 'warning',
      title: isPaid ? `Pembayaran lunas dari ${transaksi.user.nama}` :
             isOverdue ? `Pembayaran terlambat dari ${transaksi.user.nama}` :
             `Tagihan baru dari ${transaksi.user.nama}`,
      amount: formatCurrency(transaksi.total_harga),
      time: formatTime(transaksi.tanggal_pesanan),
      kodeTransaksi: transaksi.kode_transaksi
    };
  });
});
</script>

<template>
  <CardHeader title="Notifikasi" class="overflow-hidden">
    <template v-slot:header>
      <v-btn variant="text" aria-label="menu" color="secondary" icon rounded="md" size="small">
        <SvgSprite name="custom-more-outline" style="width: 20px; height: 20px" />
      </v-btn>
    </template>
    <v-list class="py-2" lines="two" aria-label="daftar notifikasi" aria-busy="true">
      <v-list-item 
        v-for="(item, i) in notifications" 
        :key="i" 
        rounded="md" 
        class="px-6"
      >
        <template v-slot:prepend>
          <div class="me-3">
            <v-avatar size="40" class="py-2" :color="item.color" variant="tonal">
              <SvgSprite :name="item.icon" style="width: 20px; height: 20px" />
            </v-avatar>
          </div>
        </template>
        
        <div class="d-flex flex-column w-100">
          <div class="d-flex justify-space-between align-center">
            <h6 class="text-subtitle-1 mb-0">
              {{ item.title }}
              <span class="text-primary">{{ item.amount }}</span>
            </h6>
          </div>
          <div class="d-flex justify-space-between align-center mt-1">
            <p class="text-caption text-lightText mb-0">
              {{ item.kodeTransaksi }}
            </p>
            <p class="text-caption text-lightText mb-0">
              {{ item.time }}
            </p>
          </div>
        </div>
      </v-list-item>
    </v-list>
    <v-card-item class="pt-0">
      <v-btn variant="outlined" color="secondary" rounded="md" block>Lihat Semua</v-btn>
    </v-card-item>
  </CardHeader>
</template>

<style scoped>
.link-hover:hover {
  text-decoration: underline;
}
</style>
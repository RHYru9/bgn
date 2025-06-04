<script setup lang="ts">
import { computed } from 'vue';
import { useTransaksiStore } from '@/stores/apps/transaksi';
import SvgSprite from '@/components/shared/SvgSprite.vue';

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
      title: isPaid ? `Pembayaran Anda telah dikonfirmasi` :
             isOverdue ? `Tagihan Anda sudah jatuh tempo` :
             `Tagihan baru untuk Anda`,
      amount: formatCurrency(transaksi.total_harga),
      time: formatTime(transaksi.tanggal_pesanan),
      kodeTransaksi: transaksi.kode_transaksi
    };
  });
});
</script>

<template>
  <v-menu :close-on-content-click="false" offset="6, 0">
    <template v-slot:activator="{ props }">
      <v-btn icon class="text-secondary ms-sm-2 ms-1" color="secondary" rounded="sm" v-bind="props">
        <v-badge :content="notifications.length" color="success" offset-x="-2" offset-y="-2">
          <SvgSprite name="custom-notification" />
        </v-badge>
      </v-btn>
    </template>
    <v-sheet rounded="md" width="420" class="notification-dropdown py-6">
      <div class="d-flex align-center justify-space-between pb-4 px-6">
        <h5 class="text-h5 mb-0">Notifikasi</h5>
        <a href="#" class="text-primary link-hover text-h6">Tandai semua telah dibaca</a>
      </div>
      <perfect-scrollbar style="height: calc(100vh - 300px); max-height: 430px">
        <v-list class="py-0 px-6" lines="two" aria-label="daftar notifikasi" aria-busy="true">
          <v-list-item
            v-for="(item, i) in notifications"
            :key="i"
            color="secondary"
            class="no-spacer mb-3 px-3 py-5"
            rounded="md"
          >
            <template v-slot:prepend>
              <v-avatar size="40" :variant="item.color === 'success' ? 'flat' : 'tonal'" :color="item.color" class="me-3 py-2">
                <SvgSprite :name="item.icon" />
              </v-avatar>
            </template>
            <div class="d-inline-flex justify-space-between w-100">
              <h6 class="text-h6 text-lightText mb-0">{{ item.title }}</h6>
              <span class="text-caption text-lightText ms-3" style="min-width: 48px">{{ item.time }}</span>
            </div>
            <p class="text-caption text-lightText my-0">{{ item.kodeTransaksi }} - {{ item.amount }}</p>
          </v-list-item>
        </v-list>
      </perfect-scrollbar>
      <div class="pt-2 text-center">
        <a href="#" class="text-primary text-h6 link-hover">Lihat Semua</a>
      </div>
    </v-sheet>
  </v-menu>
</template>

<style lang="scss">
.v-tooltip > .v-overlay__content.custom-tooltip {
  padding: 2px 6px;
}
.link-hover:hover {
  text-decoration: underline;
}
</style>
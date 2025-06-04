<script setup lang="ts">
import { computed } from 'vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';

interface TransactionData {
  id: number;
  kode_transaksi: string;
  user_id: string;
  tanggal_pesanan: string;
  total_harga: string;
  status_pembayaran: string;
  status_pengiriman: string;
  jenis_pengiriman: string;
  metode_pembayaran: string;
  tanggal_jatuh_tempo: string | null;
  alamat_pengiriman: string;
  kode_pos: string;
  catatan_pembeli: string;
  bukti_transfer: string | null;
  created_at: string;
  updated_at: string;
}

const props = defineProps<{
  transactionData: TransactionData | null;
}>();

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCurrency = (amount: string) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(parseFloat(amount));
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'belum_bayar':
      return 'warning';
    case 'sudah_bayar':
      return 'success';
    case 'pending':
      return 'info';
    case 'dikirim':
      return 'primary';
    case 'selesai':
      return 'success';
    default:
      return 'grey';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'belum_bayar':
      return 'Belum Bayar';
    case 'sudah_bayar':
      return 'Sudah Bayar';
    case 'pending':
      return 'Pending';
    case 'dikirim':
      return 'Dikirim';
    case 'selesai':
      return 'Selesai';
    default:
      return status;
  }
};
</script>

<template>
  <div v-if="transactionData">
    <!-- Transaction Success Header -->
    <v-card class="bg-surface mb-4" variant="outlined" rounded="lg">
      <v-card-text class="text-center pa-8">
        <v-icon color="success" size="64" class="mb-4">mdi-check-circle</v-icon>
        <h2 class="text-h4 mb-2">Transaksi Berhasil!</h2>
        <p class="text-subtitle-1 text-medium-emphasis">
          Terima kasih atas pesanan Anda. Berikut adalah detail transaksi:
        </p>
      </v-card-text>
    </v-card>

    <!-- Transaction Details -->
    <v-card class="bg-surface mb-4" variant="outlined" rounded="lg">
      <v-card-title class="d-flex align-center">
        <SvgSprite name="custom-receipt" class="me-2" style="width: 24px; height: 24px" />
        Detail Transaksi
      </v-card-title>
      <v-divider />
      <v-card-text class="pa-0">
        <v-list lines="two">
          <v-list-item>
            <v-list-item-title>Kode Transaksi</v-list-item-title>
            <v-list-item-subtitle class="text-primary font-weight-bold">
              {{ transactionData.kode_transaksi }}
            </v-list-item-subtitle>
          </v-list-item>
          
          <v-divider />
          
          <v-list-item>
            <v-list-item-title>Tanggal Pesanan</v-list-item-title>
            <v-list-item-subtitle>
              {{ formatDate(transactionData.tanggal_pesanan) }}
            </v-list-item-subtitle>
          </v-list-item>
          
          <v-divider />
          
          <v-list-item>
            <v-list-item-title>Total Harga</v-list-item-title>
            <v-list-item-subtitle class="text-h6 font-weight-bold">
              {{ formatCurrency(transactionData.total_harga) }}
            </v-list-item-subtitle>
          </v-list-item>
          
          <v-divider />
          
          <v-list-item>
            <v-list-item-title>Status Pembayaran</v-list-item-title>
            <v-list-item-subtitle>
              <v-chip 
                :color="getStatusColor(transactionData.status_pembayaran)" 
                size="small" 
                variant="tonal"
              >
                {{ getStatusText(transactionData.status_pembayaran) }}
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item>
          
          <v-divider />
          
          <v-list-item>
            <v-list-item-title>Status Pengiriman</v-list-item-title>
            <v-list-item-subtitle>
              <v-chip 
                :color="getStatusColor(transactionData.status_pengiriman)" 
                size="small" 
                variant="tonal"
              >
                {{ getStatusText(transactionData.status_pengiriman) }}
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item>
          
          <v-divider />
          
          <v-list-item>
            <v-list-item-title>Metode Pembayaran</v-list-item-title>
            <v-list-item-subtitle class="text-capitalize">
              {{ transactionData.metode_pembayaran }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <!-- Shipping Information -->
    <v-card class="bg-surface mb-4" variant="outlined" rounded="lg">
      <v-card-title class="d-flex align-center">
        <SvgSprite name="custom-truck" class="me-2" style="width: 24px; height: 24px" />
        Informasi Pengiriman
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <div class="mb-3">
              <p class="text-subtitle-2 mb-1">Alamat Pengiriman:</p>
              <p class="text-body-2">{{ transactionData.alamat_pengiriman }}</p>
            </div>
            <div class="mb-3">
              <p class="text-subtitle-2 mb-1">Kode Pos:</p>
              <p class="text-body-2">{{ transactionData.kode_pos }}</p>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="mb-3">
              <p class="text-subtitle-2 mb-1">Jenis Pengiriman:</p>
              <p class="text-body-2 text-capitalize">{{ transactionData.jenis_pengiriman }}</p>
            </div>
            <div class="mb-3" v-if="transactionData.catatan_pembeli">
              <p class="text-subtitle-2 mb-1">Catatan Pembeli:</p>
              <p class="text-body-2">{{ transactionData.catatan_pembeli }}</p>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Payment Instructions -->
    <v-card 
      v-if="transactionData.status_pembayaran === 'belum_bayar'" 
      class="bg-warning-lighten-5 mb-4" 
      variant="outlined" 
      rounded="lg"
    >
      <v-card-title class="d-flex align-center text-warning-darken-2">
        <v-icon class="me-2">mdi-alert-circle</v-icon>
        Instruksi Pembayaran
      </v-card-title>
      <v-divider />
      <v-card-text>
        <p class="mb-3">
          Silakan lakukan pembayaran dengan metode <strong>{{ transactionData.metode_pembayaran }}</strong> 
          sebesar <strong>{{ formatCurrency(transactionData.total_harga) }}</strong>
        </p>
        <p class="text-body-2 text-medium-emphasis">
          Setelah melakukan pembayaran, harap upload bukti transfer untuk mempercepat proses verifikasi.
        </p>
      </v-card-text>
    </v-card>

    <!-- Action Buttons -->
    <v-card class="bg-surface" variant="outlined" rounded="lg">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-btn 
              color="primary" 
              variant="outlined" 
              block 
              rounded="md"
              @click="window.print()"
            >
              <v-icon class="me-2">mdi-printer</v-icon>
              Cetak Invoice
            </v-btn>
          </v-col>
          <v-col cols="12" md="6">
            <v-btn 
              color="success" 
              variant="flat" 
              block 
              rounded="md"
              :href="`/orders/${transactionData.kode_transaksi}`"
            >
              <v-icon class="me-2">mdi-eye</v-icon>
              Lihat Detail Pesanan
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>

  <!-- No Transaction Data -->
  <div v-else class="text-center pa-8">
    <v-icon color="grey" size="64" class="mb-4">mdi-receipt-text-outline</v-icon>
    <h3 class="text-h5 mb-2">Tidak Ada Data Transaksi</h3>
    <p class="text-body-1 text-medium-emphasis">
      Silakan lakukan proses checkout terlebih dahulu.
    </p>
  </div>
</template>

<style scoped>
.v-card-title {
  font-weight: 600;
}

@media print {
  .v-btn {
    display: none !important;
  }
}
</style>
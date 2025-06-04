<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import completed from '@/assets/images/e-commerce/completed.png';

// State untuk kode transaksi
const kodeTransaksi = ref<string>('');

// Ambil data transaksi dari API saat komponen dimount
onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token tidak ditemukan di localStorage');
      return;
    }

    const response = await axios.get('http://127.0.0.1:8000/api/transaksi', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    const transaksiList = response.data;
    if (Array.isArray(transaksiList) && transaksiList.length > 0) {
      // Ambil transaksi terbaru (ID paling besar)
      const latest = transaksiList.sort((a, b) => b.id - a.id)[0];
      kodeTransaksi.value = latest.kode_transaksi;
    }
  } catch (error) {
    console.error('Gagal mengambil kode transaksi:', error);
  }
});
</script>

<template>
  <v-card>
    <v-card-item class="py-8 text-center">
      <img :src="completed" alt="Thankyou" class="my-6 thank-you-image" />

      <h1 class="text-md-h1 text-h3">Terima Kasih atas Pembelian Anda!</h1>

      <p class="text-h6 text-lightText mt-3 mb-0">
        Kami akan mengirim notifikasi proses, sebelum barang dikirim.
      </p>

      <p class="text-h6 text-lightText">
        ID Pesanan Anda:
        <span class="text-subtitle-1 text-primary">{{ kodeTransaksi }}</span>
      </p>

      <h5 class="text-h5 mt-8 mb-8">(089) 5340-6730-66</h5>

      <div class="d-flex align-center justify-center ga-4 mt-5 mb-5">
        <v-btn color="secondary" variant="outlined" to="/produk">Lihat Produk Lainnya</v-btn>
        <v-btn color="primary" variant="flat">Unduh Invoice</v-btn>
      </div>
    </v-card-item>
  </v-card>
</template>

<style lang="scss">
.thank-you-image {
  width: 500px;
  @media (max-width: 767px) {
    width: 350px;
  }
}
</style>

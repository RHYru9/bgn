<script setup lang="ts">
import Appbar from './AppBarMenu.vue';
import FooterSection from './FooterSection.vue';
import NewsLetter from './NewsLetter.vue';
import { useCustomizerStore } from '@/stores/customizer';

const customizer = useCustomizerStore();
</script>

<template>
  <v-layout class="flex-column" :class="customizer.actTheme === 'dark' ? 'bg-containerBg' : 'bg-surface'">
    <Appbar />

    <v-main>
      <v-container class="py-16">
        <!-- Header Section -->
        <v-row class="justify-center mb-10">
          <v-col cols="12" md="8" class="text-center">
            <h1 class="text-h2 mb-4 text-primary">Syarat & Ketentuan</h1>
            <p class="text-h6 text-lightText">
              Berikut adalah syarat dan ketentuan yang berlaku untuk penggunaan layanan BangunGO.
            </p>
          </v-col>
        </v-row>

        <!-- Content Section -->
        <v-row class="justify-center mb-16" dense>
          <v-col cols="12" md="10" lg="8">
            <v-card elevation="1" class="pa-6 rounded-xl shadow-lg">
              <h2 class="text-h5 mb-4 text-primary">BangunGO - Syarat dan Ketentuan</h2>

              <h3 class="text-h6 text-primary">Penerimaan Ketentuan</h3>
              <p>
                Dengan mengakses situs ini, Anda mengakui bahwa Anda telah membaca dan menyetujui syarat dan ketentuan yang dijelaskan di bawah ini. Jika Anda tidak setuju dengan syarat dan ketentuan ini, Anda harus meninggalkan situs ini dan tidak berinteraksi lebih lanjut dengan BangunGO.
              </p>

              <h3 class="text-h6 text-primary">Ketersediaan Produk</h3>
              <p>
                Produk dapat ditambahkan atau dihapus dari situs ini sewaktu-waktu. Terkadang produk yang dijelaskan di situs mungkin tidak tersedia di toko-toko BangunGO. Meskipun kami tidak bertanggung jawab atas kerugian yang timbul, kami akan berusaha keras untuk menjaga agar informasi tetap terkini dan akurat.
              </p>

              <h3 class="text-h6 text-primary">Penggunaan Cookies</h3>
              <p>
                Beberapa halaman di situs ini menggunakan "cookies", yaitu file kecil yang ditempatkan di perangkat Anda untuk tujuan identifikasi. Cookies ini digunakan untuk registrasi situs dan penyesuaian ketika Anda mengunjungi kami lagi. Harap dicatat bahwa cookies tidak dapat membaca data di perangkat Anda. Anda dapat mengatur browser Anda untuk memberi tahu Anda saat menerima cookies dan memberi Anda pilihan untuk menerima atau menolaknya.
              </p>

              <h3 class="text-h6 text-primary">Pesanan, Harga, dan Pembayaran</h3>
              <p>
                www.bangunGO.id bukanlah situs transaksi langsung. Anda dapat memilih produk yang ingin Anda pesan dan mengirimkan permintaan ke toko BangunGO terdekat untuk pemrosesan lebih lanjut. Tidak ada informasi pembayaran yang diperlukan untuk dimasukkan dalam formulir permintaan.
              </p>

              <h3 class="text-h6 text-primary">Penafian, Pembatasan Tanggung Jawab, dan Ganti Rugi</h3>
              <p>
                Sejauh diizinkan oleh hukum, kami mengecualikan semua tanggung jawab kepada Anda atau pihak lain untuk kerugian atau kerusakan dalam bentuk apapun (bagaimanapun juga penyebabnya) yang berkaitan dengan situs ini, termasuk namun tidak terbatas pada kerugian atau kerusakan yang mungkin Anda alami akibat dari:
                <ul>
                  <li>Kesalahan, kekeliruan, atau ketidakakuratan di situs ini;</li>
                  <li>Tindakan atau kegagalan Anda dalam bertindak berdasarkan informasi yang terkandung dalam situs atau situs yang terkait;</li>
                  <li>Cedera pribadi atau kerusakan properti yang timbul akibat akses atau penggunaan situs;</li>
                  <li>Akses tidak sah atau penggunaan server aman situs ini;</li>
                  <li>Gangguan atau penghentian transmisi ke atau dari situs.</li>
                </ul>
              </p>

              <h3 class="text-h6 text-primary">Hukum Indonesia</h3>
              <p>
                Syarat dan ketentuan ini tunduk pada hukum yang berlaku di Indonesia.
              </p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <NewsLetter />
    <FooterSection />
  </v-layout>
</template>

<style scoped>
/* Styling untuk form dan card */
.v-card {
  background-color: var(--v-theme-surface);
  padding: 20px; /* Memberikan padding ekstra pada card */
}

.text-primary {
  color: rgb(var(--v-theme-primary)) !important;
}

.mb-4 {
  margin-bottom: 1rem !important;
}

.mb-10 {
  margin-bottom: 2.5rem !important;
}

ul {
  margin-left: 1.5rem;
}

li {
  margin-bottom: 8px;
}

h3 {
  margin-top: 1.5rem;
}

h2 {
  margin-bottom: 1.5rem;
}

p {
  line-height: 1.7;
}
</style>

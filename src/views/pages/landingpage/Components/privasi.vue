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
            <h1 class="text-h2 mb-4 text-primary">Kebijakan Privasi BangunGO</h1>
            <p class="text-h6 text-lightText">
              Kami berkomitmen untuk menjaga kepercayaan Anda. Kebijakan privasi ini menjelaskan bagaimana BangunGO mengumpulkan, menyimpan, menggunakan, dan mengungkapkan informasi pribadi Anda.
            </p>
          </v-col>
        </v-row>

        <!-- Content Section -->
        <v-row class="justify-center mb-16" dense>
          <v-col cols="12" md="10" lg="8">
            <v-card elevation="1" class="pa-6 rounded-xl shadow-lg">
              <h2 class="text-h5 mb-4 text-primary">BangunGO - Kebijakan Privasi</h2>

              <h3 class="text-h6 text-primary">Penerimaan Kebijakan</h3>
              <p>
                Dengan mengakses situs ini, Anda mengakui bahwa Anda telah membaca dan menyetujui kebijakan privasi yang dijelaskan di bawah ini. Jika Anda tidak setuju dengan kebijakan ini, Anda harus meninggalkan situs ini dan tidak melanjutkan interaksi lebih lanjut dengan BangunGO.
              </p>

              <h3 class="text-h6 text-primary">Pengumpulan Informasi</h3>
              <p>
                Kami mengumpulkan berbagai jenis informasi pribadi dari Anda saat berinteraksi dengan kami, baik secara langsung di toko BangunGO atau melalui situs web kami. Informasi yang kami kumpulkan termasuk tetapi tidak terbatas pada nama, alamat, nomor telepon, alamat email, informasi pembayaran, dan informasi transaksi seperti produk yang dibeli atau layanan yang digunakan.
              </p>

              <h3 class="text-h6 text-primary">Jenis Informasi yang Kami Kumpulkan</h3>
              <p>
                Kami mengumpulkan data yang diperlukan untuk menjalankan bisnis kami, termasuk informasi kontak dan identifikasi, informasi akun, informasi transaksi, serta data lainnya yang relevan untuk pengolahan pesanan dan layanan kami.
              </p>

              <h3 class="text-h6 text-primary">Bagaimana Kami Menggunakan Informasi Anda</h3>
              <p>
                Kami menggunakan informasi pribadi Anda untuk berbagai tujuan, termasuk untuk memastikan pengiriman pesanan, mengelola hubungan pelanggan, serta memberikan pelayanan terbaik. Beberapa tujuan penggunaan informasi pribadi Anda meliputi:
                <ul>
                  <li>Memproses pesanan dan pengiriman produk.</li>
                  <li>Mengelola akun dan pembayaran Anda.</li>
                  <li>Memberikan dukungan pelanggan melalui email atau telepon.</li>
                  <li>Menyediakan informasi pemasaran tentang produk dan layanan BangunGO (hanya jika Anda setuju untuk menerima informasi ini).</li>
                  <li>Melakukan analisis data, riset pasar, dan penelitian tren.</li>
                </ul>
              </p>

              <h3 class="text-h6 text-primary">Kerentanan Data dan Ancaman Keamanan</h3>
              <p>
                BangunGO berkomitmen untuk melindungi informasi pribadi Anda dengan langkah-langkah keamanan yang ketat. Namun, kami ingin mengingatkan Anda bahwa tidak ada sistem yang sepenuhnya aman. Meskipun kami menggunakan teknologi dan prosedur keamanan untuk menjaga data Anda, kerentanannya terhadap ancaman dari luar seperti pencurian data, hacker, atau serangan dunia maya tetap ada.
              </p>

              <h3 class="text-h6 text-primary">Kerentanan Data dan Tanggung Jawab Kami</h3>
              <p>
                Meskipun kami berupaya untuk melindungi informasi pribadi Anda dengan menggunakan teknologi dan prosedur yang aman, kami tidak dapat menghindari risiko terkait potensi ancaman seperti peretasan dan pencurian data. Kami tidak bertanggung jawab atas kerugian yang mungkin Anda alami akibat serangan dunia maya atau kebocoran data yang berada di luar kendali kami.
              </p>

              <h3 class="text-h6 text-primary">Bagaimana Kami Membagikan Informasi Anda</h3>
              <p>
                Kami hanya akan membagikan informasi pribadi Anda dengan pihak ketiga dalam beberapa situasi untuk membantu kami menjalankan bisnis, seperti:
                <ul>
                  <li>Penyedia produk dan layanan (misalnya, pengiriman, pemasok).</li>
                  <li>Penyedia layanan teknis (misalnya, penyedia IT atau penyedia pembayaran).</li>
                  <li>Pihak yang membantu kami dalam analisis data atau riset pasar.</li>
                  <li>Pihak berwenang atau lembaga penegak hukum jika diperlukan untuk menangani masalah terkait kejahatan ritel atau masalah keamanan lainnya.</li>
                </ul>
              </p>

              <h3 class="text-h6 text-primary">Keamanan Data Anda</h3>
              <p>
                Kami menggunakan berbagai metode keamanan untuk melindungi informasi pribadi Anda, termasuk enkripsi, firewall, serta kontrol akses terbatas. Informasi pribadi Anda disimpan dalam sistem yang aman dan hanya dapat diakses oleh pihak yang memerlukan akses untuk tujuan yang sah. Data pribadi Anda akan disimpan hanya selama diperlukan dan akan dihancurkan dengan aman jika sudah tidak diperlukan lagi.
              </p>

              <h3 class="text-h6 text-primary">Bagaimana Kami Mengelola Data Anda</h3>
              <p>
                Kami memastikan bahwa informasi pribadi Anda hanya digunakan untuk tujuan yang telah disebutkan di atas dan tidak akan dibagikan tanpa izin Anda, kecuali jika diwajibkan oleh hukum atau dalam rangka memenuhi kewajiban legal dan regulasi yang berlaku.
              </p>

              <h3 class="text-h6 text-primary">Hak Akses dan Koreksi Data Pribadi</h3>
              <p>
                Anda berhak untuk meminta salinan informasi pribadi yang kami miliki tentang Anda atau meminta agar data tersebut diperbaiki jika Anda merasa ada yang tidak akurat. Untuk mengakses atau memperbaiki data Anda, silakan menghubungi kami melalui alamat email atau alamat fisik yang tercantum di bawah ini.
              </p>

              <h3 class="text-h6 text-primary">Perubahan Kebijakan Privasi</h3>
              <p>
                Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu untuk mencerminkan perubahan dalam cara kami mengelola data pribadi atau perubahan yang terkait dengan hukum yang berlaku. Setiap pembaruan kebijakan akan diposting di halaman ini, dan kami menyarankan Anda untuk memeriksa halaman ini secara berkala untuk memastikan bahwa Anda selalu mendapatkan informasi terkini tentang cara kami menangani data pribadi Anda.
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
/* Styling untuk card dan form */
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

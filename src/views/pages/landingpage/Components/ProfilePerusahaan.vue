<script setup>
import gambarProyek from '@/assets/images/front/bangunan1.jpg'
import gambarTim from '@/assets/images/front/bangunan2.jpeg'
import Appbar from './AppBarMenu.vue'
import FooterSection from './FooterSection.vue'
import NewsLetter from './NewsLetter.vue'
import { ref } from 'vue'

const faqItems = [
  {
    question: 'Apa keuntungan menggunakan BangunGO?',
    answer: 'BangunGO menawarkan layanan konstruksi terintegrasi, dari perencanaan proyek, pengadaan material, hingga pelaksanaan oleh tenaga ahli berpengalaman.',
  },
  {
    question: 'Bisakah saya hanya memesan material tanpa jasa konstruksi?',
    answer: 'Tentu. Anda dapat memesan material bangunan secara mandiri melalui platform kami yang user-friendly dan transparan.',
  },
  {
    question: 'Bagaimana saya bisa yakin bahwa proyek ditangani oleh profesional?',
    answer: 'Kami hanya bekerja sama dengan tenaga profesional dan penyedia terpercaya yang telah melalui proses kurasi ketat serta memiliki rekam jejak yang jelas.',
  },
]

const activePanel = ref([])
</script>

<template>
  <Appbar />
  <v-container class="py-14 mt-16">
    <!-- Tentang BangunGO -->
    <v-row justify="center" class="text-center mb-12">
      <v-col cols="12" md="8">
        <h1 class="text-h3 font-weight-bold text-primary mb-4">
          Tentang BangunGO
        </h1>
        <p class="text-body-1 text-grey-darken-2">
          BangunGO adalah platform digital inovatif untuk kebutuhan konstruksi
          Anda — mulai dari perencanaan, pemesanan material, hingga layanan
          profesional secara efisien dan transparan.
        </p>
      </v-col>
    </v-row>

    <!-- Fitur Unggulan -->
    <v-row class="mb-14" justify="center" align="stretch" dense>
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-6 rounded-xl text-center elevation-4 h-100">
          <v-icon size="40" color="primary">mdi-truck-delivery-outline</v-icon>
          <h3 class="text-h6 font-weight-medium mt-3">Pengiriman Cepat</h3>
          <p class="text-body-2 mt-1">
            Material dikirim langsung ke lokasi proyek Anda dengan efisiensi
            tinggi.
          </p>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-6 rounded-xl text-center elevation-4 h-100">
          <v-icon size="40" color="primary"
            >mdi-account-hard-hat-outline</v-icon
          >
          <h3 class="text-h6 font-weight-medium mt-3">Tenaga Ahli</h3>
          <p class="text-body-2 mt-1">
            Profesional terpercaya di bidang konstruksi dan teknologi yang telah
            melalui proses seleksi.
          </p>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-6 rounded-xl text-center elevation-4 h-100">
          <v-icon size="40" color="primary">mdi-cash-multiple</v-icon>
          <h3 class="text-h6 font-weight-medium mt-3">
            Transparan & Terjangkau
          </h3>
          <p class="text-body-2 mt-1">
            Harga kompetitif, sistem digital yang memudahkan Anda memantau
            proyek secara real-time.
          </p>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-10"></v-divider>

    <!-- Section: Mengapa Memilih BangunGO -->
    <v-row justify="center" class="text-center mb-10">
      <v-col cols="12" md="8">
        <h2 class="text-h4 font-weight-bold text-primary mb-4">
          Mengapa Memilih BangunGO?
        </h2>
        <p class="text-body-1 text-grey-darken-1">
          BangunGO hadir sebagai solusi konstruksi berbasis teknologi untuk
          menyederhanakan proses, meningkatkan transparansi, dan menghadirkan
          hasil yang optimal pada setiap proyek Anda.
        </p>
      </v-col>
    </v-row>

    <!-- FAQ -->
    <v-row justify="center" class="mb-14">
      <v-col cols="12" md="8">
        <v-expansion-panels
          v-model="activePanel"
          multiple
          class="rounded-xl elevation-2"
        >
          <v-expansion-panel v-for="(item, index) in faqItems" :key="index">
            <v-expansion-panel-title
              class="text-subtitle-1 font-weight-medium text-primary"
            >
              {{ item.question }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              {{ item.answer }}
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <!-- Proyek Section -->
    <v-row class="mb-12 align-center">
      <v-col cols="12" md="6">
        <v-img
          :src="gambarProyek"
          alt="Proyek Bangunan"
          class="rounded-xl elevation-4 transition"
          height="320"
          cover
        />
      </v-col>
      <v-col cols="12" md="6">
        <h2 class="text-h5 font-weight-bold text-primary mb-2">
          🔧 Solusi Terintegrasi
        </h2>
        <p>
          Mulai dari estimasi anggaran, pembelian material, hingga pengelolaan
          tim konstruksi—semuanya tersedia dalam satu platform yang mudah
          digunakan.
        </p>
      </v-col>
    </v-row>

    <!-- Tim Section -->
    <v-row class="mb-10 flex-md-row-reverse align-center">
      <v-col cols="12" md="6">
        <v-img
          :src="gambarTim"
          alt="Tim BangunGO"
          class="rounded-xl elevation-4 transition"
          height="320"
          cover
        />
      </v-col>
      <v-col cols="12" md="6">
        <h2 class="text-h5 font-weight-bold text-primary mb-2">
          👷‍♂️ Tim Profesional
        </h2>
        <p>
          Tim multidisiplin kami memiliki keahlian di bidang arsitektur, teknik
          sipil, dan teknologi digital—siap menghadirkan solusi inovatif dan
          hasil terbaik untuk setiap proyek Anda.
        </p>
      </v-col>
    </v-row>
  </v-container>

  <NewsLetter />
  <FooterSection />
</template>

<style scoped>
p {
  line-height: 1.7;
}
.transition {
  transition: transform 0.3s ease;
}
.transition:hover {
  transform: scale(1.02);
}
</style>

<script setup lang="ts">
import Appbar from './Components/AppBarMenu.vue';
import HomeBanner from './Components/HomeBanner.vue';
import Footer from './Components/FooterSection.vue';
import 'aos/dist/aos.css';
import { onMounted } from 'vue';
import AOS from 'aos';
//import ElementBlock from './Components/ElementBlock.vue';
import Technology from './Components/TechnologySection.vue';
//import Marquee from './Components/MarqueeSection.vue';
import ProdukPage from './Components/ProductPage.vue';
//import DownloadSection from './Components/DownloadSection.vue';
//import PartnerSection from './Components/PartnerSection.vue';
import NewsLetter from './Components/NewsLetter.vue';

onMounted(() => {
  AOS.init();
});
</script>

<template>
  <v-layout class="bg-containerBg">
    <Appbar />
    <v-main class="ma-0">
      <HomeBanner />
      <ProdukPage />
      <Technology />
      <NewsLetter />
      <Footer />
    </v-main>
  </v-layout>
</template>

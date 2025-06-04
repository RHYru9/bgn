<script setup lang="ts">
import { onMounted } from 'vue';
import Appbar from '@/views/pages/landingpage/Components/AppBarMenu.vue';
import FooterSection from '@/views/pages/landingpage/Components/FooterSection.vue';
import CartCheckout from '@/components/apps/users/cart/CartCheckout.vue';
import { useCustomizerStore } from '@/stores/customizer';

const customizer = useCustomizerStore();

onMounted(() => {
  customizer.setLayout('boxed');
});
</script>

<template>
  <v-app>
    <!-- Appbar -->
    <Appbar />

    <v-main>
      <v-container fluid class="pt-16 px-4">
        <CartCheckout />
      </v-container>
    </v-main>

    <!-- Footer -->
    <FooterSection />
  </v-app>
</template>

<style scoped>

.v-main {
  padding-top: 28px;
}
</style>

<script setup lang="ts">
import { shallowRef } from 'vue';

const footerLink = shallowRef([
  {
    title: 'Home',
    link: 'https://github.com/rhyru9/'
  },
  {
    title: 'Documentation',
    link: 'https://github.com/rhyru9/'
  },
  {
    title: 'Support',
    link: 'https://github.com/rhyru9/'
  }
]);
</script>
<template>
  <v-footer class="px-0 footer">
    <v-row justify="center" no-gutters>
      <v-col cols="6">
        <p class="text-caption mb-0">© RhyRU9</p>
      </v-col>
      <v-col class="text-end" cols="6">
        <a v-for="(item, i) in footerLink" :key="i" class="mx-2 text-caption text-darkText" target="_blank" :href="item.link">
          {{ item.title }}
        </a>
      </v-col>
    </v-row>
  </v-footer>
</template>

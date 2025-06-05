<script setup lang="ts">
import { ref } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';

import ProfileTab from './userProfile.vue';

const page = ref({ title: 'Profil' });
const breadcrumbs = ref([
  {
    title: 'Pengguna',
    disabled: false,
    href: '#'
  },
  {
    title: 'Akun',
    disabled: false,
    href: '#'
  },
  {
    title: 'Profil',
    disabled: true,
    href: '#'
  }
]);
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <v-card variant="flat" rounded="lg">
        <v-card variant="outlined" rounded="lg">
          <v-card-text class="px-6 pb-6 pt-6">
            <ProfileTab />
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>
  </v-row>
</template>

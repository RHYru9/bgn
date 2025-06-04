<script setup lang="ts">
import { shallowRef } from 'vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';

const dataInvoice = shallowRef([
  {
    icon: 'custom-file-text-fill',
    title: 'Semua Faktur',
    color: 'primary'
  },
  {
    icon: 'custom-report-fill',
    title: 'Laporan',
    color: 'info'
  },
  {
    icon: 'custom-dollar-fill',
    title: 'Lunas',
    color: 'success'
  },
  {
    icon: 'custom-pending-fill',
    title: 'Menunggu Pembayaran',
    color: 'warning'
  },
  {
    icon: 'custom-close-circle-fill',
    title: 'Dibatalkan',
    color: 'error'
  },
  {
    icon: 'custom-shopping-bag-fill',
    title: 'Draf',
    color: 'primary'
  }
]);
</script>

<template>
  <v-card variant="outlined" class="bg-surface">
    <v-card-text>
      <v-row>
        <v-col
          cols="6"
          lg="6"
          sm="4"
          v-for="item in dataInvoice"
          :key="item.title"
        >
          <v-card variant="outlined" class="text-center">
            <v-card-item>
              <v-avatar :color="item.color">
                <SvgSprite :name="item.icon || ''" style="width: 20px; height: 20px" />
              </v-avatar>
              <h6 class="text-subtitle-1 text-lightText mb-0 mt-4">
                {{ item.title }}
              </h6>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

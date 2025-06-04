<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import WelcomeBanner from './components/WelcomeBanner.vue';
import { useTransaksiStore } from '@/stores/apps/transaksi';
import { useAuthStore } from '@/stores/auth';

import TabCard from '@/views/apps/user/Dashboard/TabCard.vue';
import RecentInvoice from '@/views/apps/user/Dashboard/transaksiBaru.vue';
import TotalExpense from '@/views/apps/user/Dashboard/TotalPengeluaran.vue';
import NotificationInvoice from '@/views/apps/user/Dashboard/notifikasiAkun.vue';

// Theme breadcrumb
const page = ref({ title: 'Dashboard Saya' });
const breadcrumbs = ref([
  {
    title: 'Halaman',
    disabled: false,
    href: '#'
  },
  {
    title: 'Dashboard',
    disabled: true,
    href: '#'
  }
]);

const authStore = useAuthStore();
const transaksiStore = useTransaksiStore();

onMounted(async () => {
  await transaksiStore.fetchTransaksi(authStore.token);
});
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <!-- Welcome Banner -->
  <v-row class="my-0">
    <v-col cols="12">
      <WelcomeBanner />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <TabCard />
    </v-col>

    <v-col cols="12" lg="8" md="7">
      <v-row>
        <v-col cols="12" lg="6">
          <RecentInvoice />
        </v-col>

        <v-col cols="12" lg="6">
          <TotalExpense />
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" lg="4" md="5">
      <NotificationInvoice />
    </v-col>
  </v-row>
</template>

<style lang="scss">
.invoiceTab {
  --v-tabs-height: unset;
  .v-slide-group__content {
    @media (max-width: 960px) {
      flex: unset;
    }
  }
  .v-tab {
    width: auto;
    height: 100%;
    min-width: unset;
    --v-btn-height: unset;
    padding: 0;
    display: block;
    &.v-tab-item--selected {
      .v-card--variant-outlined {
        border: 1px solid transparent;
      }
      > .v-btn__overlay {
        opacity: calc(var(--v-hover-opacity) * var(--v-theme-overlay-multiplier));
      }
    }
  }
}

// Additional responsive styling
@media (max-width: 960px) {
  .v-col {
    padding-top: 10px;
    padding-bottom: 8px;
  }
}
</style>
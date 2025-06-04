<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { useTransaksiStore } from '@/stores/apps/transaksi';
import { useAuthStore } from '@/stores/auth';

// Dashboard components
import TabCard from './Dashboard/TabCard.vue';
import InvoiceStatus from './Dashboard/InvoiceStatus.vue';
import RecentInvoice from './Dashboard/transaksiTerbaru.vue';
import TotalExpense from './Dashboard/TotalExpense.vue';
import NotificationInvoice from './Dashboard/notifikasiAkun.vue';


// Theme breadcrumb
const page = ref({ title: 'Informasi Transaksi' });
const breadcrumbs = ref([
  {
    title: 'Transaksi',
    disabled: false,
    href: '#'
  },
  {
    title: 'Ringkasan Transaksi',
    disabled: true,
    href: '#'
  }
]);

const authStore = useAuthStore();
const transaksiStore = useTransaksiStore();

// Load data on component mount
onMounted(async () => {
  await transaksiStore.fetchTransaksi(authStore.token);
});

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  
  <v-row>
    <!-- Other Dashboard Components -->
    <v-col cols="12" xl="9" lg="7">
      <TabCard />
    </v-col>
    <v-col cols="12" xl="3" lg="5">
      <InvoiceStatus />
    </v-col>
    <v-col cols="12" lg="4" md="6">
      <RecentInvoice />
    </v-col>
    <v-col cols="12" lg="4" md="6">
      <TotalExpense />
    </v-col>
    <v-col cols="12" lg="4" md="6">
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
</style>
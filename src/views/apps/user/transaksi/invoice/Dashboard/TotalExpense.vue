<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from 'vuetify';
import { useTransaksiStore } from '@/stores/apps/transaksi';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import CardHeader from '@/components/shared/CardHeader.vue';

const theme = useTheme();
const transaksiStore = useTransaksiStore();

// Get colors from theme
const successColor = theme.current.value.colors.success;
const warningColor = theme.current.value.colors.warning;

// Format currency helper
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

// Calculate expense data from transactions
const expenseData = computed(() => {
  const paid = transaksiStore.paidTransaksi.reduce((sum, t) => sum + parseFloat(t.total_harga), 0);
  const pending = transaksiStore.pendingTransaksi.reduce((sum, t) => sum + parseFloat(t.total_harga), 0);
  const total = paid + pending;

  return {
    series: [pending, paid],
    chartData: [
      {
        status: 'Belum Bayar',
        color: 'warning',
        price: formatCurrency(pending),
        percentage: total > 0 ? ((pending / total) * 100).toFixed(1) + '%' : '0%'
      },
      {
        status: 'Lunas',
        color: 'success',
        price: formatCurrency(paid),
        percentage: total > 0 ? ((paid / total) * 100).toFixed(1) + '%' : '0%'
      }
    ],
    total: formatCurrency(total)
  };
});

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'donut',
      height: 230,
      fontFamily: `inherit`,
      toolbar: {
        show: false
      }
    },
    colors: [warningColor, successColor],
    plotOptions: {
      donut: {
        size: '15%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            color: 'rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity))',
            formatter: () => expenseData.value.total
          }
        }
      }
    },
    stroke: {
      width: 0
    },
    labels: ['Belum Bayar', 'Lunas'],
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      theme: 'light',
      fillSeriesColor: false,
      y: {
        formatter: (value: number) => formatCurrency(value)
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          }
        }
      }
    ]
  };
});
</script>

<template>
  <CardHeader title="Total Pengeluaran" class="overflow-hidden">
    <template v-slot:header>
      <v-btn variant="text" aria-label="menu" color="secondary" icon rounded="md" size="small">
        <SvgSprite name="custom-more-outline" style="width: 20px; height: 20px" />
      </v-btn>
    </template>
    <div class="pa-5">
      <apexchart 
        type="donut" 
        height="230" 
        :options="chartOptions" 
        :series="expenseData.series" 
        class="invoiceChart"
      ></apexchart>
      <v-list density="compact" class="pb-0" aria-label="daftar pengeluaran" aria-busy="true">
        <v-list-item 
          v-for="(item, i) in expenseData.chartData" 
          :key="i" 
          class="pa-0 mb-2"
        >
          <div class="d-flex align-center justify-space-between w-100">
            <div class="d-flex align-center">
              <v-badge dot :color="item.color" size="large" inline></v-badge>
              <h6 class="text-subtitle-1 text-lightText mb-0 ms-2">
                {{ item.status }}
                <span class="text-caption d-block">{{ item.percentage }}</span>
              </h6>
            </div>
            <h5 class="text-h6 font-weight-medium mb-0">{{ item.price }}</h5>
          </div>
        </v-list-item>
      </v-list>
    </div>
  </CardHeader>
</template>

<style lang="scss">
.invoiceChart {
  .apexcharts-canvas {
    margin: 0 auto;
  }
  .apexcharts-text.apexcharts-datalabel-label {
    font-size: 14px;
    font-weight: 500;
  }
  .apexcharts-text.apexcharts-datalabel-value {
    font-size: 16px;
    font-weight: 600;
  }
}
</style>
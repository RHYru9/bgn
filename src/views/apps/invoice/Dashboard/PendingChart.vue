<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from 'vuetify';
import { useTransaksiStore } from '@/stores/apps/transaksi';

const theme = useTheme();
const transaksiStore = useTransaksiStore();
const warningColor = theme.current.value.colors.warning;

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'line',
      stacked: false,
      height: 255,
      fontFamily: `inherit`,
      foreColor: 'rgba(var(--v-theme-secondary), var(--v-high-opacity))',
      toolbar: {
        show: false
      }
    },
    colors: [warningColor, warningColor],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: [0, 2]
    },
    plotOptions: {
      bar: {
        columnWidth: '50%'
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        inverseColors: false,
        shade: 'light',
        type: 'vertical',
        opacityFrom: [0, 1],
        opacityTo: [0.5, 1],
        stops: [0, 100],
        hover: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: 0.15,
          opacityTo: 0.65,
          stops: [0, 96, 100]
        }
      }
    },
    xaxis: {
      categories: transaksiStore.monthlyData.months
    },
    legend: {
      show: false
    },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)'
    },
    markers: {
      size: [0, 3],
      colors: '#fff',
      strokeWidth: [0, 2],
      strokeColors: warningColor,
      hover: {
        size: 5,
        colors: warningColor,
        strokeColors: '#fff'
      }
    }
  };
});

const mixedChart = computed(() => {
  return {
    series: [
      {
        name: 'Pending',
        type: 'column',
        data: transaksiStore.monthlyData.data.pending
      },
      {
        name: 'Trend',
        type: 'line',
        data: transaksiStore.monthlyData.data.pending.map((val: number, index: number, arr: number[]) => {
          if (index === 0) return val;
          return val + arr[index - 1];
        })
      }
    ]
  };
});
</script>

<template>
  <apexchart type="line" height="255" :options="chartOptions" :series="mixedChart.series"></apexchart>
</template>
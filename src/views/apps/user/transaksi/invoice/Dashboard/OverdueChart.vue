<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from 'vuetify';
import { useTransaksiStore } from '@/stores/apps/transaksi';

const theme = useTheme();
const transaksiStore = useTransaksiStore();
const errorColor = theme.current.value.colors.error;
const primaryColor = theme.current.value.colors.primary;

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'line',
      height: 255,
      fontFamily: 'inherit',
      foreColor: 'rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity))',
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: [errorColor, primaryColor],
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: [3, 2],
      dashArray: [0, 3]
    },
    plotOptions: {
      bar: {
        columnWidth: '45%',
        borderRadius: 4,
        dataLabels: { position: 'top' }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.3,
        inverseColors: false,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: 'rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity))'
        }
      }
    },
    yaxis: {
      labels: {
        formatter: (val: number) => formatRupiah(val),
        style: {
          colors: 'rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity))'
        }
      },
      min: 0
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      markers: {
        radius: 12,
        width: 10,
        height: 10
      }
    },
    grid: {
      borderColor: 'rgba(var(--v-border-color), var(--v-border-opacity))',
      strokeDashArray: 4,
      yaxis: { lines: { show: true } }
    },
    markers: {
      size: [0, 5],
      colors: [errorColor, primaryColor],
      strokeWidth: 2,
      hover: { size: 7 }
    },
    tooltip: {
      y: { formatter: (val: number) => formatRupiah(val) },
      style: { fontSize: '12px' }
    },
    responsive: [{
      breakpoint: 600,
      options: {
        chart: { height: 200 },
        legend: { position: 'bottom' }
      }
    }]
  };
});

const mixedChart = computed(() => {
  const overdueData = transaksiStore.monthlyData.data.overdue;
  let cumulativeSum = 0;
  
  return {
    series: [
      {
        name: 'Tunggakan',
        type: 'column',
        data: overdueData
      },
      {
        name: 'Trend Kumulatif',
        type: 'line',
        data: overdueData.map((val: number) => {
          cumulativeSum += val;
          return cumulativeSum;
        })
      }
    ]
  };
});
</script>

<template>
  <apexchart 
    type="line" 
    height="255" 
    :options="chartOptions" 
    :series="mixedChart.series"
    class="overdue-chart"
  />
</template>

<style scoped>
.overdue-chart {
  transition: all 0.3s ease;
}
.overdue-chart:hover {
  transform: translateY(-2px);
}
</style>
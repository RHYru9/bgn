<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from 'vuetify';
import { useTransaksiStore } from '@/stores/apps/transaksi';

const theme = useTheme();
const transaksiStore = useTransaksiStore();
const warningColor = theme.current.value.colors.warning;
const primaryColor = theme.current.value.colors.primary;

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'line',
      height: 255,
      fontFamily: 'inherit',
      foreColor: 'rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity))',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        }
      }
    },
    colors: [primaryColor, warningColor],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: [3, 2],
      dashArray: [0, 3]
    },
    plotOptions: {
      bar: {
        columnWidth: '45%',
        borderRadius: 4,
        dataLabels: {
          position: 'top'
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.3,
        inverseColors: false,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: transaksiStore.monthlyData.months,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: 'rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity))',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        formatter: (val: number) => formatCurrency(val),
        style: {
          colors: 'rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity))',
          fontSize: '12px'
        }
      },
      min: 0
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      markers: {
        radius: 12,
        width: 10,
        height: 10
      },
      itemMargin: {
        horizontal: 8,
        vertical: 4
      }
    },
    grid: {
      borderColor: 'rgba(var(--v-border-color), var(--v-border-opacity))',
      strokeDashArray: 4,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 10
      },
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    markers: {
      size: [0, 5],
      colors: [primaryColor, warningColor],
      strokeColors: [primaryColor, warningColor],
      strokeWidth: 2,
      strokeOpacity: 0.9,
      fillOpacity: 1,
      hover: {
        size: 7
      }
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number) => formatCurrency(val)
      },
      style: {
        fontSize: '12px'
      },
      marker: {
        show: true
      }
    },
    responsive: [{
      breakpoint: 600,
      options: {
        chart: {
          height: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };
});

const mixedChart = computed(() => {
  const monthlyData = transaksiStore.monthlyData.data.total;
  let cumulativeSum = 0;
  
  return {
    series: [
      {
        name: 'Total Transaksi',
        type: 'column',
        data: monthlyData
      },
      {
        name: 'Trend Kumulatif',
        type: 'line',
        data: monthlyData.map((val: number) => {
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
    class="total-chart"
  ></apexchart>
</template>

<style scoped>
.total-chart {
  transition: all 0.3s ease;
}

.total-chart:hover {
  transform: translateY(-2px);
}
</style>
<script setup lang="ts">
import { ref, computed } from 'vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import { useTransaksiStore } from '@/stores/apps/transaksi';

import TotalChart from './TotalChart.vue';
import PaidChart from './PaidChart.vue';
import PendingChart from './PendingChart.vue';
import OverdueChart from './OverdueChart.vue';

const transaksiStore = useTransaksiStore();
const tab = ref(0);

// Format currency helper
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

// Calculate percentage change
const percentageChange = computed(() => {
  const currentMonth = new Date().getMonth();
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  
  const currentTotal = transaksiStore.monthlyData.data.total[currentMonth] || 0;
  const prevTotal = transaksiStore.monthlyData.data.total[prevMonth] || 0;
  
  if (prevTotal === 0) return 0;
  return ((currentTotal - prevTotal) / prevTotal) * 100;
});

// Format percentage with sign
const formatPercentage = (value: number) => {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
};
</script>

<template>
  <v-card variant="outlined" class="bg-surface">
    <v-card-text>
      <v-tabs v-model="tab" color="primary" class="invoiceTab">
        <v-row no-gutters>
          <v-col cols="12" md="3" sm="6" class="pa-2">
            <v-tab value="1" tag="div" color="dark" hide-slider rounded="lg">
              <v-card variant="outlined" rounded="lg">
                <v-card-text>
                  <div class="d-flex align-start justify-space-between">
                    <div>
                      <h6 class="text-subtitle-1">Total</h6>
                      <h5 class="text-h5 mb-0">{{ formatCurrency(transaksiStore.totalNilaiTransaksi) }}</h5>
                      <div class="d-flex align-center">
                        <h5 class="text-h5 mb-0 me-1">{{ transaksiStore.totalTransaksi }}</h5>
                        <p class="text-h6 text-lightText mb-0">transaksi</p>
                      </div>
                    </div>
                    <div class="d-flex align-center">
                      <SvgSprite 
                        :name="percentageChange > 0 ? 'custom-chevron-up-fill' : 'custom-chevron-down'" 
                        :class="percentageChange > 0 ? 'text-success' : 'text-error'" 
                        style="width: 16px; height: 16px" 
                      />
                      <h5 class="text-body-1 font-weight-medium text-lightText mb-0 ms-1">
                        {{ formatPercentage(percentageChange) }}
                      </h5>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab>
          </v-col>
          <v-col cols="12" md="3" sm="6" class="pa-2">
            <v-tab value="2" tag="div" color="dark" hide-slider rounded="lg">
              <v-card variant="outlined" rounded="lg">
                <v-card-text>
                  <div class="d-flex align-start justify-space-between">
                    <div>
                      <h6 class="text-subtitle-1 text-start">Paid</h6>
                      <h5 class="text-h5 mb-0">{{ formatCurrency(transaksiStore.paidTransaksi.reduce((sum, t) => sum + parseFloat(t.total_harga), 0)) }}</h5>
                      <div class="d-flex align-center">
                        <h5 class="text-h5 mb-0 me-1">{{ transaksiStore.paidTransaksi.length }}</h5>
                        <p class="text-h6 text-lightText mb-0">transaksi</p>
                      </div>
                    </div>
                    <div class="d-flex align-center">
                      <SvgSprite name="custom-chevron-down" class="text-error" style="width: 16px; height: 16px" />
                      <h5 class="text-body-1 font-weight-medium text-lightText mb-0 ms-1">-8.73%</h5>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab>
          </v-col>
          <v-col cols="12" md="3" sm="6" class="pa-2">
            <v-tab value="3" tag="div" color="dark" hide-slider rounded="lg">
              <v-card variant="outlined" rounded="lg">
                <v-card-text>
                  <div class="d-flex align-start justify-space-between">
                    <div>
                      <h6 class="text-subtitle-1 text-start">Pending</h6>
                      <h5 class="text-h5 mb-0">{{ formatCurrency(transaksiStore.pendingTransaksi.reduce((sum, t) => sum + parseFloat(t.total_harga), 0)) }}</h5>
                      <div class="d-flex align-center">
                        <h5 class="text-h5 mb-0 me-1">{{ transaksiStore.pendingTransaksi.length }}</h5>
                        <p class="text-h6 text-lightText mb-0">transaksi</p>
                      </div>
                    </div>
                    <div class="d-flex align-center">
                      <SvgSprite name="custom-chevron-up-fill" class="text-success" style="width: 16px; height: 16px" />
                      <h5 class="text-body-1 font-weight-medium text-lightText mb-0 ms-1">10.73%</h5>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab>
          </v-col>
          <v-col cols="12" md="3" sm="6" class="pa-2">
            <v-tab value="4" tag="div" color="dark" hide-slider rounded="lg">
              <v-card variant="outlined" rounded="lg">
                <v-card-text>
                  <div class="d-flex align-start justify-space-between">
                    <div>
                      <h6 class="text-subtitle-1 text-start">Overdue</h6>
                      <h5 class="text-h5 mb-0">{{ formatCurrency(transaksiStore.overdueTransaksi.reduce((sum, t) => sum + parseFloat(t.total_harga), 0)) }}</h5>
                      <div class="d-flex align-center">
                        <h5 class="text-h5 mb-0 me-1">{{ transaksiStore.overdueTransaksi.length }}</h5>
                        <p class="text-h6 text-lightText mb-0">transaksi</p>
                      </div>
                    </div>
                    <div class="d-flex align-center">
                      <SvgSprite name="custom-chevron-down" class="text-primary" style="width: 16px; height: 16px" />
                      <h5 class="text-body-1 font-weight-medium text-lightText mb-0 ms-1">-4.73%</h5>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab>
          </v-col>
        </v-row>
      </v-tabs>
      <v-tabs-window v-model="tab" class="mt-5">
        <v-tabs-window-item value="1">
          <TotalChart />
        </v-tabs-window-item>

        <v-tabs-window-item value="2">
          <PaidChart />
        </v-tabs-window-item>

        <v-tabs-window-item value="3">
          <PendingChart />
        </v-tabs-window-item>

        <v-tabs-window-item value="4">
          <OverdueChart />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
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
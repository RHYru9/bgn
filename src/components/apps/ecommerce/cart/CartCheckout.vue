<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { keranjangService } from '@/stores/apps/keranjang/KeranjangService';

import Appbar from '@/views/pages/landingpage/Components/AppBarMenu.vue';
import FooterSection from '@/views/pages/landingpage/Components/FooterSection.vue';

import CartStep from './test/CartStep1.vue';
import PaymentStep from './test/CartStep2.vue';
import ConfirmationStep from './test/CartStep3.vue';
import OrderSummary from './test/OrderSummary.vue';
import Kosong from './test/CartKosong.vue';
import Terimakasih from './test/CartTerimakasih.vue';

interface Address {
  nama: string;
  no_hp: string;
  email: string;
  alamat: string;
  kode_pos: string;
}

interface PaymentMethod {
  type: 'cod' | 'transfer';
}

interface CheckoutState {
  step: number;
  keranjangItems: any[];
  alamatPengiriman: Address;
  paymentMethod: PaymentMethod;
  catatanPembeli: string;
  totalHarga: number;
}

interface CompleteCheckoutParams {
  buktiTransfer?: File;
  catatan?: string;
}

const router = useRouter();
const tab = ref('tab-1');
const loading = ref(false);
const orderCompleted = ref(false);
const kodeTransaksi = ref('');
const isLoggedIn = ref(false);

const checkoutState = ref<CheckoutState>({
  step: 1,
  keranjangItems: [],
  alamatPengiriman: {
    nama: '',
    no_hp: '',
    email: '',
    alamat: '',
    kode_pos: '',
  },
  paymentMethod: { type: 'cod' },
  catatanPembeli: '',
  totalHarga: 0,
});

function changeTab(newTab: string) {
  tab.value = newTab;
  checkoutState.value.step = parseInt(newTab.split('-')[1]);
  saveState();
}

function updateAddress(address: Address) {
  checkoutState.value.alamatPengiriman = address;
  saveState();
}

function updatePaymentMethod(paymentMethod: PaymentMethod) {
  checkoutState.value.paymentMethod = paymentMethod;
  saveState();
}

async function updateItems() {
  try {
    loading.value = true;
    const updatedItems = await keranjangService.getKeranjangItems();
    checkoutState.value.keranjangItems = updatedItems;
    checkoutState.value.totalHarga = calculateTotalPrice(updatedItems);
    saveState();
    if (updatedItems.length === 0) {
      tab.value = 'tab-empty';
    }
  } catch (error) {
    console.error('Error updating items:', error);
  } finally {
    loading.value = false;
  }
}

function calculateTotalPrice(items: any[]) {
  return items.reduce((total, item) => {
    return total + (item.barang.harga_jual * item.jumlah);
  }, 0);
}

function saveState() {
  keranjangService.saveCheckoutState(checkoutState.value);
}

async function initializeCheckout() {
  try {
    loading.value = true;
    const token = localStorage.getItem('token');
    isLoggedIn.value = !!token;

    if (!token) {
      tab.value = 'tab-empty';
      return;
    }

    const savedState = keranjangService.getCheckoutState();

    if (savedState) {
      checkoutState.value = savedState;
      tab.value = `tab-${savedState.step}`;
      
      try {
        const currentItems = await keranjangService.getKeranjangItems();
        checkoutState.value.keranjangItems = currentItems;
        checkoutState.value.totalHarga = calculateTotalPrice(currentItems);
      } catch (error) {
        console.warn('Could not verify saved items, using saved state');
      }
    } else {
      try {
        const newState = await keranjangService.initializeCheckout();
        checkoutState.value = newState;
        tab.value = 'tab-1';
      } catch (serviceError) {
        console.error('Service error:', serviceError);
        tab.value = 'tab-empty';
        return;
      }
    }

    if (checkoutState.value.keranjangItems.length === 0) {
      tab.value = 'tab-empty';
    }
  } catch (error) {
    console.error('Initialization error:', error);
    const token = localStorage.getItem('token');
    isLoggedIn.value = !!token;
    tab.value = 'tab-empty';
  } finally {
    loading.value = false;
  }
}

async function completeCheckout({ buktiTransfer, catatan }: CompleteCheckoutParams) {
  try {
    loading.value = true;

    if (catatan) {
      checkoutState.value.catatanPembeli = catatan;
      saveState();
    }

    await keranjangService.processCheckout(buktiTransfer);

    const response = await fetch('/api/transaksi', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        Accept: 'application/json',
      },
    });

    const data = await response.json();
    if (data.length > 0) {
      kodeTransaksi.value = data[0].kode_transaksi;
    }

    orderCompleted.value = true;
    tab.value = 'tab-4';
  } catch (error) {
    console.error('Checkout error:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  initializeCheckout();
});
</script>

<template>
  <Appbar />
  <v-main>
    <v-container>
      <v-row>
        <v-col>
          <!-- Loading -->
          <template v-if="loading">
            <v-card variant="outlined" class="bg-surface" rounded="lg">
              <v-card-text class="text-center py-16">
                <v-progress-circular indeterminate color="primary" size="64" />
                <p class="mt-4 text-h6">Memuat...</p>
              </v-card-text>
            </v-card>
          </template>

          <!-- Selesai -->
          <template v-else-if="orderCompleted">
            <Terimakasih :kode-transaksi="kodeTransaksi" />
          </template>

          <!-- Kosong -->
          <template v-else-if="tab === 'tab-empty'">
            <Kosong :is-logged-in="isLoggedIn" />
          </template>

          <!-- Checkout -->
          <template v-else>
            <v-card class="bg-surface mb-4" variant="outlined" rounded="lg">
              <v-card-text class="pa-0">
                <v-tabs v-model="tab" color="primary" class="custom-tab" hide-slider>
                  <v-tab value="tab-1">
                    <v-avatar size="24" color="primary" variant="tonal" class="me-2">1</v-avatar>
                    Keranjang & Alamat
                  </v-tab>
                  <v-tab value="tab-2" :disabled="checkoutState.keranjangItems.length < 1">
                    <v-avatar size="24" color="primary" variant="tonal" class="me-2">2</v-avatar>
                    Informasi Pengiriman
                  </v-tab>
                  <v-tab value="tab-3" :disabled="checkoutState.keranjangItems.length < 1">
                    <v-avatar size="24" color="primary" variant="tonal" class="me-2">3</v-avatar>
                    Pembayaran
                  </v-tab>
                  <v-tab value="tab-4" disabled>
                    <v-avatar size="24" color="primary" variant="tonal" class="me-2">4</v-avatar>
                    Selesai
                  </v-tab>
                </v-tabs>
              </v-card-text>
            </v-card>

            <v-window v-model="tab" class="mx-n6 px-6">
              <!-- Step 1 -->
              <v-window-item value="tab-1">
                <v-row v-if="checkoutState.keranjangItems.length > 0">
                  <v-col md="8" cols="12">
                    <CartStep
                      :items="checkoutState.keranjangItems"
                      :address="checkoutState.alamatPengiriman"
                      @update-address="updateAddress"
                      @update-items="updateItems"
                      @next="changeTab('tab-2')"
                    />
                  </v-col>
                  <v-col md="4" cols="12">
                    <OrderSummary :checkout-state="checkoutState" />
                    <v-btn
                      color="primary"
                      class="mt-4"
                      block
                      rounded="md"
                      @click="changeTab('tab-2')"
                      :disabled="checkoutState.keranjangItems.length < 1"
                    >
                      Proses ke Checkout
                    </v-btn>
                  </v-col>
                </v-row>
                <div v-else class="d-flex justify-center">
                  <v-btn color="primary" @click="tab = 'tab-empty'">Lihat Produk</v-btn>
                </div>
              </v-window-item>

              <!-- Step 2 -->
              <v-window-item value="tab-2">
                <v-row>
                  <v-col md="8" cols="12">
                    <PaymentStep
                      :payment-method="checkoutState.paymentMethod"
                      @update-payment="updatePaymentMethod"
                    />
                    <v-row class="mt-3">
                      <v-col cols="12" class="text-end">
                        <v-btn variant="text" color="secondary" @click="changeTab('tab-1')">
                          Kembali ke Keranjang
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col md="4" cols="12">
                    <OrderSummary :checkout-state="checkoutState" />
                    <v-btn
                      color="primary"
                      block
                      rounded="md"
                      class="mt-6"
                      @click="changeTab('tab-3')"
                    >
                      Proses ke Pembayaran
                    </v-btn>
                  </v-col>
                </v-row>
              </v-window-item>

              <!-- Step 3 -->
              <v-window-item value="tab-3">
                <v-row>
                  <v-col md="8" cols="12">
                    <ConfirmationStep
                      :checkout-state="checkoutState"
                      @complete="completeCheckout"
                    />
                    <v-row class="mt-3">
                      <v-col cols="12" class="text-end">
                        <v-btn variant="text" color="secondary" @click="changeTab('tab-2')">
                          Kembali ke Informasi Pengiriman
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col md="4" cols="12">
                    <OrderSummary :checkout-state="checkoutState" /> 
                    <v-btn
                      color="primary"
                      block
                      rounded="md"
                      class="mt-4"
                      @click="tab = 'tab-4'"
                    >
                      Selesai
                    </v-btn>
                  </v-col>
                </v-row>
              </v-window-item>

              <!-- Step 4 - Thank You Page -->
              <v-window-item value="tab-4">
                <Terimakasih :kode-transaksi="kodeTransaksi" />
              </v-window-item>
            </v-window>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
  <FooterSection />
</template>

<style lang="scss">
.custom-tab.v-tabs {
  --v-tabs-height: unset;
  .v-tab--selected {
    .v-tab__slider {
      opacity: 0;
    }
  }
}
</style>
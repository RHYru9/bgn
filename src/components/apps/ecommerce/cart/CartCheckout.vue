<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { keranjangService } from '@/stores/apps/keranjang/KeranjangService';
import { useVerifikasiStore } from '@/stores/apps/sudahVerifikasi';

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
const verifikasiStore = useVerifikasiStore();
const tab = ref('tab-1');
const loading = ref(false);
const orderCompleted = ref(false);
const kodeTransaksi = ref('');
const isLoggedIn = ref(false);
const showVerificationAlert = ref(false);
const showClearCartDialog = ref(false);

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
  // Check verification before allowing navigation to payment steps
  if ((newTab === 'tab-2' || newTab === 'tab-3') && !verifikasiStore.isEmailVerified) {
    showVerificationAlert.value = true;
    return;
  }
  
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

// Function to clear cart and checkout data from localStorage
function clearCartAndCheckout() {
  try {
    // Clear checkout state
    localStorage.removeItem('checkout_state');
    
    // Clear keranjang items (adjust key names based on your localStorage keys)
    localStorage.removeItem('keranjang');
    localStorage.removeItem('keranjangItems');
    
    // Reset checkout state
    checkoutState.value = {
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
    };
    
    // Navigate to empty cart
    tab.value = 'tab-empty';
    showClearCartDialog.value = false;
    
    console.log('Cart and checkout data cleared successfully');
  } catch (error) {
    console.error('Error clearing cart data:', error);
  }
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

    // Check email verification status
    await verifikasiStore.checkVerifikasi();

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
  // Check verification before completing checkout
  if (!verifikasiStore.isEmailVerified) {
    showVerificationAlert.value = true;
    return;
  }

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

function handleProceedToCheckout() {
  if (!verifikasiStore.isEmailVerified) {
    showVerificationAlert.value = true;
    return;
  }
  changeTab('tab-2');
}

function handleProceedToPayment() {
  if (!verifikasiStore.isEmailVerified) {
    showVerificationAlert.value = true;
    return;
  }
  changeTab('tab-3');
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
          <!-- Verification Alert -->
          <v-alert
            v-model="showVerificationAlert"
            type="warning"
            closable
            class="mb-4"
            variant="tonal"
          >
            <template #title>
              Akun Belum Diverifikasi
            </template>
            <template #text>
              Akun Anda belum diverifikasi. Belum bisa untuk transaksi produk, silahkan verifikasi terlebih dahulu.
            </template>
            <template #append>
              <v-btn
                color="warning"
                variant="outlined"
                size="small"
                @click="router.push('/verifikasi')"
              >
                Verifikasi Sekarang
              </v-btn>
            </template>
          </v-alert>

          <!-- Clear Cart Button - Show when there are items in cart or checkout state exists -->
          <div v-if="checkoutState.keranjangItems.length > 0 || tab !== 'tab-empty'" class="mb-4 text-end">
            <v-btn
              color="error"
              variant="outlined"
              size="small"
              prepend-icon="mdi-delete"
              @click="showClearCartDialog = true"
            >
              Hapus Keranjang
            </v-btn>
          </div>

          <!-- Clear Cart Confirmation Dialog -->
          <v-dialog v-model="showClearCartDialog" max-width="400">
            <v-card>
              <v-card-title class="text-h6">
                Hapus Keranjang
              </v-card-title>
              <v-card-text>
                Apakah Anda yakin ingin menghapus semua data keranjang dan checkout? 
                Tindakan ini tidak dapat dibatalkan.
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="grey"
                  variant="text"
                  @click="showClearCartDialog = false"
                >
                  Batal
                </v-btn>
                <v-btn
                  color="error"
                  variant="flat"
                  @click="clearCartAndCheckout"
                >
                  Hapus
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

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
                  <v-tab 
                    value="tab-2" 
                    :disabled="checkoutState.keranjangItems.length < 1 || !verifikasiStore.isEmailVerified"
                  >
                    <v-avatar size="24" color="primary" variant="tonal" class="me-2">2</v-avatar>
                    Informasi Pengiriman
                  </v-tab>
                  <v-tab 
                    value="tab-3" 
                    :disabled="checkoutState.keranjangItems.length < 1 || !verifikasiStore.isEmailVerified"
                  >
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
                      @next="handleProceedToCheckout"
                    />
                  </v-col>
                  <v-col md="4" cols="12">
                    <OrderSummary :checkout-state="checkoutState" />
                    <v-btn
                      color="primary"
                      class="mt-4"
                      block
                      rounded="md"
                      @click="handleProceedToCheckout"
                      :disabled="checkoutState.keranjangItems.length < 1"
                    >
                      Proses ke Checkout
                    </v-btn>
                    
                    <!-- Verification warning for unverified users -->
                    <v-alert
                      v-if="!verifikasiStore.isEmailVerified && isLoggedIn"
                      type="warning"
                      variant="tonal"
                      class="mt-3"
                      density="compact"
                    >
                      <template #text>
                        <small>Verifikasi email diperlukan untuk melanjutkan checkout</small>
                      </template>
                    </v-alert>
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
                      @click="handleProceedToPayment"
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
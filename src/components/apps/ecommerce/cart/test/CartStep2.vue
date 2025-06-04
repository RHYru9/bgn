<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { keranjangService } from '@/stores/apps/keranjang/KeranjangService';
import type { BankAdmin, BankUser, PaymentMethod } from '@/stores/apps/keranjang/KeranjangService';

const props = defineProps<{
  paymentMethod: PaymentMethod;
}>();

const emit = defineEmits<{
  (e: 'update-payment', method: PaymentMethod): void;
}>();

// State
const loading = ref(false);
const adminBanks = ref<BankAdmin[]>([]);
const userBanks = ref<BankUser[]>([]);
const selectedAdminBank = ref<BankAdmin | null>(null);
const selectedUserBank = ref<BankUser | null>(null);
const showAddBankDialog = ref(false);
const addingBank = ref(false);

// Form data
const newBank = ref({
  nama_rekening: '',
  bank_tipe: '',
  no_rekening: ''
});

// Constants
const bankTypes = [
  { text: 'BCA', value: 'bca' },
  { text: 'BNI', value: 'bni' },
  { text: 'BRI', value: 'bri' },
  { text: 'Mandiri', value: 'mandiri' },
  { text: 'BTN', value: 'btn' }
];

const ewalletTypes = [
  { text: 'DANA', value: 'dana' },
  { text: 'OVO', value: 'ovo' },
  { text: 'GoPay', value: 'gopay' }
];

const paymentMethods = [
  { text: 'Bayar di Tempat (COD)', value: 'cod' },
  { text: 'Transfer Bank', value: 'transfer_bank' },
  { text: 'Transfer E-Wallet', value: 'transfer_ewallet' }
];

// Computed
const availableTypes = computed(() => {
  if (props.paymentMethod.type === 'transfer_bank') {
    return bankTypes;
  } else if (props.paymentMethod.type === 'transfer_ewallet') {
    return ewalletTypes;
  }
  return [];
});

const filteredAdminBanks = computed(() => {
  if (props.paymentMethod.type === 'transfer_bank') {
    return adminBanks.value.filter(bank => 
      ['bca', 'bni', 'bri', 'mandiri', 'btn'].includes(bank.bank_tipe.toLowerCase())
    );
  } else if (props.paymentMethod.type === 'transfer_ewallet') {
    return adminBanks.value.filter(bank => 
      ['dana', 'ovo', 'gopay'].includes(bank.bank_tipe.toLowerCase())
    );
  }
  return [];
});

const filteredUserBanks = computed(() => {
  if (props.paymentMethod.type === 'transfer_bank') {
    return userBanks.value.filter(bank => 
      ['bca', 'bni', 'bri', 'mandiri', 'btn'].includes(bank.bank_tipe.toLowerCase())
    );
  } else if (props.paymentMethod.type === 'transfer_ewallet') {
    return userBanks.value.filter(bank => 
      ['dana', 'ovo', 'gopay'].includes(bank.bank_tipe.toLowerCase())
    );
  }
  return [];
});

// Watchers
watch(() => props.paymentMethod.type, (newVal) => {
  if (newVal === 'cod') {
    selectedAdminBank.value = null;
    selectedUserBank.value = null;
    emit('update-payment', {
      type: 'cod',
      bank_admin: null,
      bank_user: null
    });
  } else {
    // Reset selections when switching between bank and ewallet
    selectedAdminBank.value = null;
    selectedUserBank.value = null;
    
    // Update the payment method to clear previous bank selections
    const updatedMethod: PaymentMethod = {
      type: newVal,
      bank_admin: null,
      bank_user: null
    };
    emit('update-payment', updatedMethod);
  }
});

watch(selectedAdminBank, (newVal) => {
  if (newVal) {
    const updatedMethod: PaymentMethod = {
      ...props.paymentMethod,
      bank_admin: newVal
    };
    emit('update-payment', updatedMethod);
  }
});

watch(selectedUserBank, (newVal) => {
  if (newVal) {
    const updatedMethod: PaymentMethod = {
      ...props.paymentMethod,
      bank_user: newVal
    };
    emit('update-payment', updatedMethod);
  }
});

// Methods
async function loadBanks() {
  try {
    loading.value = true;
    const [adminResponse, userResponse] = await Promise.all([
      keranjangService.getAdminBanks(),
      keranjangService.getMyBanks()
    ]);
    
    adminBanks.value = adminResponse;
    userBanks.value = userResponse;
    
    // Set initial selections if they exist
    if (props.paymentMethod.bank_admin) {
      selectedAdminBank.value = adminBanks.value.find(
        bank => bank.no_rekening === props.paymentMethod.bank_admin?.no_rekening
      ) || null;
    }
    
    if (props.paymentMethod.bank_user) {
      selectedUserBank.value = userBanks.value.find(
        bank => bank.id === props.paymentMethod.bank_user?.id
      ) || null;
    }
  } catch (error) {
    console.error('Gagal memuat data bank:', error);
  } finally {
    loading.value = false;
  }
}

async function addBank() {
  try {
    addingBank.value = true;
    const response = await keranjangService.addBankUser(newBank.value);
    
    userBanks.value.push(response.data);
    selectedUserBank.value = response.data;
    showAddBankDialog.value = false;
    resetBankForm();
  } catch (error) {
    console.error('Gagal menambahkan bank:', error);
  } finally {
    addingBank.value = false;
  }
}

function resetBankForm() {
  newBank.value = {
    nama_rekening: '',
    bank_tipe: '',
    no_rekening: ''
  };
}

function getPaymentTypeLabel() {
  if (props.paymentMethod.type === 'transfer_bank') {
    return 'Bank';
  } else if (props.paymentMethod.type === 'transfer_ewallet') {
    return 'E-Wallet';
  }
  return '';
}

// Lifecycle
onMounted(() => {
  loadBanks();
});
</script>

<template>
  <v-card class="payment-method-card">
    <v-card-title class="text-h6 font-weight-bold">
      Metode Pembayaran
    </v-card-title>
    
    <v-card-text>
      <!-- Payment Method Selection -->
      <v-radio-group 
        :model-value="paymentMethod.type" 
        class="payment-method-options"
        @update:modelValue="(val) => emit('update-payment', {...paymentMethod, type: val})"
      >
        <v-radio
          v-for="method in paymentMethods"
          :key="method.value"
          :label="method.text"
          :value="method.value"
          color="primary"
        />
      </v-radio-group>

      <!-- Bank Selection (for non-COD methods) -->
      <template v-if="paymentMethod.type !== 'cod'">
        <!-- Admin Bank Selection -->
        <v-card outlined class="bank-selection-card mb-4">
          <v-card-title class="text-subtitle-1 font-weight-bold">
            {{ getPaymentTypeLabel() }} Admin
          </v-card-title>
          
          <v-card-text>
            <v-select
              v-model="selectedAdminBank"
              :items="filteredAdminBanks"
              item-title="nama_rekening"
              item-value="no_rekening"
              :label="`Pilih ${getPaymentTypeLabel()} Admin`"
              return-object
              :rules="[v => !!v || `${getPaymentTypeLabel()} admin harus dipilih`]"
              variant="outlined"
              density="comfortable"
            />
            
            <v-card 
              v-if="selectedAdminBank" 
              outlined 
              class="bank-detail-card mt-3 pa-3"
            >
              <div class="bank-detail-item">
                <strong>Nama:</strong> {{ selectedAdminBank.nama_rekening }}
              </div>
              <div class="bank-detail-item">
                <strong>{{ getPaymentTypeLabel() }}:</strong> {{ selectedAdminBank.bank_tipe.toUpperCase() }}
              </div>
              <div class="bank-detail-item">
                <strong>No. Rekening:</strong> {{ selectedAdminBank.no_rekening }}
              </div>
            </v-card>
          </v-card-text>
        </v-card>

        <!-- User Bank Selection -->
        <v-card outlined class="bank-selection-card">
          <v-card-title class="text-subtitle-1 font-weight-bold">
            {{ getPaymentTypeLabel() }} Saya
          </v-card-title>
          
          <v-card-text>
            <v-select
              v-model="selectedUserBank"
              :items="filteredUserBanks"
              item-title="nama_rekening"
              item-value="id"
              :label="`Pilih ${getPaymentTypeLabel()} Anda`"
              return-object
              :rules="[v => !!v || `${getPaymentTypeLabel()} anda harus dipilih`]"
              variant="outlined"
              density="comfortable"
            />
            
            <v-btn 
              color="primary" 
              variant="text" 
              class="mt-2"
              @click="showAddBankDialog = true"
            >
              <v-icon left>mdi-plus</v-icon>
              Tambah {{ getPaymentTypeLabel() }} Baru
            </v-btn>
            
            <v-card 
              v-if="selectedUserBank" 
              outlined 
              class="bank-detail-card mt-3 pa-3"
            >
              <div class="bank-detail-item">
                <strong>Nama:</strong> {{ selectedUserBank.nama_rekening }}
              </div>
              <div class="bank-detail-item">
                <strong>{{ getPaymentTypeLabel() }}:</strong> {{ selectedUserBank.bank_tipe.toUpperCase() }}
              </div>
              <div class="bank-detail-item">
                <strong>No. Rekening:</strong> {{ selectedUserBank.no_rekening }}
              </div>
            </v-card>
          </v-card-text>
        </v-card>
      </template>
    </v-card-text>

    <!-- Add Bank Dialog -->
    <v-dialog v-model="showAddBankDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          Tambah {{ getPaymentTypeLabel() }} Baru
        </v-card-title>
        
        <v-card-text>
          <v-form @submit.prevent="addBank">
            <v-text-field
              v-model="newBank.nama_rekening"
              label="Nama Pemilik Rekening"
              required
              :rules="[v => !!v || 'Nama harus diisi']"
              variant="outlined"
              class="mb-3"
            />
            
            <v-select
              v-model="newBank.bank_tipe"
              :items="availableTypes"
              :label="`Jenis ${getPaymentTypeLabel()}`"
              required
              :rules="[v => !!v || `Jenis ${getPaymentTypeLabel().toLowerCase()} harus dipilih`]"
              variant="outlined"
              class="mb-3"
            />
            
            <v-text-field
              v-model="newBank.no_rekening"
              :label="`Nomor ${paymentMethod.type === 'transfer_ewallet' ? 'HP/ID' : 'Rekening'}`"
              required
              :rules="[v => !!v || `Nomor ${paymentMethod.type === 'transfer_ewallet' ? 'HP/ID' : 'rekening'} harus diisi`]"
              variant="outlined"
            />
          </v-form>
        </v-card-text>
        
        <v-card-actions class="px-4 pb-4">
          <v-spacer />
          <v-btn 
            variant="text" 
            @click="showAddBankDialog = false"
          >
            Batal
          </v-btn>
          <v-btn 
            color="primary" 
            @click="addBank"
            :loading="addingBank"
          >
            Simpan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<style scoped>
.payment-method-card {
  border-radius: 8px;
}

.payment-method-options {
  margin-bottom: 16px;
}

.bank-selection-card {
  border-radius: 8px;
}

.bank-detail-card {
  border-radius: 6px;
  background-color: #272c7f;
}

.bank-detail-item {
  margin-bottom: 4px;
}

.bank-detail-item:last-child {
  margin-bottom: 0;
}
</style>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { keranjangService } from '@/stores/apps/keranjang/KeranjangService';
import type { 
  CheckoutState, 
  BankUser, 
  BankAdmin,
  PaymentMethod
} from '@/stores/apps/keranjang/KeranjangService';
import { BankType } from '@/stores/apps/keranjang/KeranjangService';

const props = defineProps<{
  checkoutState: CheckoutState;
}>();

const emit = defineEmits<{
  (e: 'complete', data: { buktiTransfer: File | null; catatan: string }): void;
  (e: 'back'): void;
  (e: 'update-payment', paymentMethod: PaymentMethod): void;
}>();

const loading = ref(false);
const loadingBanks = ref(false);
const catatanPembeli = ref('');
const buktiTransfer = ref<File | null>(null);

const myBanks = ref<BankUser[]>([]);
const adminBanks = ref<BankAdmin[]>([]);
const selectedBankUser = ref<BankUser | null>(null);
const selectedBankAdmin = ref<BankAdmin | null>(null);

const showBankDialog = ref(false);
const showAddBankDialog = ref(false);

const newBankForm = ref({
  nama_rekening: '',
  bank_tipe: '',
  no_rekening: ''
});

const BANK_TYPES = [BankType.BCA, BankType.BNI, BankType.BRI, BankType.MANDIRI, BankType.BTN] as const;
const E_WALLET_TYPES = [BankType.DANA, BankType.OVO, BankType.GOPAY] as const;

const bankTypes = computed(() => {
  return BANK_TYPES.map(type => ({
    value: type,
    text: type.toUpperCase()
  }));
});

const ewalletTypes = computed(() => {
  return E_WALLET_TYPES.map(type => ({
    value: type,
    text: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
  }));
});

const availableBankTypes = computed(() => {
  if (props.checkoutState.paymentMethod.type === 'transfer_bank') return bankTypes.value;
  if (props.checkoutState.paymentMethod.type === 'transfer_ewallet') return ewalletTypes.value;
  return [];
});

const isFormValid = computed(() => {
  if (props.checkoutState.paymentMethod.type === 'cod') return true;
  return !!selectedBankUser.value && !!selectedBankAdmin.value && !!buktiTransfer.value;
});

const needsBankSelection = computed(() => 
  ['transfer_bank', 'transfer_ewallet'].includes(props.checkoutState.paymentMethod.type)
);

const needsProofUpload = computed(() => needsBankSelection.value);

function formatPrice(price: number) {
  return keranjangService.formatPrice(price);
}

async function loadBankData() {
  if (!needsBankSelection.value) return;

  try {
    loadingBanks.value = true;
    const [myBanksResponse, adminBanksResponse] = await Promise.all([
      keranjangService.getMyBanks(),
      keranjangService.getAdminBanks()
    ]);

    myBanks.value = Array.isArray(myBanksResponse) ? myBanksResponse : [];
    adminBanks.value = Array.isArray(adminBanksResponse) ? adminBanksResponse : [];

    const filterFn = (bank: BankUser | BankAdmin) => {
      return props.checkoutState.paymentMethod.type === 'transfer_bank'
        ? BANK_TYPES.includes(bank.bank_tipe as BankType)
        : E_WALLET_TYPES.includes(bank.bank_tipe as BankType);
    };

    myBanks.value = myBanks.value.filter(filterFn);
    adminBanks.value = adminBanks.value.filter(filterFn);

    if (props.checkoutState.paymentMethod.bank_user) {
      selectedBankUser.value = myBanks.value.find(
        bank => bank.id === (props.checkoutState.paymentMethod.bank_user as BankUser)?.id
      ) || null;
    }

    if (props.checkoutState.paymentMethod.bank_admin) {
      selectedBankAdmin.value = adminBanks.value.find(
        bank => bank.no_rekening === (props.checkoutState.paymentMethod.bank_admin as BankAdmin)?.no_rekening
      ) || null;
    }
  } catch (error) {
    alert('Gagal memuat data bank. Silakan coba lagi.');
    console.error(error);
  } finally {
    loadingBanks.value = false;
  }
}

async function addNewBank() {
  if (!newBankForm.value.nama_rekening || !newBankForm.value.bank_tipe || !newBankForm.value.no_rekening) {
    alert('Semua field harus diisi');
    return;
  }

  try {
    loading.value = true;
    const response = await keranjangService.addBankUser(newBankForm.value);

    if (response.data) {
      await loadBankData();
      newBankForm.value = { nama_rekening: '', bank_tipe: '', no_rekening: '' };
      showAddBankDialog.value = false;
    } else {
      alert(response.error || 'Gagal menambah bank');
    }
  } catch (error) {
    alert('Terjadi kesalahan saat menambah bank');
    console.error(error);
  } finally {
    loading.value = false;
  }
}

function selectBanks() {
  if (!selectedBankUser.value || !selectedBankAdmin.value) {
    alert('Pilih bank pengirim dan penerima');
    return;
  }

  emit('update-payment', {
    ...props.checkoutState.paymentMethod,
    bank_user: selectedBankUser.value,
    bank_admin: selectedBankAdmin.value
  });

  showBankDialog.value = false;
}

async function completeOrder() {
  try {
    loading.value = true;

    if (needsBankSelection.value) {
      if (!selectedBankUser.value || !selectedBankAdmin.value) {
        alert('Pilih bank pengirim dan penerima terlebih dahulu');
        return;
      }

      if (!buktiTransfer.value) {
        alert('Upload bukti transfer terlebih dahulu');
        return;
      }
    }

    emit('complete', {
      buktiTransfer: needsProofUpload.value ? buktiTransfer.value : null,
      catatan: catatanPembeli.value
    });

  } finally {
    loading.value = false;
  }
}

function openBankSelection() {
  showBankDialog.value = true;
  loadBankData();
}

onMounted(() => {
  catatanPembeli.value = props.checkoutState.catatanPembeli || '';
  if (needsBankSelection.value) loadBankData();
});
</script>

<template>
  <v-card>
    <v-card-title>Konfirmasi Pesanan</v-card-title>
    <v-card-text>
      <!-- Items List -->
      <v-list>
        <v-list-item
          v-for="item in checkoutState.keranjangItems"
          :key="item.id"
        >
          <v-list-item-avatar>
            <v-img :src="item.barang.gambar_barang" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ item.barang.nama_barang }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ item.jumlah }} x {{ formatPrice(parseFloat(item.barang.harga_jual)) }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <div class="text-right">
              {{ formatPrice(item.jumlah * parseFloat(item.barang.harga_jual)) }}
            </div>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-divider class="my-4" />

      <!-- Shipping Address -->
      <v-card outlined class="pa-4 mb-4">
        <v-card-title>Alamat Pengiriman</v-card-title>
        <div><strong>Nama:</strong> {{ checkoutState.alamatPengiriman.nama }}</div>
        <div><strong>No. HP:</strong> {{ checkoutState.alamatPengiriman.no_hp }}</div>
        <div><strong>Email:</strong> {{ checkoutState.alamatPengiriman.email }}</div>
        <div><strong>Alamat:</strong> {{ checkoutState.alamatPengiriman.alamat }}</div>
        <div><strong>Kode Pos:</strong> {{ checkoutState.alamatPengiriman.kode_pos }}</div>
      </v-card>

      <!-- Payment Method -->
      <v-card outlined class="pa-4 mb-4">
        <v-card-title>Metode Pembayaran</v-card-title>
        
        <div v-if="checkoutState.paymentMethod.type === 'cod'">
          <strong>Metode:</strong> Bayar di Tempat (COD)
          <div class="mt-2 text-caption text-grey">
            Anda akan membayar ketika pesanan diterima
          </div>
        </div>
        
        <template v-else>
          <div>
            <strong>Metode:</strong>
            {{ checkoutState.paymentMethod.type === 'transfer_bank' ? 'Transfer Bank' : 'Transfer E-Wallet' }}
          </div>

          <!-- Bank Selection Section -->
          <div class="mt-3">
            <v-btn 
              color="primary" 
              outlined 
              @click="openBankSelection"
              :loading="loadingBanks"
            >
              <v-icon left>mdi-bank</v-icon>
              {{ selectedBankUser && selectedBankAdmin ? 'Ubah Bank' : 'Pilih Bank' }}
            </v-btn>

            <!-- Selected Banks Display -->
            <div v-if="selectedBankUser && selectedBankAdmin" class="mt-3">
              <v-card outlined class="pa-3">
                <div class="mb-2">
                  <strong>{{ checkoutState.paymentMethod.type === 'transfer_bank' ? 'Bank' : 'E-Wallet' }} Pengirim (Saya):</strong><br>
                  {{ selectedBankUser.nama_rekening }}<br>
                  {{ selectedBankUser.bank_tipe.toUpperCase() }} - {{ selectedBankUser.no_rekening }}
                </div>
                <v-divider class="my-2" />
                <div>
                  <strong>{{ checkoutState.paymentMethod.type === 'transfer_bank' ? 'Bank' : 'E-Wallet' }} Penerima (Admin):</strong><br>
                  {{ selectedBankAdmin.nama_rekening }}<br>
                  {{ selectedBankAdmin.bank_tipe.toUpperCase() }} - {{ selectedBankAdmin.no_rekening }}
                </div>
              </v-card>
            </div>
          </div>
        </template>
      </v-card>

      <!-- Notes -->
      <v-textarea
        v-model="catatanPembeli"
        label="Catatan Pembeli (Opsional)"
        outlined
      />

      <!-- Upload Bukti Transfer -->
      <template v-if="needsProofUpload">
        <v-card outlined class="pa-4 mb-4">
          <v-card-title>Upload Bukti Transfer</v-card-title>
          <v-file-input
            v-model="buktiTransfer"
            accept="image/*,.pdf"
            label="Upload Bukti Transfer"
            prepend-icon="mdi-camera"
            :rules="[
              v => !!v || 'Bukti transfer harus diupload',
              v => !v || v.size < 2000000 || 'Ukuran file maksimal 2MB',
              v => !v || ['image/jpeg', 'image/png', 'application/pdf'].includes(v.type) || 'Hanya file JPEG, PNG, atau PDF yang diterima'
            ]"
            required
          />
          <div class="text-caption text-grey">
            Unggah bukti transfer untuk verifikasi pembayaran
          </div>
        </v-card>
      </template>

      <v-divider class="my-4" />

      <!-- Total -->
      <div class="text-right">
        <h3>Total Pembayaran: {{ formatPrice(checkoutState.totalHarga) }}</h3>
      </div>

      <!-- Actions -->
      <v-card-actions>
        <v-btn text @click="$emit('back')">Kembali</v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          @click="completeOrder"
          :loading="loading"
          :disabled="!isFormValid"
        >
          Selesaikan Pesanan
        </v-btn>
      </v-card-actions>
    </v-card-text>

    <!-- Bank Selection Dialog -->
    <v-dialog v-model="showBankDialog" max-width="800px" persistent>
      <v-card>
        <v-card-title>
          Pilih {{ checkoutState.paymentMethod.type === 'transfer_bank' ? 'Bank' : 'E-Wallet' }} untuk Transfer
          <v-spacer />
          <v-btn icon @click="showBankDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text>
          <v-row>
            <!-- Bank Pengirim (User) -->
            <v-col cols="12" md="6">
              <div class="d-flex justify-space-between align-center mb-3">
                <h4>{{ checkoutState.paymentMethod.type === 'transfer_bank' ? 'Bank' : 'E-Wallet' }} Pengirim (Saya)</h4>
                <v-btn 
                  small 
                  color="primary" 
                  @click="showAddBankDialog = true"
                >
                  <v-icon small left>mdi-plus</v-icon>
                  Tambah
                </v-btn>
              </div>
              
              <v-radio-group v-model="selectedBankUser">
                <v-radio
                  v-for="bank in myBanks"
                  :key="bank.id"
                  :value="bank"
                >
                  <template v-slot:label>
                    <div>
                      <div class="font-weight-bold">{{ bank.nama_rekening }}</div>
                      <div class="text-caption">
                        {{ bank.bank_tipe.toUpperCase() }} - {{ bank.no_rekening }}
                      </div>
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>
              
              <div v-if="myBanks.length === 0" class="text-center text-grey">
                Belum ada {{ checkoutState.paymentMethod.type === 'transfer_bank' ? 'bank' : 'e-wallet' }} tersimpan
              </div>
            </v-col>

            <!-- Bank Penerima (Admin) -->
            <v-col cols="12" md="6">
              <h4 class="mb-3">{{ checkoutState.paymentMethod.type === 'transfer_bank' ? 'Bank' : 'E-Wallet' }} Penerima (Admin)</h4>
              
              <v-radio-group v-model="selectedBankAdmin">
                <v-radio
                  v-for="bank in adminBanks"
                  :key="bank.no_rekening"
                  :value="bank"
                >
                  <template v-slot:label>
                    <div>
                      <div class="font-weight-bold">{{ bank.nama_rekening }}</div>
                      <div class="text-caption">
                        {{ bank.bank_tipe.toUpperCase() }} - {{ bank.no_rekening }}
                      </div>
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>
              
              <div v-if="adminBanks.length === 0" class="text-center text-grey">
                Tidak ada {{ checkoutState.paymentMethod.type === 'transfer_bank' ? 'bank' : 'e-wallet' }} admin tersedia
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showBankDialog = false">Batal</v-btn>
          <v-btn 
            color="primary" 
            @click="selectBanks"
            :disabled="!selectedBankUser || !selectedBankAdmin"
          >
            Pilih {{ checkoutState.paymentMethod.type === 'transfer_bank' ? 'Bank' : 'E-Wallet' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add Bank Dialog -->
    <!-- Tambah Bank Dialog -->
  <v-dialog v-model="showAddBankDialog" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        Tambah {{ checkoutState.paymentMethod.type === 'transfer_bank' ? 'Bank' : 'E-Wallet' }}
        <v-spacer />
        <v-btn icon @click="showAddBankDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="newBankForm.nama_rekening" label="Nama Rekening" outlined required />
        <v-select
          v-model="newBankForm.bank_tipe"
          :items="availableBankTypes"
          label="Tipe"
          item-text="text"
          item-value="value"
          outlined
          required
        />
        <v-text-field v-model="newBankForm.no_rekening" label="No Rekening" outlined required />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="addNewBank" :loading="loading">Simpan</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </v-card>
</template>
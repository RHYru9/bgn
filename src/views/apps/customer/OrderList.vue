<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useCustomers } from '@/stores/apps/customers';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { Header, Item } from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

const page = ref({ title: 'Order List' });
const breadcrumbs = ref([
  { title: 'Customer', disabled: false, href: '#' },
  { title: 'Order List', disabled: true, href: '#' }
]);

const store = useCustomers();
onMounted(() => {
  store.fetchTransactions();
});

const items = computed(() => store.getTransactions);

const searchField = ref('user.nama');
const searchValue = ref('');
const themeColor = ref('rgb(var(--v-theme-primary))');
const { deleteTransaction, updateTransaction } = store;
const itemsSelected = ref<Item[]>([]);

// Dialog control
const editDialog = ref(false);
const selectedTransaction = ref<any>(null);

// Form state
const formData = reactive({
  status_pembayaran: '',
  status_pengiriman: '',
  tanggal_jatuh_tempo: '',
  alamat_pengiriman: '',
  kode_pos: '',
  catatan_pembeli: ''
});

// Status options
const statusPembayaranOptions = [
  { value: 'lunas', text: 'Lunas' },
  { value: 'belum_bayar', text: 'Belum Bayar' }
];

const jenisPengirimanOptions = [
  { value: 'dikirim', text: 'Dikirim' },
  { value: 'diambil_sendiri', text: 'Diambil Sendiri' }
];

const statusPengirimanOptions = [
  { value: 'pending', text: 'Pending' },
  { value: 'diproses', text: 'Diproses' },
  { value: 'dikirim', text: 'Dikirim' },
  { value: 'selesai', text: 'Selesai' },
  { value: 'batal', text: 'Batal' }
];

const headers: Header[] = [
  { text: 'ID', value: 'id', sortable: true },
  { text: 'Resi', value: 'kode_transaksi', sortable: true },
  { text: 'Nama Customer', value: 'user.nama', sortable: true },
  { text: 'Tanggal Pesanan', value: 'tanggal_pesanan', sortable: true },
  { text: 'Total Terbilang', value: 'total_harga', sortable: true },
  { text: 'Status Pembayaran', value: 'status_pembayaran', sortable: true },
  { text: 'Status Pengiriman', value: 'status_pengiriman', sortable: true },
  { text: 'Metode Pembayaran', value: 'metode_pembayaran', sortable: true },
  { text: 'Aksi', value: 'operation' }
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatCurrency = (value: string) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(parseFloat(value));
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'lunas':
      return 'success';
    case 'belum_bayar':
      return 'error';
    case 'diproses':
      return 'warning';
    default:
      return 'default';
  }
};

const getPengirimanStatusColor = (status: string) => {
  switch (status) {
    case 'dikirim':
    case 'selesai':
      return 'success';
    case 'pending':
      return 'default';
    case 'diproses':
      return 'warning';
    case 'batal':
      return 'error';
    default:
      return 'default';
  }
};

// Function to open edit dialog
const openEditDialog = async (id: number) => {
  try {
    // Fetch transaction details (Assuming you have a method in your store to get a single transaction)
    const transaction = await store.getTransactionById(id);
    selectedTransaction.value = transaction;
    
    // Initialize form with current values
    formData.status_pembayaran = transaction.status_pembayaran;
    formData.status_pengiriman = transaction.status_pengiriman;
    formData.tanggal_jatuh_tempo = transaction.tanggal_jatuh_tempo ? transaction.tanggal_jatuh_tempo.split('T')[0] : '';
    formData.alamat_pengiriman = transaction.alamat_pengiriman;
    formData.kode_pos = transaction.kode_pos;
    formData.catatan_pembeli = transaction.catatan_pembeli;
    
    // Show dialog
    editDialog.value = true;
  } catch (error) {
    console.error('Failed to fetch transaction details:', error);
  }
};

// Function to submit form
const submitForm = async () => {
  if (!selectedTransaction.value) return;
  
  try {
    await updateTransaction(selectedTransaction.value.id, formData);
    editDialog.value = false;
    // Refresh the transaction list after update
    store.fetchTransactions();
  } catch (error) {
    console.error('Failed to update transaction:', error);
  }
};
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />

  <v-row>
    <v-col cols="12">
      <v-card elevation="0" variant="outlined" class="bg-surface overflow-hidden">
        <v-card-item>
          <v-row justify="space-between" class="align-center">
            <v-col cols="12" md="3">
              <v-text-field
                type="text"
                variant="outlined"
                persistent-placeholder
                density="comfortable"
                placeholder="Search Order"
                v-model="searchValue"
                hide-details
              >
                <template #prepend-inner>
                  <SvgSprite
                    name="custom-search"
                    class="text-lightText"
                    style="width: 16px; height: 16px"
                  />
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <div class="d-flex ga-2 justify-end">
                <v-btn icon variant="text" aria-label="copy" rounded="md">
                  <SvgSprite name="custom-copy" style="width: 16px; height: 16px" />
                </v-btn>
                <v-btn icon variant="text" aria-label="print" rounded="md">
                  <SvgSprite name="custom-printer-outline" style="width: 16px; height: 16px" />
                </v-btn>
                <v-btn icon variant="text" aria-label="filter" rounded="md">
                  <SvgSprite name="custom-filter" style="width: 16px; height: 16px" />
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-item>

        <v-divider />

        <v-card-text class="pa-0">
          <EasyDataTable
            :headers="headers"
            :items="items"
            table-class-name="customize-table invoice-table"
            :theme-color="themeColor"
            :search-field="searchField"
            :search-value="searchValue"
            :rows-per-page="5"
            v-model:items-selected="itemsSelected"
          >
            <template #item-id="{ id }">
              <div class="player-wrapper">
                <h5 class="text-h5">#{{ id }}</h5>
              </div>
            </template>

            <template #item-tanggal_pesanan="{ tanggal_pesanan }">
              <div class="player-wrapper">
                {{ formatDate(tanggal_pesanan) }}
              </div>
            </template>

            <template #item-total_harga="{ total_harga }">
              <div class="player-wrapper">
                {{ formatCurrency(total_harga) }}
              </div>
            </template>

            <template #item-status_pembayaran="{ status_pembayaran }">
              <v-chip :color="getStatusColor(status_pembayaran)" size="small">
                {{ status_pembayaran.replace('_', ' ') }}
              </v-chip>
            </template>

            <template #item-status_pengiriman="{ status_pengiriman }">
              <v-chip :color="getPengirimanStatusColor(status_pengiriman)" size="small">
                {{ status_pengiriman }}
              </v-chip>
            </template>

            <template #item-operation="{ id }">
              <div class="operation-wrapper">
                <v-btn
                  icon
                  color="primary"
                  aria-label="edit"
                  variant="text"
                  rounded="md"
                  @click="openEditDialog(id)"
                >
                  <SvgSprite name="custom-edit" style="width: 18px; height: 18px" />
                </v-btn>
                <v-btn
                  icon
                  color="error"
                  aria-label="delete"
                  variant="text"
                  rounded="md"
                  @click="deleteTransaction(id)"
                >
                  <SvgSprite name="custom-trash" style="width: 18px; height: 18px" />
                </v-btn>
              </div>
            </template>
          </EasyDataTable>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <!-- Edit Dialog -->
  <v-dialog v-model="editDialog" max-width="700px">
    <v-card>
      <v-card-title class="text-h5 pb-2 pt-4 px-4">
        Edit Order
        <span v-if="selectedTransaction" class="text-subtitle-1 ml-2">(ID: #{{ selectedTransaction.id }})</span>
      </v-card-title>
      
      <v-card-text class="px-4">
        <v-row>
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.status_pembayaran"
              :items="statusPembayaranOptions"
              item-title="text"
              item-value="value"
              label="Status Pembayaran"
              variant="outlined"
              density="comfortable"
            ></v-select>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.status_pengiriman"
              :items="statusPengirimanOptions"
              item-title="text"
              item-value="value"
              label="Status Pengiriman"
              variant="outlined"
              density="comfortable"
            ></v-select>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.tanggal_jatuh_tempo"
              label="Tanggal Jatuh Tempo"
              type="date"
              variant="outlined"
              density="comfortable"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.kode_pos"
              label="Kode Pos"
              variant="outlined"
              density="comfortable"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12">
            <v-textarea
              v-model="formData.alamat_pengiriman"
              label="Alamat Pengiriman"
              variant="outlined"
              density="comfortable"
              rows="2"
            ></v-textarea>
          </v-col>
          
          <v-col cols="12">
            <v-textarea
              v-model="formData.catatan_pembeli"
              label="Catatan Pembeli"
              variant="outlined"
              density="comfortable"
              rows="2"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      
      <v-card-actions class="px-4 pb-4">
        <v-spacer></v-spacer>
        <v-btn color="error" variant="outlined" @click="editDialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="submitForm">Update</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useCustomers } from '@/stores/apps/customers';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import PrintInvoice from '@/views/apps/user/transaksi/invoice/Dashboard/PrintInvoice.vue';
import type { Header } from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
// Import html2pdf
import html2pdf from 'html2pdf.js';

interface Transaction {
  id: number;
  kode_transaksi: string;
  user: {
    nama: string;
    email?: string;
    no_hp?: string;
  };
  tanggal_pesanan: string;
  total_harga: string;
  status_pembayaran: string;
  status_pengiriman: string;
  metode_pembayaran: string;
  tanggal_jatuh_tempo?: string;
  alamat_pengiriman?: string;
  kode_pos?: string;
  catatan_pembeli?: string;
  jenis_pengiriman?: string;
  items?: Array<{
    id: number;
    nama_produk: string;
    quantity: number;
    harga: string;
    subtotal: string;
  }>;
}

const page = ref({ title: 'Transaksi Saya' });
const breadcrumbs = ref([
  { title: 'Akun', disabled: false, href: '#' },
  { title: 'Transaksi Saya', disabled: true, href: '#' }
]);

const store = useCustomers();
onMounted(() => {
  store.fetchTransactions();
});

const items = computed(() => store.getTransactions);

const searchField = ref('user.nama');
const searchValue = ref('');
const themeColor = ref('rgb(var(--v-theme-primary))');

// Dialog control
const viewDialog = ref(false);
const printDialog = ref(false);
const selectedTransaction = ref<Transaction | null>(null);

// Loading states
const loading = ref(false);
const isPrinting = ref(false);
const isGeneratingPDF = ref(false);

// Reference to PrintInvoice component
const printInvoiceRef = ref(null);

const headers: Header[] = [
  { text: 'ID', value: 'id', sortable: true },
  { text: 'Barang', value: 'barang.nama_barang', sortable: true },
  { text: 'Resi', value: 'kode_transaksi', sortable: true },
  { text: 'Tanggal Pesanan', value: 'tanggal_pesanan', sortable: true },
  { text: 'Total Terbilang', value: 'total_harga', sortable: true },
  { text: 'Status Pembayaran', value: 'status_pembayaran', sortable: true },
  { text: 'Status Pengiriman', value: 'status_pengiriman', sortable: true },
  { text: 'Metode Pembayaran', value: 'metode_pembayaran', sortable: true },
  { text: 'Barang', value: 'jumlah', sortable: true },
  { text: 'Aksi', value: 'operation' }
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
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

const openViewDialog = async (id: number) => {
  try {
    loading.value = true;
    const transaction = await store.getTransactionById(id);
    selectedTransaction.value = transaction;
    viewDialog.value = true;
  } catch (error) {
    console.error('Gagal memuat detail transaksi:', error);
  } finally {
    loading.value = false;
  }
};

const openPrintDialog = async (id: number) => {
  try {
    loading.value = true;
    const transaction = await store.getTransactionById(id);
    selectedTransaction.value = transaction;
    printDialog.value = true;
  } catch (error) {
    console.error('Gagal memuat detail transaksi:', error);
  } finally {
    loading.value = false;
  }
};

const handlePrint = async () => {
  if (!selectedTransaction.value) return;
  
  try {
    isPrinting.value = true;
    await nextTick();
    
    const printContent = document.querySelector('.print-invoice-content');
    
    if (printContent) {
      // Create a clone of the print content
      const printClone = printContent.cloneNode(true) as HTMLElement;
      
      // Create print styles
      const printStyles = `
        <style>
          @page { size: auto; margin: 5mm; }
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .print-invoice-content { width: 100%; margin: 0; padding: 0; }
        </style>
      `;


      const printWindow = window.open('', '_blank');

      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Invoice - ${selectedTransaction.value.kode_transaksi}</title>
              ${printStyles}
            </head>
            <body onload="window.print(); window.close();">
              ${printClone.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {

        const printSection = document.createElement('div');
        printSection.innerHTML = printClone.innerHTML;
        document.body.appendChild(printSection);
        window.print();
        document.body.removeChild(printSection);
      }
    }

    printDialog.value = false;
  } catch (error) {
    console.error('Error during printing:', error);
    window.print();
  } finally {
    isPrinting.value = false;
  }
};

const handlePrintToPDF = async () => {
  if (!selectedTransaction.value) return;

  try {
    isGeneratingPDF.value = true;
    await nextTick();

    const printContent = document.querySelector('.print-invoice-content');
    
    if (printContent) {
      // PDF configuration options
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `Invoice-${selectedTransaction.value.kode_transaksi}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          letterRendering: true,
          logging: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      // Generate PDF
      await html2pdf().set(opt).from(printContent).save();
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
  } finally {
    isGeneratingPDF.value = false;
  }
};

const handlePrintAll = () => {
  window.print();
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
                placeholder="Cari Transaksi"
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
                <v-btn 
                  icon 
                  variant="text" 
                  aria-label="print-all" 
                  rounded="md" 
                  @click="handlePrintAll"
                  :disabled="isPrinting || isGeneratingPDF"
                >
                  <SvgSprite name="custom-printer-outline" style="width: 16px; height: 16px" />
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
              <div class="operation-wrapper d-flex ga-1">
                <v-btn
                  icon
                  color="secondary"
                  aria-label="view"
                  variant="text"
                  rounded="md"
                  @click="openViewDialog(id)"
                  :disabled="loading"
                >
                  <SvgSprite name="custom-eye" style="width: 18px; height: 18px" />
                </v-btn>
                <v-btn
                  icon
                  color="primary"
                  aria-label="print"
                  variant="text"
                  rounded="md"
                  @click="openPrintDialog(id)"
                  :disabled="loading"
                >
                  <SvgSprite name="custom-printer-outline" style="width: 18px; height: 18px" />
                </v-btn>
                <v-btn
                  icon
                  color="success"
                  aria-label="pdf"
                  variant="text"
                  rounded="md"
                  @click="openPrintDialog(id)"
                  :disabled="loading"
                >
                  <SvgSprite name="custom-file-pdf" style="width: 18px; height: 18px" />
                </v-btn>
              </div>
            </template>
          </EasyDataTable>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <!-- View Dialog -->
  <v-dialog v-model="viewDialog" max-width="800px">
    <v-card>
      <v-card-title class="text-h5 pb-2 pt-4 px-4">
        Detail Transaksi
        <span v-if="selectedTransaction" class="text-subtitle-1 ml-2">(ID: #{{ selectedTransaction.id }})</span>
      </v-card-title>
      
      <v-divider />
      
      <v-card-text v-if="selectedTransaction" class="px-4">
        <v-container>
          <v-row>
            <!-- Customer Information -->
            <v-col cols="12">
              <h6 class="text-h6 mb-3 text-primary">Informasi Customer</h6>
            </v-col>
            <v-col cols="12" md="6">
              <v-label class="text-subtitle-2 text-medium-emphasis">Email</v-label>
              <div class="text-subtitle-1 mb-3">{{ selectedTransaction.user?.email || 'N/A' }}</div>
            </v-col>
            <v-col cols="12" md="6">
              <v-label class="text-subtitle-2 text-medium-emphasis">No. HP</v-label>
              <div class="text-subtitle-1 mb-3">{{ selectedTransaction.user?.no_hp || 'N/A' }}</div>
            </v-col>
            <v-col cols="12" md="6">
              <v-label class="text-subtitle-2 text-medium-emphasis">Kode Pos</v-label>
              <div class="text-subtitle-1 mb-3">{{ selectedTransaction.kode_pos || 'N/A' }}</div>
            </v-col>
            <v-col cols="12">
              <v-label class="text-subtitle-2 text-medium-emphasis">Alamat Pengiriman</v-label>
              <div class="text-subtitle-1 mb-3">{{ selectedTransaction.alamat_pengiriman || 'N/A' }}</div>
            </v-col>

            <!-- Transaction Information -->
            <v-col cols="12">
              <v-divider class="my-4" />
              <h6 class="text-h6 mb-3 text-primary">Informasi Transaksi</h6>
            </v-col>
            <v-col cols="12" md="6">
              <v-label class="text-subtitle-2 text-medium-emphasis">Kode Transaksi</v-label>
              <div class="text-subtitle-1 mb-3">{{ selectedTransaction.kode_transaksi }}</div>
            </v-col>
            <v-col cols="12" md="6">
              <v-label class="text-subtitle-2 text-medium-emphasis">Tanggal Pesanan</v-label>
              <div class="text-subtitle-1 mb-3">{{ formatDate(selectedTransaction.tanggal_pesanan) }}</div>
            </v-col>
            <v-col cols="12" md="6">
              <v-label class="text-subtitle-2 text-medium-emphasis">Total Harga</v-label>
              <div class="text-subtitle-1 mb-3 text-success font-weight-bold">{{ formatCurrency(selectedTransaction.total_harga) }}</div>
            </v-col>
            <v-col cols="12" md="6">
              <v-label class="text-subtitle-2 text-medium-emphasis">Metode Pembayaran</v-label>
              <div class="text-subtitle-1 mb-3">{{ selectedTransaction.metode_pembayaran }}</div>
            </v-col>
            <v-col cols="12" md="6">
              <v-label class="text-subtitle-2 text-medium-emphasis">Status Pembayaran</v-label>
              <div class="mb-3">
                <v-chip :color="getStatusColor(selectedTransaction.status_pembayaran)" size="small">
                  {{ selectedTransaction.status_pembayaran.replace('_', ' ') }}
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <v-label class="text-subtitle-2 text-medium-emphasis">Status Pengiriman</v-label>
              <div class="mb-3">
                <v-chip :color="getPengirimanStatusColor(selectedTransaction.status_pengiriman)" size="small">
                  {{ selectedTransaction.status_pengiriman }}
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <v-label class="text-subtitle-2 text-medium-emphasis">Tanggal Jatuh Tempo</v-label>
              <div class="text-subtitle-1 mb-3">
                {{ selectedTransaction.tanggal_jatuh_tempo ? formatDate(selectedTransaction.tanggal_jatuh_tempo) : 'N/A' }}
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <v-label class="text-subtitle-2 text-medium-emphasis">Jenis Pengiriman</v-label>
              <div class="text-subtitle-1 mb-3">{{ selectedTransaction.jenis_pengiriman || 'N/A' }}</div>
            </v-col>
            <v-col cols="12" v-if="selectedTransaction.catatan_pembeli">
              <v-label class="text-subtitle-2 text-medium-emphasis">Catatan Pembeli</v-label>
              <div class="text-subtitle-1 mb-3">{{ selectedTransaction.catatan_pembeli }}</div>
            </v-col>

            <!-- Order Items -->
            <v-col cols="12" v-if="selectedTransaction.items && selectedTransaction.items.length > 0">
              <v-divider class="my-4" />
              <h6 class="text-h6 mb-3 text-primary">Item Pesanan</h6>
              <v-table density="compact">
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th>Qty</th>
                    <th>Harga</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in selectedTransaction.items" :key="item.id">
                    <td>{{ item.nama_produk }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ formatCurrency(item.harga) }}</td>
                    <td>{{ formatCurrency(item.subtotal) }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      
      <v-divider />
      
      <v-card-actions class="px-4 pb-4">
        <v-btn 
          color="primary" 
          variant="outlined" 
          @click="openPrintDialog(selectedTransaction?.id || 0)"
          :disabled="!selectedTransaction"
        >
          Preview & Cetak
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn 
          color="grey" 
          variant="text" 
          @click="viewDialog = false"
        >
          Tutup
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Print Dialog -->
  <v-dialog v-model="printDialog" fullscreen transition="dialog-bottom-transition">
    <v-card v-if="printDialog" class="print-dialog-container">
      <v-toolbar color="primary" dark class="no-print">
        <v-btn icon @click="printDialog = false" size="large">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Preview Invoice</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          @click="handlePrint"
          :disabled="isPrinting || isGeneratingPDF"
          :loading="isPrinting"
          class="mr-2"
        >
          <v-icon left>mdi-printer</v-icon>
          Cetak
        </v-btn>
        <v-btn
          variant="outlined"
          color="success"
          @click="handlePrintToPDF"
          :disabled="isPrinting || isGeneratingPDF"
          :loading="isGeneratingPDF"
          class="mr-2"
        >
          <v-icon left>mdi-file-pdf-box</v-icon>
          Download PDF
        </v-btn>
        <v-btn
          variant="outlined"
          @click="printDialog = false"
          :disabled="isPrinting || isGeneratingPDF"
        >
          <v-icon left>mdi-close</v-icon>
          Tutup
        </v-btn>
      </v-toolbar>
      
      <v-card-text class="pa-0 print-content">
        <PrintInvoice 
          v-if="selectedTransaction"
          ref="printInvoiceRef"
          :transaction="selectedTransaction"
          class="print-invoice-content"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.print-dialog-container {
  background: white;
}

.print-content {
  background: white;
  min-height: calc(100vh - 64px);
}

@media print {
  body * {
    visibility: hidden;
  }
  .print-dialog-container, 
  .print-dialog-container * {
    visibility: visible;
  }
  .print-dialog-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    box-shadow: none;
  }
  .no-print {
    display: none !important;
  }
  .print-content {
    min-height: 100vh;
  }
}

.no-print {
  display: block;
}

@media screen {
  .print-dialog-container {
    max-height: 100vh;
    overflow-y: auto;
  }
}

.operation-wrapper {
  min-width: 120px;
}
</style>
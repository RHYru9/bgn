<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  transaction: {
    id: number;
    kode_transaksi: string;
    user: {
      nama: string;
      email?: string;
      no_hp?: string;
    };
    barang: {
      nama_barang: string;
      quantity?: number;
      harga?: string;
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
  };
}

const props = defineProps<Props>();

const emit = defineEmits(['close', 'print']);

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

const subtotal = computed(() => {
  return parseFloat(props.transaction.total_harga);
});

const shippingCost = computed(() => {
  return 0;
});

const tax = computed(() => {
  return 0;
});

const total = computed(() => {
  return subtotal.value + tax.value + shippingCost.value;
});
</script>

<template>
  <div class="invoice-container">
    <div class="invoice-content">
      <!-- Header -->
      <div class="invoice-header">
        <div class="company-info">
          <h1 class="invoice-title">INVOICE</h1>
          <div class="company-details">
            <p class="company-name">PT. BangunGo Indonesia Tld.</p>
            <p class="company-address">Jl Jatiwaringin BSI</p>
            <p class="company-address">Kota, Kode Pos</p>
            <p class="company-contact">Telp: (021) 12345678</p>
            <p class="company-contact">Email: info@bangungo.id</p>
          </div>
        </div>
        
        <div class="invoice-meta">
          <div class="invoice-number">
            <span class="label">Invoice #</span>
            <span class="value">{{ transaction.kode_transaksi }}</span>
          </div>
          <div class="invoice-date">
            <span class="label">Tanggal:</span>
            <span class="value">{{ formatDate(transaction.tanggal_pesanan) }}</span>
          </div>
          <div v-if="transaction.tanggal_jatuh_tempo" class="invoice-due">
            <span class="label">Jatuh Tempo:</span>
            <span class="value">{{ formatDate(transaction.tanggal_jatuh_tempo) }}</span>
          </div>
          <div class="status-payment">
            <span class="label">Status Pembayaran:</span>
            <v-chip :color="getStatusColor(transaction.status_pembayaran)" size="small" class="status-chip">
              {{ transaction.status_pembayaran.replace('_', ' ') }}
            </v-chip>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="section-divider"></div>
      
      <!-- Customer and shipping information -->
      <div class="info-section">
        <div class="billing-info">
          <h3 class="section-title">Tagihan Kepada</h3>
          <div class="info-content">
            <p class="customer-name">{{ transaction.user.nama }}</p>
            <p class="customer-detail">{{ transaction.user.email || 'Email tidak tersedia' }}</p>
            <p class="customer-detail">{{ transaction.user.no_hp || 'No. HP tidak tersedia' }}</p>
          </div>
        </div>
        
        <div class="shipping-info">
          <h3 class="section-title">Alamat Pengiriman</h3>
          <div class="info-content">
            <p class="shipping-address">{{ transaction.alamat_pengiriman || 'Alamat tidak tersedia' }}</p>
            <p class="shipping-detail">Kode Pos: {{ transaction.kode_pos || 'N/A' }}</p>
            <p class="shipping-detail">Jenis Pengiriman: {{ transaction.jenis_pengiriman || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="section-divider"></div>
      
      <!-- Order items table -->
      <div class="items-section">
        <h3 class="section-title">Detail Pemesanan</h3>
        <div class="items-table">
          <div class="table-header">
            <div class="col-no">No</div>
            <div class="col-product">Produk</div>
            <div class="col-price">Harga</div>
            <div class="col-qty">Qty</div>
            <div class="col-subtotal">Subtotal</div>
          </div>
          <div class="table-row">
            <div class="col-no">1</div>
            <div class="col-product">{{ transaction.barang.nama_barang }}</div>
            <div class="col-price">{{ transaction.barang.harga ? formatCurrency(transaction.barang.harga) : formatCurrency(transaction.total_harga) }}</div>
            <div class="col-qty">{{ transaction.barang.quantity || 1 }}</div>
            <div class="col-subtotal">{{ formatCurrency(transaction.total_harga) }}</div>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="section-divider"></div>
      
      <!-- Payment summary -->
      <div class="summary-section">
        <div class="summary-content">
          <div class="summary-row">
            <span class="summary-label">Subtotal</span>
            <span class="summary-value">{{ formatCurrency(transaction.total_harga) }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Biaya Pengiriman</span>
            <span class="summary-value">{{ formatCurrency('0') }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Pajak</span>
            <span class="summary-value">{{ formatCurrency('0') }}</span>
          </div>
          <div class="summary-row total-row">
            <span class="summary-label">Total</span>
            <span class="summary-value">{{ formatCurrency(transaction.total_harga) }}</span>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="section-divider"></div>
      
      <!-- Payment and notes -->
      <div class="footer-section">
        <div class="payment-info">
          <h3 class="section-title">Metode Pembayaran</h3>
          <div class="payment-content">
            <p class="payment-method">{{ transaction.metode_pembayaran }}</p>
            <div class="bank-details">
              <p class="bank-info">Rekening Bank:</p>
              <p class="bank-detail">Nama Bank: Bank BangunGo</p>
              <p class="bank-detail">No. Rekening: 1234567890</p>
              <p class="bank-detail">Atas Nama: PT. BangunGo International Tld</p>
            </div>
          </div>
        </div>
        
        <div class="notes-info">
          <h3 class="section-title">Catatan & Status</h3>
          <div class="notes-content">
            <p class="notes-text">{{ transaction.catatan_pembeli || 'Tidak ada catatan' }}</p>
            <div class="shipping-status">
              <span class="status-label">Status Pengiriman:</span>
              <v-chip :color="getPengirimanStatusColor(transaction.status_pengiriman)" size="small" class="status-chip">
                {{ transaction.status_pengiriman }}
              </v-chip>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Thank you message -->
      <div class="thank-you-section">
        <div class="thank-you-content">
          <p class="thank-you-text">Terima kasih atas pembelian Anda!</p>
          <div class="signature">
            <p class="signature-text">Hormat kami,</p>
            <p class="signature-name">PT BangunGO Tld</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Base Styles */
.invoice-container {
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 1rem;
  position: relative;
  overflow: visible;
}

.invoice-content {
  max-width: 210mm; /* A4 width */
  margin: 0 auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15mm;
  min-height: auto;
  height: auto;
}

/* Header */
.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.invoice-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
  letter-spacing: -0.025em;
}

.company-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.company-address,
.company-contact {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.125rem;
  line-height: 1.4;
}

.invoice-meta {
  text-align: right;
  min-width: 200px;
  flex-shrink: 0;
}

.invoice-number,
.invoice-date,
.invoice-due,
.status-payment {
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  margin-right: 0.5rem;
}

.value {
  font-size: 0.75rem;
  color: #1e293b;
  font-weight: 600;
}

.status-chip {
  margin-left: 0.25rem;
  font-size: 0.625rem;
}

/* Divider */
.section-divider {
  height: 1px;
  background: linear-gradient(to right, #e2e8f0, #cbd5e1, #e2e8f0);
  margin: 1rem 0;
  border-radius: 1px;
}

/* Info Section */
.info-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.75rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid #e2e8f0;
}

.customer-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.customer-detail,
.shipping-detail {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.25rem;
  line-height: 1.4;
  word-wrap: break-word;
}

.shipping-address {
  font-size: 0.8125rem;
  color: #1e293b;
  font-weight: 500;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  word-wrap: break-word;
}

/* Items Table */
.items-section {
  margin-bottom: 1rem;
}

.items-table {
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  overflow-x: auto;
}

.table-header {
  display: grid;
  grid-template-columns: 30px 1fr 100px 50px 100px;
  background-color: #f1f5f9;
  padding: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0;
  min-width: 400px;
}

.table-row {
  display: grid;
  grid-template-columns: 30px 1fr 100px 50px 100px;
  padding: 0.5rem;
  border-bottom: 1px solid #f1f5f9;
  min-width: 400px;
  font-size: 0.75rem;
}

.col-no {
  color: #64748b;
}

.col-product {
  color: #1e293b;
  font-weight: 500;
  word-wrap: break-word;
  min-width: 0;
}

.col-price,
.col-qty,
.col-subtotal {
  text-align: right;
  color: #1e293b;
  white-space: nowrap; /* Prevent line breaks in price */
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-subtotal {
  font-weight: 600;
}

/* Summary Section */
.summary-section {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.summary-content {
  min-width: 200px;
  max-width: 100%;
  background-color: #f8fafc;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0.125rem 0;
  flex-wrap: wrap;
  gap: 0.25rem;
  font-size: 0.75rem;
}

.summary-label {
  color: #64748b;
  font-weight: 500;
}

.summary-value {
  color: #1e293b;
  font-weight: 600;
}

.total-row {
  border-top: 1px solid #e2e8f0;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
}

.total-row .summary-label,
.total-row .summary-value {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #1e293b;
}

/* Footer Section */
.footer-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.payment-method {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.bank-info {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.bank-detail {
  font-size: 0.75rem;
  color: #1e293b;
  margin-bottom: 0.125rem;
  padding-left: 0.5rem;
}

.notes-text {
  font-size: 0.75rem;
  color: #1e293b;
  margin-bottom: 0.75rem;
  line-height: 1.4;
  word-wrap: break-word;
}

.shipping-status {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
  font-size: 0.75rem;
}

.status-label {
  color: #64748b;
  font-weight: 500;
  margin-right: 0.5rem;
}

/* Thank you section */
.thank-you-section {
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.thank-you-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.thank-you-text {
  font-size: 0.8125rem;
  color: #1e293b;
  font-weight: 500;
}

.signature-text {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.signature-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1e293b;
}

/* Print controls */
.print-controls {
  text-align: center;
  margin-top: 1rem;
  padding-bottom: 1rem;
}

.print-btn {
  margin-right: 0.5rem;
}

/* Print styles */
@media print {
  body, html {
    width: 100% !important;
    height: auto !important;
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    font-size: 10pt !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .invoice-container {
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    page-break-after: avoid;
    page-break-inside: avoid;
    background-color: white !important;
  }

  .invoice-content {
    width: 190mm !important;
    margin: 0 auto !important;
    padding: 10mm !important;
    box-shadow: none !important;
    break-inside: avoid;
    border-radius: 0 !important;
  }

  /* Adjust font sizes for print */
  .invoice-title {
    font-size: 16pt !important;
    margin-bottom: 6pt !important;
  }
  
  .company-name, .section-title {
    font-size: 10pt !important;
  }
  
  .company-address, .company-contact, 
  .customer-detail, .shipping-detail,
  .table-header, .table-row {
    font-size: 8pt !important;
  }

  /* Ensure tables don't break when printing */
  .items-table {
    page-break-inside: avoid;
    break-inside: avoid;
    min-width: 100% !important;
  }

  /* Adjust grid layout for printing */
  .table-header, .table-row {
    grid-template-columns: 20pt 1fr 60pt 30pt 60pt !important;
    font-size: 8pt !important;
    padding: 4pt !important;
  }

  /* Fix for status chips */
  .status-chip {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    display: inline-block;
    padding: 1pt 2pt;
    border-radius: 2pt;
    font-size: 7pt;
    line-height: 1.2;
  }

  /* Page margins */
  @page {
    size: A4;
    margin: 10mm;
  }

  /* Hide print button when printing */
  .no-print {
    display: none !important;
  }

  /* Force full width on sections */
  .info-section, .footer-section {
    grid-template-columns: 1fr 1fr !important;
    gap: 1rem !important;
  }

  /* Adjust spacing for print */
  .section-divider {
    margin: 0.75rem 0 !important;
  }

  /* Ensure colors print correctly */
  .summary-content, .thank-you-section {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    background-color: #f8f8f8 !important;
    border: 1px solid #ddd !important;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .invoice-container {
    padding: 0.5rem;
  }
  
  .invoice-content {
    padding: 1rem;
  }
  
  .invoice-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .invoice-meta {
    text-align: left;
    min-width: auto;
  }
  
  .info-section,
  .footer-section {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 25px 1fr 80px 40px 80px;
    font-size: 0.6875rem;
    padding: 0.5rem;
  }
  
  .summary-content {
    min-width: auto;
  }
  
  .thank-you-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .invoice-number,
  .invoice-date,
  .invoice-due,
  .status-payment {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.125rem;
  }
  
  .label {
    margin-right: 0;
  }
}

/* Additional scroll fixes */
html, body {
  overflow-x: auto;
  overflow-y: auto;
}
</style>
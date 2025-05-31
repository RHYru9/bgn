<script setup lang="ts">
import { ref, reactive } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const page = ref({ title: 'Buat Transaksi Baru' });
const breadcrumbs = ref([
  { title: 'Transaksi', disabled: false, href: '#' },
  { title: 'Buat Baru', disabled: true, href: '#' }
]);

// Notification state - Internal implementation
const notification = reactive({
  show: false,
  type: 'success' as 'success' | 'error' | 'warning' | 'info',
  message: '',
  timeout: 3000
});

// Function to show notification
const showNotification = (options: { type: 'success' | 'error' | 'warning' | 'info', message: string, timeout?: number }) => {
  notification.type = options.type;
  notification.message = options.message;
  notification.show = true;
  
  // Auto hide notification
  setTimeout(() => {
    notification.show = false;
  }, options.timeout || 3000);
};

// Function to hide notification
const hideNotification = () => {
  notification.show = false;
};

// Form state
const formData = reactive({
  user_id: '',
  tanggal_pesanan: '',
  total_harga: '',
  status_pembayaran: 'belum_bayar',
  status_pengiriman: 'pending',
  jenis_pengiriman: 'dikirim',
  metode_pembayaran: 'transfer',
  tanggal_jatuh_tempo: '',
  alamat_pengiriman: '',
  kode_pos: '',
  catatan_pembeli: ''
});

// Loading state
const loading = ref(false);

// Options for select fields
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

const metodePembayaranOptions = [
  { value: 'transfer', text: 'Transfer' },
  { value: 'qris', text: 'QRIS' },
  { value: 'tempo', text: 'Tempo' }
];

// Format currency for display
const formatCurrency = (value: string) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(parseFloat(value));
};

// Format datetime for API (convert datetime-local to MySQL datetime format)
const formatDateTimeForAPI = (datetimeLocal: string) => {
  if (!datetimeLocal) return '';
  
  // datetime-local format: 2025-05-18T14:30
  // API expects: 2025-05-18 14:30:00
  return datetimeLocal.replace('T', ' ') + ':00';
};

// Format date for API (convert date to MySQL date format)
const formatDateForAPI = (date: string) => {
  if (!date) return '';
  
  // date format: 2025-05-25
  // API expects: 2025-05-25
  return date;
};

// Validate form before submission
const validateForm = () => {
  const errors = [];
  
  if (!formData.user_id.trim()) {
    errors.push('ID Customer harus diisi');
  }
  
  if (!formData.tanggal_pesanan.trim()) {
    errors.push('Tanggal Pesanan harus diisi');
  }
  
  if (!formData.total_harga.trim()) {
    errors.push('Total Harga harus diisi');
  }
  
  if (!formData.alamat_pengiriman.trim()) {
    errors.push('Alamat Pengiriman harus diisi');
  }
  
  return errors;
};

// Submit form
const submitForm = async () => {
  try {
    loading.value = true;
    
    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      showNotification({
        type: 'error',
        message: validationErrors.join(', '),
        timeout: 5000
      });
      return;
    }
    
    // Prepare payload with proper formatting
    const payload = {
      user_id: parseInt(formData.user_id),
      tanggal_pesanan: formatDateTimeForAPI(formData.tanggal_pesanan),
      total_harga: parseFloat(formData.total_harga.replace(/[^0-9]/g, '')),
      status_pembayaran: formData.status_pembayaran,
      status_pengiriman: formData.status_pengiriman,
      jenis_pengiriman: formData.jenis_pengiriman,
      metode_pembayaran: formData.metode_pembayaran,
      tanggal_jatuh_tempo: formatDateForAPI(formData.tanggal_jatuh_tempo),
      alamat_pengiriman: formData.alamat_pengiriman,
      kode_pos: formData.kode_pos,
      catatan_pembeli: formData.catatan_pembeli
    };

    console.log('Payload being sent:', payload); // Debug log

    const response = await fetch('http://127.0.0.1:8000/api/transaksi', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      // Handle validation errors from server
      if (responseData.errors) {
        const errorMessages = Object.values(responseData.errors).flat();
        throw new Error(errorMessages.join(', '));
      } else {
        throw new Error(responseData.message || 'Gagal membuat transaksi');
      }
    }
    
    showNotification({
      type: 'success',
      message: 'Transaksi berhasil dibuat',
      timeout: 3000
    });

    // Reset form after successful submission
    resetForm();
    
    // Optionally redirect to transaction list
    router.push('/app/transaksi/list');

  } catch (error) {
    console.error('Error creating transaction:', error);
    showNotification({
      type: 'error',
      message: error.message || 'Gagal membuat transaksi',
      timeout: 5000
    });
  } finally {
    loading.value = false;
  }
};

// Reset form
const resetForm = () => {
  formData.user_id = '';
  formData.tanggal_pesanan = '';
  formData.total_harga = '';
  formData.status_pembayaran = 'belum_bayar';
  formData.status_pengiriman = 'pending';
  formData.jenis_pengiriman = 'dikirim';
  formData.metode_pembayaran = 'transfer';
  formData.tanggal_jatuh_tempo = '';
  formData.alamat_pengiriman = '';
  formData.kode_pos = '';
  formData.catatan_pembeli = '';
};

// Format currency input
const formatCurrencyInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value;
  
  // Remove non-numeric characters
  const numericValue = value.replace(/[^0-9]/g, '');
  
  if (numericValue === '') {
    formData.total_harga = '';
    return;
  }
  
  // Format as currency
  formData.total_harga = formatCurrency(numericValue);
};

// Get notification color based on type
const getNotificationColor = (type: string) => {
  switch (type) {
    case 'success': return 'success';
    case 'error': return 'error';
    case 'warning': return 'warning';
    case 'info': return 'info';
    default: return 'primary';
  }
};
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />

  <!-- Notification Component -->
  <v-snackbar
    v-model="notification.show"
    :color="getNotificationColor(notification.type)"
    :timeout="notification.timeout"
    location="top right"
    variant="elevated"
  >
    <div class="d-flex align-center">
      <SvgSprite 
        :name="notification.type === 'success' ? 'custom-check' : 
               notification.type === 'error' ? 'custom-alert' : 
               notification.type === 'warning' ? 'custom-warning' : 'custom-info'" 
        style="width: 20px; height: 20px" 
        class="mr-2" 
      />
      {{ notification.message }}
    </div>
    <template v-slot:actions>
      <v-btn
        variant="text"
        @click="hideNotification"
      >
        <SvgSprite name="custom-close" style="width: 18px; height: 18px" />
      </v-btn>
    </template>
  </v-snackbar>

  <v-row>
    <v-col cols="12">
      <v-card elevation="0" variant="outlined" class="bg-surface">
        <v-card-title class="text-h5 pb-2 pt-4 px-4">
          <SvgSprite name="custom-file-add" style="width: 24px; height: 24px" class="mr-2" />
          Form Transaksi Baru
        </v-card-title>
        
        <v-divider />
        
        <v-card-text class="px-4">
          <v-form @submit.prevent="submitForm">
            <v-row>
              <!-- Customer ID -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.user_id"
                  label="ID Customer *"
                  variant="outlined"
                  density="comfortable"
                  type="number"
                  required
                  :rules="[v => !!v || 'ID Customer harus diisi']"
                >
                  <template #prepend-inner>
                    <SvgSprite name="custom-user" style="width: 16px; height: 16px" class="text-lightText" />
                  </template>
                </v-text-field>
              </v-col>
              
              <!-- Order Date -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.tanggal_pesanan"
                  label="Tanggal Pesanan *"
                  type="datetime-local"
                  variant="outlined"
                  density="comfortable"
                  required
                  :rules="[v => !!v || 'Tanggal Pesanan harus diisi']"
                >
                  <template #prepend-inner>
                    <SvgSprite name="custom-calendar" style="width: 16px; height: 16px" class="text-lightText" />
                  </template>
                </v-text-field>
              </v-col>
              
              <!-- Total Price -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.total_harga"
                  label="Total Harga *"
                  variant="outlined"
                  density="comfortable"
                  @input="formatCurrencyInput"
                  required
                  :rules="[v => !!v || 'Total Harga harus diisi']"
                  placeholder="Rp 0"
                >
                  <template #prepend-inner>
                    <SvgSprite name="custom-money" style="width: 16px; height: 16px" class="text-lightText" />
                  </template>
                </v-text-field>
              </v-col>
              
              <!-- Due Date -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.tanggal_jatuh_tempo"
                  label="Tanggal Jatuh Tempo"
                  type="date"
                  variant="outlined"
                  density="comfortable"
                >
                  <template #prepend-inner>
                    <SvgSprite name="custom-clock" style="width: 16px; height: 16px" class="text-lightText" />
                  </template>
                </v-text-field>
              </v-col>
              
              <!-- Payment Status -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.status_pembayaran"
                  :items="statusPembayaranOptions"
                  item-title="text"
                  item-value="value"
                  label="Status Pembayaran"
                  variant="outlined"
                  density="comfortable"
                  required
                >
                  <template #prepend-inner>
                    <SvgSprite name="custom-wallet" style="width: 16px; height: 16px" class="text-lightText" />
                  </template>
                </v-select>
              </v-col>
              
              <!-- Shipping Status -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.status_pengiriman"
                  :items="statusPengirimanOptions"
                  item-title="text"
                  item-value="value"
                  label="Status Pengiriman"
                  variant="outlined"
                  density="comfortable"
                  required
                >
                  <template #prepend-inner>
                    <SvgSprite name="custom-truck" style="width: 16px; height: 16px" class="text-lightText" />
                  </template>
                </v-select>
              </v-col>
              
              <!-- Shipping Type -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.jenis_pengiriman"
                  :items="jenisPengirimanOptions"
                  item-title="text"
                  item-value="value"
                  label="Jenis Pengiriman"
                  variant="outlined"
                  density="comfortable"
                  required
                >
                  <template #prepend-inner>
                    <SvgSprite name="custom-shipping" style="width: 16px; height: 16px" class="text-lightText" />
                  </template>
                </v-select>
              </v-col>
              
              <!-- Payment Method -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.metode_pembayaran"
                  :items="metodePembayaranOptions"
                  item-title="text"
                  item-value="value"
                  label="Metode Pembayaran"
                  variant="outlined"
                  density="comfortable"
                  required
                >
                  <template #prepend-inner>
                    <SvgSprite name="custom-credit-card" style="width: 16px; height: 16px" class="text-lightText" />
                  </template>
                </v-select>
              </v-col>
              
              <!-- Postal Code -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.kode_pos"
                  label="Kode Pos"
                  variant="outlined"
                  density="comfortable"
                  type="number"
                >
                  <template #prepend-inner>
                    <SvgSprite name="custom-location" style="width: 16px; height: 16px" class="text-lightText" />
                  </template>
                </v-text-field>
              </v-col>
              
              <!-- Shipping Address -->
              <v-col cols="12">
                <v-textarea
                  v-model="formData.alamat_pengiriman"
                  label="Alamat Pengiriman *"
                  variant="outlined"
                  density="comfortable"
                  rows="2"
                  required
                  :rules="[v => !!v || 'Alamat Pengiriman harus diisi']"
                >
                  <template #prepend-inner>
                    <SvgSprite name="custom-home" style="width: 16px; height: 16px" class="text-lightText" />
                  </template>
                </v-textarea>
              </v-col>
              
              <!-- Customer Note -->
              <v-col cols="12">
                <v-textarea
                  v-model="formData.catatan_pembeli"
                  label="Catatan Pembeli"
                  variant="outlined"
                  density="comfortable"
                  rows="2"
                >
                  <template #prepend-inner>
                    <SvgSprite name="custom-note" style="width: 16px; height: 16px" class="text-lightText" />
                  </template>
                </v-textarea>
              </v-col>
              
              <!-- Form Actions -->
              <v-col cols="12">
                <div class="d-flex justify-end ga-4">
                  <v-btn
                    color="error"
                    variant="outlined"
                    @click="resetForm"
                    :disabled="loading"
                  >
                    <SvgSprite name="custom-refresh" style="width: 18px; height: 18px" class="mr-2" />
                    Reset
                  </v-btn>
                  <v-btn
                    color="primary"
                    type="submit"
                    :loading="loading"
                  >
                    <SvgSprite name="custom-save" style="width: 18px; height: 18px" class="mr-2" />
                    Simpan
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
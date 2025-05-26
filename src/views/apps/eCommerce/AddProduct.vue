<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Breadcrumb data
const page = ref({ title: 'Tambah Barang Baru' });
const breadcrumbs = ref([
  { title: 'Barang', disabled: false, href: '/ecommerce/productlist' },
  { title: 'Tambah', disabled: true, href: '#' }
]);

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isEditMode = ref(false);

// Form model - sesuaikan dengan API Laravel
const form = ref({
  kode_barang: '',
  nama_barang: '',
  merek: '',
  kategori_id: null as number | null,
  supplier_id: null as number | null,
  harga_beli: 0,
  harga_jual: 0,
  berat_barang: 0,
  satuan: '',
  stok: 0,
  stok_minimum: 0,
  deskripsi: '',
  gambar_barang: null as File | null,
});

// Form validation
const errors = ref<Record<string, string[]>>({});
const isLoading = ref(false);

// Dropdown options
const kategoriOptions = ref<Array<{ id: number; nama: string }>>([]);
const supplierOptions = ref<Array<{ id: number; nama: string; kategori: string; alamat: string }>>([]);
const satuanOptions = ref(['pcs', 'kg', 'gram', 'liter', 'meter', 'pack', 'dus', 'box', 'unit']);

// Gambar preview
const imagePreview = ref<string | null>(null);
const currentImageUrl = ref<string | null>(null); // Untuk menyimpan URL gambar existing

// Setup axios interceptor untuk Authorization header
const setupAxiosAuth = () => {
  if (authStore.token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`;
  }
};

// Fetch kategori dan supplier
const fetchInitialData = async () => {
  try {
    setupAxiosAuth();
    const [kategoriRes, supplierRes] = await Promise.all([
      axios.get('/api/kategori-barang'),
      axios.get('/api/suppliers')
    ]);
    
    // Pastikan struktur data sesuai dengan API response
    kategoriOptions.value = kategoriRes.data.data.map((item: any) => ({
      id: item.id,
      nama: item.nama || item.nama_kategori
    }));
    
    supplierOptions.value = supplierRes.data.data.map((item: any) => ({
      id: item.id,
      nama: item.nama,
      kategori: item.kategori,
      alamat: item.alamat
    }));
    
  } catch (error: any) {
    console.error('Gagal mengambil data:', error);
    if (error.response?.status === 401) {
      authStore.logout();
      router.push('/login');
    }
  }
};

// Load data untuk mode edit - sesuaikan dengan API lihat($id)
const fetchBarang = async (id: string) => {
  try {
    setupAxiosAuth();
    const res = await axios.get(`/api/barang/${id}`);
    const data = res.data.data;
    
    // Assign data sesuai dengan response API
    Object.assign(form.value, {
      kode_barang: data.kode_barang,
      nama_barang: data.nama_barang,
      merek: data.merek,
      kategori_id: data.kategori_id,
      supplier_id: data.supplier_id,
      harga_beli: Number(data.harga_beli),
      harga_jual: Number(data.harga_jual),
      berat_barang: Number(data.berat_barang),
      satuan: data.satuan,
      stok: Number(data.stok),
      stok_minimum: Number(data.stok_minimum),
      deskripsi: data.deskripsi || '',
      gambar_barang: null // Reset file input
    });
    
    // Set gambar existing jika ada
    if (data.gambar_barang) {
      currentImageUrl.value = `/storage/${data.gambar_barang}`;
      imagePreview.value = currentImageUrl.value;
    }
    
    isEditMode.value = true;
    page.value.title = 'Edit Barang';
    breadcrumbs.value[1].title = 'Edit';
  } catch (error: any) {
    console.error('Gagal memuat data barang:', error);
    if (error.response?.status === 404) {
      router.push('/ecommerce/productlist');
    } else if (error.response?.status === 401) {
      authStore.logout();
      router.push('/login');
    }
  }
};

onMounted(() => {
  fetchInitialData();
  if (route.params.id) {
    fetchBarang(route.params.id as string);
  }
});

// Handle file upload - Perbaikan untuk mendukung preview dan validasi
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  
  if (!files || files.length === 0) {
    return;
  }
  
  const file = files[0];
  
  // Validasi file
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
  const maxSize = 2048 * 1024; // 2MB
  
  if (!allowedTypes.includes(file.type)) {
    errors.value.gambar_barang = ['File harus berupa gambar (JPEG, PNG, JPG, GIF)'];
    target.value = ''; // Reset input
    return;
  }
  
  if (file.size > maxSize) {
    errors.value.gambar_barang = ['Ukuran file maksimal 2MB'];
    target.value = ''; // Reset input
    return;
  }
  
  // Clear previous errors
  if (errors.value.gambar_barang) {
    delete errors.value.gambar_barang;
  }
  
  form.value.gambar_barang = file;
  
  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

// Remove gambar - Reset semua state gambar
const removeImage = () => {
  form.value.gambar_barang = null;
  imagePreview.value = null;
  currentImageUrl.value = null;
  
  // Reset file input
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
};

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

// Validate form before submit
const validateForm = (): boolean => {
  const newErrors: Record<string, string[]> = {};
  
  if (!form.value.kode_barang.trim()) {
    newErrors.kode_barang = ['Kode barang wajib diisi'];
  }
  
  if (!form.value.nama_barang.trim()) {
    newErrors.nama_barang = ['Nama barang wajib diisi'];
  }
  
  if (!form.value.merek.trim()) {
    newErrors.merek = ['Merek wajib diisi'];
  }
  
  if (!form.value.kategori_id) {
    newErrors.kategori_id = ['Kategori wajib dipilih'];
  }
  
  if (!form.value.supplier_id) {
    newErrors.supplier_id = ['Supplier wajib dipilih'];
  }
  
  if (form.value.harga_beli <= 0) {
    newErrors.harga_beli = ['Harga beli harus lebih besar dari 0'];
  }
  
  if (form.value.harga_jual <= 0) {
    newErrors.harga_jual = ['Harga jual harus lebih besar dari 0'];
  }
  
  if (form.value.berat_barang <= 0) {
    newErrors.berat_barang = ['Berat barang harus lebih besar dari 0'];
  }
  
  if (!form.value.satuan.trim()) {
    newErrors.satuan = ['Satuan wajib dipilih'];
  }
  
  if (form.value.stok < 0) {
    newErrors.stok = ['Stok tidak boleh negatif'];
  }
  
  if (form.value.stok_minimum < 0) {
    newErrors.stok_minimum = ['Stok minimum tidak boleh negatif'];
  }
  
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

// Submit form - Perbaikan untuk method yang tepat
const handleSubmit = async () => {
  // Validate form
  if (!validateForm()) {
    return;
  }
  
  isLoading.value = true;
  errors.value = {};

  try {
    setupAxiosAuth();
    
    // Prepare FormData
    const formData = new FormData();
    
    // Append all form fields
    Object.entries(form.value).forEach(([key, value]) => {
      if (key === 'gambar_barang') {
        // Only append file if new file is selected
        if (value instanceof File) {
          formData.append(key, value);
        }
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    let response;
    
    if (isEditMode.value) {
      // Update existing barang - sesuai dengan method perbarui()
      response = await axios.post(`/api/barang/perbarui/${route.params.id}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authStore.token}`
        }
      });
    } else {
      // Create new barang - sesuai dengan method tambah()
      response = await axios.post('/api/barang', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authStore.token}`
        }
      });
    }

    // Handle success response
    if (response.data.success) {
      // Show success message (you can use toast/snackbar here)
      console.log(response.data.message);
      
      // Redirect to list page
      router.push('/ecommerce/productlist');
    } else {
      console.error('Response tidak sukses:', response.data);
    }
    
  } catch (error: any) {
    console.error('Error submitting form:', error);
    
    if (error.response?.status === 422) {
      // Validation errors dari Laravel
      errors.value = error.response.data.errors || {};
    } else if (error.response?.status === 401) {
      // Unauthorized
      authStore.logout();
      router.push('/login');
    } else if (error.response?.status === 404) {
      // Not found (untuk edit mode)
      console.error('Barang tidak ditemukan');
      router.push('/ecommerce/productlist');
    } else {
      // General error
      console.error('Terjadi kesalahan:', error.response?.data?.message || error.message);
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />

  <v-row>
    <v-col cols="12">
      <v-card variant="outlined" rounded="lg">
        <v-card-title class="pa-6 pb-0">
          <h5 class="text-h5">{{ isEditMode ? 'Edit Barang' : 'Form Tambah Barang' }}</h5>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form @submit.prevent="handleSubmit">
            <v-row>
              <!-- Kolom kiri -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.kode_barang"
                  label="Kode Barang *"
                  :error-messages="errors.kode_barang"
                  required
                  clearable
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  placeholder="Masukkan kode barang"
                />

                <v-text-field
                  v-model="form.nama_barang"
                  label="Nama Barang *"
                  :error-messages="errors.nama_barang"
                  required
                  clearable
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  placeholder="Masukkan nama barang"
                />

                <v-text-field
                  v-model="form.merek"
                  label="Merek *"
                  :error-messages="errors.merek"
                  required
                  clearable
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  placeholder="Masukkan merek barang"
                />

                <v-select
                  v-model="form.kategori_id"
                  label="Kategori *"
                  :items="kategoriOptions"
                  item-title="nama"
                  item-value="id"
                  :error-messages="errors.kategori_id"
                  required
                  clearable
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  placeholder="Pilih kategori"
                />

                <v-select
                  v-model="form.supplier_id"
                  label="Supplier *"
                  :items="supplierOptions"
                  item-title="nama"
                  item-value="id"
                  :error-messages="errors.supplier_id"
                  required
                  clearable
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  placeholder="Pilih supplier"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :title="item.raw.nama"
                      :subtitle="`${item.raw.kategori} - ${item.raw.alamat}`"
                    />
                  </template>
                </v-select>

                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model.number="form.harga_beli"
                      label="Harga Beli *"
                      type="number"
                      min="0"
                      step="1000"
                      :error-messages="errors.harga_beli"
                      required
                      variant="outlined"
                      density="comfortable"
                      class="mb-4"
                      placeholder="0"
                    >
                      <template #append-inner>
                        <span class="text-caption text-disabled">IDR</span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model.number="form.harga_jual"
                      label="Harga Jual *"
                      type="number"
                      min="0"
                      step="1000"
                      :error-messages="errors.harga_jual"
                      required
                      variant="outlined"
                      density="comfortable"
                      placeholder="0"
                    >
                      <template #append-inner>
                        <span class="text-caption text-disabled">IDR</span>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
                
                <!-- Display formatted currency -->
                <div class="text-caption text-grey mb-4">
                  <span>Harga Beli: {{ formatCurrency(form.harga_beli) }}</span>
                  <span class="mx-2">|</span>
                  <span>Harga Jual: {{ formatCurrency(form.harga_jual) }}</span>
                </div>
              </v-col>

              <!-- Kolom kanan -->
              <v-col cols="12" md="6">
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model.number="form.berat_barang"
                      label="Berat Barang *"
                      type="number"
                      min="0"
                      step="0.1"
                      :error-messages="errors.berat_barang"
                      required
                      variant="outlined"
                      density="comfortable"
                      class="mb-4"
                      placeholder="0"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      v-model="form.satuan"
                      label="Satuan *"
                      :items="satuanOptions"
                      :error-messages="errors.satuan"
                      required
                      variant="outlined"
                      density="comfortable"
                      class="mb-4"
                      placeholder="Pilih satuan"
                    />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model.number="form.stok"
                      label="Stok Awal *"
                      type="number"
                      min="0"
                      :error-messages="errors.stok"
                      required
                      variant="outlined"
                      density="comfortable"
                      class="mb-4"
                      placeholder="0"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model.number="form.stok_minimum"
                      label="Stok Minimum *"
                      type="number"
                      min="0"
                      :error-messages="errors.stok_minimum"
                      required
                      variant="outlined"
                      density="comfortable"
                      class="mb-4"
                      placeholder="0"
                    />
                  </v-col>
                </v-row>

                <v-textarea
                  v-model="form.deskripsi"
                  label="Deskripsi Barang"
                  rows="4"
                  no-resize
                  :error-messages="errors.deskripsi"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  placeholder="Masukkan deskripsi barang (opsional)"
                />

                <!-- Upload Gambar Section - Improved -->
                <div class="mb-4">
                  <v-label class="mb-2 font-weight-medium text-body-2">
                    Gambar Barang 
                    <span class="text-caption text-grey">(Opsional, Max: 2MB, Format: JPG, PNG, GIF)</span>
                  </v-label>
                  
                  <v-file-input
                    accept="image/jpeg,image/png,image/jpg,image/gif"
                    prepend-icon="mdi-camera"
                    @change="handleFileUpload"
                    :error-messages="errors.gambar_barang"
                    variant="outlined"
                    density="comfortable"
                    placeholder="Pilih file gambar..."
                    show-size
                    counter
                  >
                    <template #selection="{ fileNames }">
                      <template v-for="fileName in fileNames" :key="fileName">
                        <v-chip
                          color="primary"
                          size="small"
                          class="me-2"
                        >
                          {{ fileName }}
                        </v-chip>
                      </template>
                    </template>
                  </v-file-input>

                  <!-- Image Preview -->
                  <v-card
                    variant="outlined"
                    class="mt-4"
                    :class="{ 'pa-4': imagePreview }"
                  >
                    <div v-if="imagePreview" class="d-flex flex-column align-center">
                      <v-img
                        :src="imagePreview"
                        max-height="250"
                        max-width="300"
                        contain
                        class="mb-2 rounded"
                      />
                      <v-btn
                        color="error"
                        variant="tonal"
                        size="small"
                        @click="removeImage"
                        prepend-icon="mdi-delete"
                      >
                        Hapus Gambar
                      </v-btn>
                    </div>
                    <div v-else class="d-flex flex-column align-center pa-8 text-center">
                      <v-icon size="48" color="grey-lighten-1" class="mb-2">mdi-image-off</v-icon>
                      <span class="text-caption text-grey">Belum ada gambar yang diupload</span>
                    </div>
                  </v-card>
                </div>
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <!-- Action Buttons -->
            <div class="d-flex justify-end gap-2">
              <v-btn
                color="secondary"
                variant="outlined"
                :disabled="isLoading"
                to="/ecommerce/productlist"
                prepend-icon="mdi-arrow-left"
              >
                Batal
              </v-btn>
              <v-btn
                color="primary"
                variant="flat"
                type="submit"
                :loading="isLoading"
                :disabled="isLoading"
                prepend-icon="mdi-content-save"
              >
                {{ isEditMode ? 'Update Barang' : 'Simpan Barang' }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.gap-2 {
  gap: 8px;
}

/* Custom styles for better UX */
.v-field--error .v-field__outline {
  color: rgb(var(--v-theme-error)) !important;
}

.text-caption {
  font-size: 0.75rem !important;
}
</style>
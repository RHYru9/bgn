<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Breadcrumb data
const page = ref({ title: 'Tambah Barang Baru' });
const breadcrumbs = ref([
  { title: 'Barang', disabled: false, href: '/barang/list' },
  { title: 'Tambah', disabled: true, href: '#' }
]);

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isEditMode = ref(false);

// Form model
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
const satuanOptions = ref(['pcs', 'kg', 'gram', 'liter', 'meter', 'pack', 'dus']);

// Gambar preview
const imagePreview = ref<string | null>(null);

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
    }
  }
};

// Load data untuk mode edit
const fetchBarang = async (id: string) => {
  try {
    const res = await axios.get(`/api/barang/${id}`);
    const data = res.data.data;
    Object.assign(form.value, {
      kode_barang: data.kode_barang,
      nama_barang: data.nama_barang,
      merek: data.merek,
      kategori_id: data.kategori_id,
      supplier_id: data.supplier_id,
      harga_beli: data.harga_beli,
      harga_jual: data.harga_jual,
      berat_barang: data.berat_barang,
      satuan: data.satuan,
      stok: data.stok,
      stok_minimum: data.stok_minimum,
      deskripsi: data.deskripsi,
      gambar_barang: null
    });
    imagePreview.value = data.gambar_url || null;
    isEditMode.value = true;
    page.value.title = 'Edit Barang';
    breadcrumbs.value[1].title = 'Edit';
  } catch (error) {
    console.error('Gagal memuat data barang:', error);
  }
};

onMounted(() => {
  fetchInitialData();
  if (route.params.id) {
    fetchBarang(route.params.id as string);
  }
});

// Handle file upload
const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    form.value.gambar_barang = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

// Remove gambar
const removeImage = () => {
  form.value.gambar_barang = null;
  imagePreview.value = null;
};

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

// Submit form
const handleSubmit = async () => {
  errors.value = {};
  isLoading.value = true;

  try {
    setupAxiosAuth();
    const formData = new FormData();
    Object.entries(form.value).forEach(([key, val]) => {
      if (val !== null) {
        if (key === 'gambar_barang' && val instanceof File) {
          formData.append(key, val);
        } else {
          formData.append(key, val.toString());
        }
      }
    });

    let response;
    if (isEditMode.value) {
      response = await axios.post(`/api/barang/${route.params.id}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authStore.token}`
        }
      });
    } else {
      response = await axios.post('/api/barang', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authStore.token}`
        }
      });
    }

    if (response.data.success) {
      router.push('/barang/list');
    }
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors;
    } else if (error.response?.status === 401) {
      authStore.logout();
    } else {
      console.error('Error:', error);
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
                  label="Kode Barang"
                  :error-messages="errors.kode_barang"
                  required
                  clearable
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                />

                <v-text-field
                  v-model="form.nama_barang"
                  label="Nama Barang"
                  :error-messages="errors.nama_barang"
                  required
                  clearable
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                />

                <v-text-field
                  v-model="form.merek"
                  label="Merek"
                  :error-messages="errors.merek"
                  required
                  clearable
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                />

                <v-select
                  v-model="form.kategori_id"
                  label="Kategori"
                  :items="kategoriOptions"
                  item-title="nama"
                  item-value="id"
                  :error-messages="errors.kategori_id"
                  required
                  clearable
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                />

                <v-select
                  v-model="form.supplier_id"
                  label="Supplier"
                  :items="supplierOptions"
                  item-title="nama"
                  item-value="id"
                  :error-messages="errors.supplier_id"
                  required
                  clearable
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
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
                      v-model="form.harga_beli"
                      label="Harga Beli"
                      type="number"
                      :error-messages="errors.harga_beli"
                      required
                      variant="outlined"
                      density="comfortable"
                      class="mb-4"
                    >
                      <template #append>
                        <span class="text-caption text-disabled">{{ formatCurrency(form.harga_beli) }}</span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="form.harga_jual"
                      label="Harga Jual"
                      type="number"
                      :error-messages="errors.harga_jual"
                      required
                      variant="outlined"
                      density="comfortable"
                    >
                      <template #append>
                        <span class="text-caption text-disabled">{{ formatCurrency(form.harga_jual) }}</span>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-col>

              <!-- Kolom kanan -->
              <v-col cols="12" md="6">
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="form.berat_barang"
                      label="Berat Barang"
                      type="number"
                      :error-messages="errors.berat_barang"
                      required
                      variant="outlined"
                      density="comfortable"
                      class="mb-4"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      v-model="form.satuan"
                      label="Satuan"
                      :items="satuanOptions"
                      :error-messages="errors.satuan"
                      required
                      variant="outlined"
                      density="comfortable"
                      class="mb-4"
                    />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="form.stok"
                      label="Stok Awal"
                      type="number"
                      :error-messages="errors.stok"
                      required
                      variant="outlined"
                      density="comfortable"
                      class="mb-4"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="form.stok_minimum"
                      label="Stok Minimum"
                      type="number"
                      :error-messages="errors.stok_minimum"
                      required
                      variant="outlined"
                      density="comfortable"
                      class="mb-4"
                    />
                  </v-col>
                </v-row>

                <v-textarea
                  v-model="form.deskripsi"
                  label="Deskripsi Barang"
                  rows="5"
                  no-resize
                  :error-messages="errors.deskripsi"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                />

                <div class="mb-4">
                  <v-label class="mb-2 font-weight-medium">Gambar Barang</v-label>
                  <v-file-input
                    accept="image/*"
                    prepend-icon="mdi-camera"
                    @change="handleFileUpload"
                    :error-messages="errors.gambar_barang"
                    variant="outlined"
                    density="comfortable"
                    placeholder="Upload gambar barang"
                    hide-details
                  />

                  <v-card
                    variant="outlined"
                    class="mt-4"
                    :class="{ 'pa-4': imagePreview }"
                  >
                    <div v-if="imagePreview" class="d-flex flex-column align-center">
                      <v-img
                        :src="imagePreview"
                        max-height="300"
                        contain
                        class="mb-2"
                      />
                      <v-btn
                        color="error"
                        variant="tonal"
                        size="small"
                        @click="removeImage"
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

            <div class="d-flex justify-end gap-2">
              <v-btn
                color="secondary"
                variant="outlined"
                :disabled="isLoading"
                to="/barang/list"
              >
                Batal
              </v-btn>
              <v-btn
                color="primary"
                variant="flat"
                type="submit"
                :loading="isLoading"
              >
                <v-icon left>mdi-content-save</v-icon>
                {{ isEditMode ? 'Update' : 'Simpan Barang' }}
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
</style>
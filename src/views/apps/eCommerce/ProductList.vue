<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import type { Header, Item } from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import axios from 'axios';

const router = useRouter();
const items = ref<Item[]>([]);
const loading = ref(false);
const searchValue = ref('');
const searchField = ref('nama_barang');
const themeColor = ref('rgb(var(--v-theme-primary))');
const itemsSelected = ref<Item[]>([]);
const deleteDialog = ref(false);
const viewDialog = ref(false);
const editDialog = ref(false);
const selectedItem = ref(null);
const currentBarang = ref(null);
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');
const error = ref('');

// Data untuk kategori dan supplier
const kategoriOptions = ref([]);
const supplierOptions = ref([]);

// Form data untuk edit
const editBarangData = ref({
  id: null as number | null,
  kode_barang: '',
  nama_barang: '',
  merek: '',
  kategori_id: null as number | null,
  supplier_id: null as number | null,
  gambar_barang: null as File | null,
  harga_beli: 0,
  harga_jual: 0,
  berat_barang: 0,
  satuan: '',
  stok: 0,
  stok_minimum: 0,
  deskripsi: ''
});

const headers: Header[] = [
  { text: '#', value: 'gambar_barang' },
  { text: 'Kode', value: 'kode_barang', sortable: true },
  { text: 'Nama Barang', value: 'nama_barang', sortable: true },
  { text: 'Merek', value: 'merek' },
  { text: 'Kategori', value: 'kategori.nama_kategori', sortable: true },
  { text: 'Supplier', value: 'supplier.nama', sortable: true },
  { text: 'Harga Beli', value: 'harga_beli', sortable: true },
  { text: 'Harga Jual', value: 'harga_jual', sortable: true },
  { text: 'Stok', value: 'stok' },
  { text: 'Stok Min.', value: 'stok_minimum' },
  { text: 'Action', value: 'operation' }
];

const fetchBarang = async () => {
  loading.value = true;
  try {
    const response = await axios.get('/api/barang');
    items.value = response.data.data;
  } catch (err) {
    console.error('Gagal memuat barang:', err);
    showSnackbar('Gagal memuat data barang', 'error');
  } finally {
    loading.value = false;
  }
};

const fetchKategoriSupplier = async () => {
  try {
    // Fetch kategori
    const kategoriResponse = await axios.get('/api/kategori-barang');
    kategoriOptions.value = kategoriResponse.data.data;

    // Fetch supplier
    const supplierResponse = await axios.get('/api/suppliers');
    supplierOptions.value = supplierResponse.data.data;
  } catch (err) {
    console.error('Gagal memuat kategori/supplier:', err);
  }
};

const openViewDialog = async (id: number) => {
  try {
    loading.value = true;
    const response = await axios.get(`/api/barang/${id}`);
    if (response.data.success) {
      currentBarang.value = response.data.data;
      viewDialog.value = true;
    }
  } catch (err) {
    console.error('Gagal memuat detail barang:', err);
    showSnackbar('Gagal memuat detail barang', 'error');
  } finally {
    loading.value = false;
  }
};

const openEditDialog = async (id: number) => {
  try {
    loading.value = true;
    const response = await axios.get(`/api/barang/${id}`);
    if (response.data.success) {
      const barang = response.data.data;
      editBarangData.value = {
        id: barang.id,
        kode_barang: barang.kode_barang,
        nama_barang: barang.nama_barang,
        merek: barang.merek,
        kategori_id: barang.kategori_id,
        supplier_id: barang.supplier_id,
        gambar_barang: null,
        harga_beli: barang.harga_beli,
        harga_jual: barang.harga_jual,
        berat_barang: barang.berat_barang,
        satuan: barang.satuan,
        stok: barang.stok,
        stok_minimum: barang.stok_minimum,
        deskripsi: barang.deskripsi || ''
      };
      editDialog.value = true;
    }
  } catch (err) {
    console.error('Gagal memuat data barang untuk edit:', err);
    showSnackbar('Gagal memuat data barang', 'error');
  } finally {
    loading.value = false;
  }
};

const saveEditedBarang = async () => {
  if (editBarangData.value.id === null) return;

  try {
    loading.value = true;
    error.value = '';

    const formData = new FormData();
    formData.append('kode_barang', editBarangData.value.kode_barang);
    formData.append('nama_barang', editBarangData.value.nama_barang);
    formData.append('merek', editBarangData.value.merek);
    formData.append('kategori_id', editBarangData.value.kategori_id?.toString() || '');
    formData.append('supplier_id', editBarangData.value.supplier_id?.toString() || '');
    formData.append('harga_beli', editBarangData.value.harga_beli.toString());
    formData.append('harga_jual', editBarangData.value.harga_jual.toString());
    formData.append('berat_barang', editBarangData.value.berat_barang.toString());
    formData.append('satuan', editBarangData.value.satuan);
    formData.append('stok', editBarangData.value.stok.toString());
    formData.append('stok_minimum', editBarangData.value.stok_minimum.toString());
    formData.append('deskripsi', editBarangData.value.deskripsi);

    if (editBarangData.value.gambar_barang) {
      formData.append('gambar_barang', editBarangData.value.gambar_barang);
    }

    // Laravel membutuhkan method spoofing untuk PUT dengan FormData
    formData.append('_method', 'PUT');

    const response = await axios.post(`/api/barang/${editBarangData.value.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    if (response.data.success) {
      await fetchBarang();
      editDialog.value = false;
      showSnackbar('Barang berhasil diperbarui', 'success');
    }
  } catch (err: any) {
    console.error('Error saat update barang:', err);
    error.value = err.response?.data?.message || 'Terjadi kesalahan saat memperbarui barang';
  } finally {
    loading.value = false;
  }
};

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    editBarangData.value.gambar_barang = target.files[0];
  }
};

const viewProduct = (id: number) => {
  openViewDialog(id);
};

const editProduct = (id: number) => {
  openEditDialog(id);
};

const confirmDelete = (item: any) => {
  selectedItem.value = item;
  deleteDialog.value = true;
};

const deleteProduct = async () => {
  if (!selectedItem.value) return;

  try {
    loading.value = true;
    const response = await axios.delete(`/api/barang/${selectedItem.value.id}`);
    if (response.data.success) {
      await fetchBarang();
      showSnackbar('Barang berhasil dihapus', 'success');
    }
  } catch (err) {
    console.error('Gagal menghapus barang:', err);
    showSnackbar('Gagal menghapus barang', 'error');
  } finally {
    loading.value = false;
    deleteDialog.value = false;
    selectedItem.value = null;
  }
};

const showSnackbar = (text: string, color: string = 'success') => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

const getStockColor = (stok: number, stokMinimum: number) => {
  if (stok <= stokMinimum) return 'red';
  if (stok <= stokMinimum * 1.5) return 'orange';
  return 'green';
};

onMounted(() => {
  fetchBarang();
  fetchKategoriSupplier();
});
</script>

<template>
  <v-row class="mt-0">
    <v-col cols="12">
      <v-card variant="outlined" class="bg-surface overflow-hidden" rounded="lg">
        <v-card-item>
          <v-row justify="space-between" class="align-center">
            <v-col cols="12" md="3">
              <v-text-field
                type="text"
                variant="outlined"
                persistent-placeholder
                density="comfortable"
                placeholder="Cari Barang"
                v-model="searchValue"
                hide-details
              >
                <template #prepend-inner>
                  <SvgSprite name="custom-search" style="width: 16px; height: 16px" />
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <div class="d-flex ga-2 justify-end">
                <v-btn variant="flat" rounded="md" color="primary" to="/ecommerce/add-product">
                  <template #prepend>
                    <SvgSprite name="custom-plus" style="width: 18px; height: 18px" />
                  </template>
                  Tambah Barang
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
            table-class-name="customize-table"
            :theme-color="themeColor"
            :search-field="searchField"
            :search-value="searchValue"
            :rows-per-page="10"
            v-model:items-selected="itemsSelected"
            :loading="loading"
          >
            <template #item-gambar_barang="{ gambar_barang }">
              <v-avatar size="40" rounded="md">
                <v-img
                  :src="gambar_barang ? `http://127.0.0.1:8000/${gambar_barang}` : 'https://via.placeholder.com/40'"
                  alt="barang"
                  cover
                />
              </v-avatar>
            </template>

            <template #item-harga_beli="{ harga_beli }">
              <span class="text-body-2">{{ formatCurrency(harga_beli) }}</span>
            </template>

            <template #item-harga_jual="{ harga_jual }">
              <span class="text-body-2 font-weight-medium">{{ formatCurrency(harga_jual) }}</span>
            </template>

            <template #item-stok="{ stok, stok_minimum }">
              <v-chip 
                :color="getStockColor(stok, stok_minimum)" 
                variant="tonal" 
                size="small"
              >
                {{ stok }}
              </v-chip>
            </template>

            <template #item-operation="{ id, nama_barang }">
              <div class="d-flex gap-1">
                <v-tooltip text="Lihat Detail">
                  <template #activator="{ props }">
                    <v-btn 
                      icon
                      variant="text"
                      size="small"
                      v-bind="props"
                      @click="viewProduct(id)"
                    >
                      <SvgSprite name="custom-eye" class="text-primary" />
                    </v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="Edit">
                  <template #activator="{ props }">
                    <v-btn
                      icon
                      variant="text"
                      size="small"
                      v-bind="props"
                      @click="editProduct(id)"
                    >
                      <SvgSprite name="custom-edit" class="text-warning" />
                    </v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="Hapus">
                  <template #activator="{ props }">
                    <v-btn
                      icon
                      variant="text"
                      size="small"
                      v-bind="props"
                      @click="confirmDelete({ id, nama_barang })"
                    >
                      <SvgSprite name="custom-trash" class="text-error" />
                    </v-btn>
                  </template>
                </v-tooltip>
              </div>
            </template>
          </EasyDataTable>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <!-- View Dialog -->
  <v-dialog v-model="viewDialog" max-width="800">
    <v-card rounded="lg">
      <v-card-title class="text-h5 pa-5">
        Detail Barang
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text v-if="currentBarang" class="pa-5">
        <v-container>
          <v-row>
            <v-col cols="12" md="4" class="text-center">
              <div class="image-container mb-4">
                <v-img
                  :src="currentBarang.gambar_barang ? `http://127.0.0.1:8000/${currentBarang.gambar_barang}` : 'https://via.placeholder.com/300'"
                  :lazy-src="currentBarang.gambar_barang ? `http://127.0.0.1:8000/${currentBarang.gambar_barang}` : 'https://via.placeholder.com/10'"
                  alt="Gambar Barang"
                  cover
                  aspect-ratio="1"
                  max-height="300"
                  class="rounded-lg"
                >
                  <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </div>
              <v-btn
                v-if="currentBarang.gambar_barang"
                color="primary"
                variant="outlined"
                size="small"
                :href="`http://127.0.0.1:8000/${currentBarang.gambar_barang}`"
                target="_blank"
                download
              >
                <v-icon start>mdi-download</v-icon>
                Download Gambar
              </v-btn>
            </v-col>
            <v-col cols="12" md="8">
              <v-row>
                <v-col cols="12" md="6">
                  <v-label class="text-subtitle-2 text-medium-emphasis">Kode Barang</v-label>
                  <div class="text-subtitle-1 font-weight-medium">{{ currentBarang.kode_barang }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="text-subtitle-2 text-medium-emphasis">Nama Barang</v-label>
                  <div class="text-subtitle-1 font-weight-medium">{{ currentBarang.nama_barang }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="text-subtitle-2 text-medium-emphasis">Merek</v-label>
                  <div class="text-subtitle-1">{{ currentBarang.merek }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="text-subtitle-2 text-medium-emphasis">Kategori</v-label>
                  <div class="text-subtitle-1">{{ currentBarang.kategori?.nama_kategori || 'N/A' }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="text-subtitle-2 text-medium-emphasis">Supplier</v-label>
                  <div class="text-subtitle-1">{{ currentBarang.supplier?.nama || 'N/A' }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="text-subtitle-2 text-medium-emphasis">Satuan</v-label>
                  <div class="text-subtitle-1">{{ currentBarang.satuan }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="text-subtitle-2 text-medium-emphasis">Harga Beli</v-label>
                  <div class="text-subtitle-1">{{ formatCurrency(currentBarang.harga_beli) }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="text-subtitle-2 text-medium-emphasis">Harga Jual</v-label>
                  <div class="text-subtitle-1 font-weight-medium">{{ formatCurrency(currentBarang.harga_jual) }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="text-subtitle-2 text-medium-emphasis">Stok</v-label>
                  <div class="text-subtitle-1">
                    <v-chip 
                      :color="getStockColor(currentBarang.stok, currentBarang.stok_minimum)" 
                      variant="tonal" 
                      size="small"
                    >
                      {{ currentBarang.stok }}
                    </v-chip>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="text-subtitle-2 text-medium-emphasis">Stok Minimum</v-label>
                  <div class="text-subtitle-1">{{ currentBarang.stok_minimum }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="text-subtitle-2 text-medium-emphasis">Berat</v-label>
                  <div class="text-subtitle-1">{{ currentBarang.berat_barang }} kg</div>
                </v-col>
                <v-col cols="12" v-if="currentBarang.deskripsi">
                  <v-label class="text-subtitle-2 text-medium-emphasis">Deskripsi</v-label>
                  <div class="text-subtitle-1">{{ currentBarang.deskripsi }}</div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-5">
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="flat" @click="viewDialog = false">
          Tutup
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Edit Dialog -->
  <v-dialog v-model="editDialog" max-width="900" persistent>
    <v-card rounded="lg">
      <perfect-scrollbar style="max-height: calc(100vh - 48px)">
        <v-card-title class="pa-5">
          <span class="text-h5">Edit Barang</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-5">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-alert v-if="error" type="error" class="mb-4">
                  {{ error }}
                </v-alert>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2">Kode Barang</v-label>
                <v-text-field
                  v-model="editBarangData.kode_barang"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2">Nama Barang</v-label>
                <v-text-field
                  v-model="editBarangData.nama_barang"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2">Merek</v-label>
                <v-text-field
                  v-model="editBarangData.merek"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2">Kategori</v-label>
                <v-select
                  v-model="editBarangData.kategori_id"
                  :items="kategoriOptions"
                  item-title="nama_kategori"
                  item-value="id"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2">Supplier</v-label>
                <v-select
                  v-model="editBarangData.supplier_id"
                  :items="supplierOptions"
                  item-title="nama"
                  item-value="id"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2">Satuan</v-label>
                <v-text-field
                  v-model="editBarangData.satuan"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2">Harga Beli</v-label>
                <v-text-field
                  v-model.number="editBarangData.harga_beli"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2">Harga Jual</v-label>
                <v-text-field
                  v-model.number="editBarangData.harga_jual"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2">Berat Barang (kg)</v-label>
                <v-text-field
                  v-model.number="editBarangData.berat_barang"
                  type="number"
                  step="0.1"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2">Stok</v-label>
                <v-text-field
                  v-model.number="editBarangData.stok"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2">Stok Minimum</v-label>
                <v-text-field
                  v-model.number="editBarangData.stok_minimum"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2">Gambar Barang</v-label>
                <v-file-input
                  @change="onFileChange"
                  accept="image/*"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  prepend-icon=""
                  prepend-inner-icon="mdi-camera"
                ></v-file-input>
                <small class="text-medium-emphasis">Biarkan kosong jika tidak ingin mengubah gambar</small>
              </v-col>
              <v-col cols="12">
                <v-label class="mb-2">Deskripsi</v-label>
                <v-textarea
                  v-model="editBarangData.deskripsi"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  rows="3"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn color="error" rounded="md" variant="text" @click="editDialog = false">
            Batal
          </v-btn>
          <v-btn
            color="primary"
            rounded="md"
            variant="flat"
            @click="saveEditedBarang"
            :loading="loading"
          >
            Simpan Perubahan
          </v-btn>
        </v-card-actions>
      </perfect-scrollbar>
    </v-card>
  </v-dialog>

  <!-- Delete Confirmation Dialog -->
  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card rounded="lg">
      <v-card-title class="text-h6">
        Konfirmasi Hapus
      </v-card-title>
      <v-card-text>
        Apakah Anda yakin ingin menghapus barang
        <strong>{{ selectedItem?.nama_barang }}</strong>?
        <br><br>
        <small class="text-error">Aksi ini tidak dapat dibatalkan.</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          variant="text"
          @click="deleteDialog = false"
        >
          Batal
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          @click="deleteProduct"
          :loading="loading"
        >
          Hapus
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Snackbar -->
  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    timeout="3000"
    location="top"
  >
    {{ snackbarText }}
    <template #actions>
      <v-btn
        variant="text"
        @click="snackbar = false"
      >
        Tutup
      </v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped>
.ga-2 {
  gap: 8px;
}

.image-container {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.v-img {
  max-width: 100%;
  height: auto;
  margin: 0 auto;
}

.v-card-text {
  max-height: 70vh;
  overflow-y: auto;
}

:deep(.customize-table) {
  --easy-table-header-font-color: rgb(var(--v-theme-on-surface));
  --easy-table-header-background-color: rgb(var(--v-theme-surface));
}
</style>
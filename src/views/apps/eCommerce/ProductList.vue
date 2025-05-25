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
const selectedItem = ref(null);
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

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
  } catch (error) {
    console.error('Gagal memuat barang:', error);
    showSnackbar('Gagal memuat data barang', 'error');
  } finally {
    loading.value = false;
  }
};

const viewProduct = (id: number) => {
  router.push(`/barang/${id}`);
};

const editProduct = (id: number) => {
  router.push(`/barang/edit/${id}`);
};

const confirmDelete = (item: any) => {
  selectedItem.value = item;
  deleteDialog.value = true;
};

const deleteProduct = async () => {
  if (!selectedItem.value) return;
  
  try {
    loading.value = true;
    await axios.delete(`/api/barang/${selectedItem.value.id}`);
    await fetchBarang();
    showSnackbar('Barang berhasil dihapus', 'success');
  } catch (error) {
    console.error('Gagal menghapus barang:', error);
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

onMounted(fetchBarang);
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
                  :src="gambar_barang ? `/storage/${gambar_barang}` : 'https://via.placeholder.com/40'"
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

:deep(.customize-table) {
  --easy-table-border: 1px solid rgb(var(--v-theme-outline));
  --easy-table-row-border: 1px solid rgb(var(--v-theme-outline));
  --easy-table-header-font-size: 14px;
  --easy-table-header-height: 50px;
  --easy-table-header-font-color: rgb(var(--v-theme-on-surface));
  --easy-table-header-background-color: rgb(var(--v-theme-surface));
  --easy-table-body-even-row-font-color: rgb(var(--v-theme-on-surface));
  --easy-table-body-even-row-background-color: rgb(var(--v-theme-surface));
  --easy-table-body-row-font-color: rgb(var(--v-theme-on-surface));
  --easy-table-body-row-background-color: rgb(var(--v-theme-surface));
  --easy-table-body-row-height: 60px;
  --easy-table-body-row-font-size: 14px;
  --easy-table-body-row-hover-font-color: rgb(var(--v-theme-on-surface));
  --easy-table-body-row-hover-background-color: rgb(var(--v-theme-surface-variant));
}
</style>
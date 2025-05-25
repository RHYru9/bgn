<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import type { Header, Item } from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import { useSuppliers } from '@/stores/apps/supplier';

const router = useRouter();
const store = useSuppliers();

const searchValue = ref('');
const searchField = ref<'nama'>('nama');
const themeColor = ref('rgb(var(--v-theme-primary))');
const itemsSelected = ref<Item[]>([]);
const deleteDialog = ref(false);
const selectedItem = ref<{ id?: number; nama?: string } | null>(null);
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref<'success' | 'error'>('success');

// Dialogs for view and edit
const viewDialog = ref(false);
const editDialog = ref(false);
const loading = ref(false);
const error = ref('');

// Edit supplier data
const editSupplierData = ref({
  id: null as number | null,
  nama: '',
  alamat: '',
  kode_pos: '',
  no_telp: '',
  email: ''
});

const headers: Header[] = [
  { text: 'Nama Supplier', value: 'nama', sortable: true },
  { text: 'Alamat', value: 'alamat' },
  { text: 'Kode Pos', value: 'kode_pos' },
  { text: 'No. Telp', value: 'no_telp' },
  { text: 'Email', value: 'email' },
  { text: 'Action', value: 'operation', sortable: false },
];

// Map suppliers from store to items for EasyDataTable
const items = computed(() => store.suppliers);

// Show snackbar helper
function showSnackbar(text: string, color: 'success' | 'error' = 'success') {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
}

async function fetchSuppliers() {
  try {
    await store.fetchSuppliers();
  } catch (e) {
    showSnackbar(store.error || 'Gagal memuat data supplier', 'error');
  }
}

// View supplier detail
const openViewDialog = async (id: number) => {
  try {
    loading.value = true;
    await store.fetchSupplier(id);
    viewDialog.value = true;
  } catch (error) {
    console.error('Failed to fetch supplier:', error);
    showSnackbar('Gagal memuat detail supplier', 'error');
  } finally {
    loading.value = false;
  }
};

// Edit supplier
const openEditDialog = async (id: number) => {
  try {
    loading.value = true;
    const supplier = await store.fetchSupplier(id);
    if (supplier) {
      editSupplierData.value = {
        id: supplier.id,
        nama: supplier.nama,
        alamat: supplier.alamat || '',
        kode_pos: supplier.kode_pos || '',
        no_telp: supplier.no_telp || '',
        email: supplier.email || ''
      };
      editDialog.value = true;
    }
  } catch (error) {
    console.error('Failed to fetch supplier for edit:', error);
    showSnackbar('Gagal memuat data supplier untuk edit', 'error');
  } finally {
    loading.value = false;
  }
};

// Save edited supplier
const saveEditedSupplier = async () => {
  if (editSupplierData.value.id === null) return;

  try {
    loading.value = true;
    error.value = '';
    
    await store.updateSupplier(editSupplierData.value.id, {
      nama: editSupplierData.value.nama,
      alamat: editSupplierData.value.alamat,
      kode_pos: editSupplierData.value.kode_pos,
      no_telp: editSupplierData.value.no_telp,
      email: editSupplierData.value.email
    });
    
    editDialog.value = false;
    showSnackbar('Supplier berhasil diperbarui', 'success');
    await fetchSuppliers();
  } catch (error: any) {
    console.error('Error saat update data:', error);
    error.value = error.response?.data?.message || 'Terjadi kesalahan saat memperbarui data';
    showSnackbar(error.value, 'error');
  } finally {
    loading.value = false;
  }
};

function viewSupplier(id: number) {
  openViewDialog(id);
}

function editSupplier(id: number) {
  openEditDialog(id);
}

function confirmDelete(item: any) {
  selectedItem.value = item;
  deleteDialog.value = true;
}

async function deleteSupplier() {
  if (!selectedItem.value?.id) return;

  try {
    await store.deleteSupplier(selectedItem.value.id);
    showSnackbar('Supplier berhasil dihapus', 'success');
    await fetchSuppliers();
  } catch (e) {
    showSnackbar(store.error || 'Gagal menghapus supplier', 'error');
  } finally {
    deleteDialog.value = false;
    selectedItem.value = null;
  }
}

async function refreshData() {
  await fetchSuppliers();
  showSnackbar('Data supplier berhasil diperbarui', 'success');
}

onMounted(fetchSuppliers);
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
                placeholder="Cari Supplier"
                v-model="searchValue"
                hide-details
                clearable
              >
                <template #prepend-inner>
                  <SvgSprite name="custom-search" style="width: 16px; height: 16px" />
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <div class="d-flex ga-2 justify-end">
                <v-btn
                  variant="outlined"
                  rounded="md"
                  color="secondary"
                  :loading="store.loading"
                  @click="refreshData"
                >
                  <template #prepend>
                    <SvgSprite name="custom-refresh" style="width: 18px; height: 18px" />
                  </template>
                  Refresh
                </v-btn>
                <v-btn variant="flat" rounded="md" color="primary" to="/ecommerce/supplier/add">
                  <template #prepend>
                    <SvgSprite name="custom-plus" style="width: 18px; height: 18px" />
                  </template>
                  Tambah Supplier
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
            :loading="store.loading"
            alternating
            buttons-pagination
          >
            <template #item-nama="{ nama }">
              <span class="text-no-wrap">{{ nama }}</span>
            </template>

            <template #item-alamat="{ alamat }">
              <v-tooltip :text="alamat">
                <template #activator="{ props }">
                  <span
                    v-bind="props"
                    class="text-truncate d-inline-block"
                    style="max-width: 200px"
                  >
                    {{ alamat }}
                  </span>
                </template>
              </v-tooltip>
            </template>

            <template #item-no_telp="{ no_telp }">
              <span class="text-no-wrap">{{ no_telp || '-' }}</span>
            </template>

            <template #item-email="{ email }">
              <span class="text-no-wrap">{{ email || '-' }}</span>
            </template>

            <template #item-operation="item">
              <div class="d-flex gap-1 justify-center">
                <v-tooltip text="Lihat Detail">
                  <template #activator="{ props }">
                    <v-btn
                      icon
                      color="secondary"
                      variant="text"
                      size="small"
                      v-bind="props"
                      @click="viewSupplier(item.id)"
                    >
                      <SvgSprite name="custom-eye" style="width: 20px; height: 20px" />
                    </v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="Edit">
                  <template #activator="{ props }">
                    <v-btn
                      icon
                      color="primary"
                      variant="text"
                      size="small"
                      v-bind="props"
                      @click="editSupplier(item.id)"
                    >
                      <SvgSprite name="custom-edit-outline" style="width: 20px; height: 20px" />
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
                      color="error"
                      @click="confirmDelete(item)"
                    >
                      <SvgSprite name="custom-trash" style="width: 20px; height: 20px" />
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
        Apakah Anda yakin ingin menghapus supplier
        <strong>{{ selectedItem?.nama }}</strong>?
        <br /><br />
        <small class="text-error">Aksi ini tidak dapat dibatalkan.</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text variant="text" @click="deleteDialog = false">
          Batal
        </v-btn>
        <v-btn color="error" variant="flat" @click="deleteSupplier" :loading="store.loading">
          Hapus
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- View Dialog -->
  <v-dialog v-model="viewDialog" max-width="600">
    <v-card>
      <v-card-title class="text-h5">
        Detail Supplier
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text v-if="store.currentSupplier">
        <v-container>
          <v-row>
            <v-col cols="12" md="4" class="text-center">
              <v-avatar size="120" color="primary" class="mb-4">
                <SvgSprite name="custom-building" style="width: 60px; height: 60px" />
              </v-avatar>
            </v-col>
            <v-col cols="12" md="8">
              <v-row>
                <v-col cols="12" md="6">
                  <v-label class="text-subtitle-2 text-medium-emphasis">Nama Supplier</v-label>
                  <div class="text-subtitle-1">{{ store.currentSupplier.nama }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="text-subtitle-2 text-medium-emphasis">Email</v-label>
                  <div class="text-subtitle-1">{{ store.currentSupplier.email || 'N/A' }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="text-subtitle-2 text-medium-emphasis">No. Telp</v-label>
                  <div class="text-subtitle-1">{{ store.currentSupplier.no_telp || 'N/A' }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="text-subtitle-2 text-medium-emphasis">Kode Pos</v-label>
                  <div class="text-subtitle-1">{{ store.currentSupplier.kode_pos || 'N/A' }}</div>
                </v-col>
                <v-col cols="12">
                  <v-label class="text-subtitle-2 text-medium-emphasis">Alamat</v-label>
                  <div class="text-subtitle-1">{{ store.currentSupplier.alamat || 'N/A' }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="text-subtitle-2 text-medium-emphasis">Terdaftar Sejak</v-label>
                  <div class="text-subtitle-1">{{ new Date(store.currentSupplier.created_at).toLocaleDateString() }}</div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="flat" @click="viewDialog = false">
          Tutup
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Edit Dialog -->
  <v-dialog v-model="editDialog" max-width="800">
    <v-card>
      <perfect-scrollbar style="max-height: calc(100vh - 48px)">
        <v-card-title class="pa-5">
          <span class="text-h5">Edit Supplier</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-alert
                  v-if="error"
                  type="error"
                  class="mb-4"
                >
                  {{ error }}
                </v-alert>
              </v-col>
              <v-col md="3" cols="12" class="text-center">
                <v-avatar size="72" variant="outlined" color="primary" class="dashed">
                  <SvgSprite name="custom-building" style="width: 40px; height: 40px" />
                </v-avatar>
              </v-col>
              <v-col md="9" cols="12">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-label class="mb-2">Nama Supplier</v-label>
                    <v-text-field
                      v-model="editSupplierData.nama"
                      single-line
                      placeholder="Masukkan nama supplier"
                      hide-details
                      variant="outlined"
                      required
                      density="comfortable"
                      rounded="0"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-label class="mb-2">Email</v-label>
                    <v-text-field
                      v-model="editSupplierData.email"
                      single-line
                      type="email"
                      hide-details
                      placeholder="Masukkan email supplier"
                      variant="outlined"
                      density="comfortable"
                      rounded="0"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-label class="mb-2">No. Telp</v-label>
                    <v-text-field
                      v-model="editSupplierData.no_telp"
                      single-line
                      hide-details
                      placeholder="Masukkan nomor telepon"
                      variant="outlined"
                      density="comfortable"
                      rounded="0"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-label class="mb-2">Kode Pos</v-label>
                    <v-text-field
                      v-model="editSupplierData.kode_pos"
                      single-line
                      hide-details
                      placeholder="Masukkan kode pos"
                      variant="outlined"
                      density="comfortable"
                      rounded="0"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-label class="mb-2">Alamat</v-label>
                    <v-textarea
                      v-model="editSupplierData.alamat"
                      hide-details
                      placeholder="Masukkan alamat lengkap"
                      variant="outlined"
                      density="comfortable"
                      rounded="0"
                      rows="3"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" rounded="md" variant="text" @click="editDialog = false"> Batal </v-btn>
          <v-btn
            color="primary"
            rounded="md"
            variant="flat"
            @click="saveEditedSupplier"
            :loading="loading"
          >
            Simpan Perubahan
          </v-btn>
        </v-card-actions>
      </perfect-scrollbar>
    </v-card>
  </v-dialog>

  <!-- Snackbar -->
  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="top">
    {{ snackbarText }}
    <template #actions>
      <v-btn variant="text" @click="snackbar = false">Tutup</v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped>
.ga-2 {
  gap: 8px;
}

.text-no-wrap {
  white-space: nowrap;
}

:deep(.customize-table) {
  --easy-table-body-even-row-font-color: rgb(var(--v-theme-on-surface));
  --easy-table-body-even-row-background-color: rgb(var(--v-theme-surface));
}
</style>
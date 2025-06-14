<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import karirService from '@/stores/apps/karir';
import type { KarirData, PelamarData, MitraData } from '@/stores/apps/karir';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { Header } from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

// Page info
const page = ref({ title: 'Karir Management' });
const breadcrumbs = ref([
  { title: 'Karir', disabled: false, href: '#' },
  { title: 'List', disabled: true, href: '#' }
]);

// Data state
const karirList = ref<KarirData[]>([]);
const loading = ref(false);
const error = ref('');

// Filter system
const searchTerm = ref('');
const showFilters = ref(false);
const activeTab = ref<'all' | 'pelamar' | 'mitra'>('all');
const statusFilter = ref('all');

// Dialogs
const viewDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);

// Current selected item
const currentItem = ref<KarirData | null>(null);

// Table headers
const headers: Header[] = [
  { text: 'ID', value: 'id', sortable: true, width: 80 },
  { text: 'Tipe', value: 'tipe', sortable: true, width: 120 },
  { text: 'Nama', value: 'nama_lengkap', sortable: true, width: 200 },
  { text: 'Status', value: 'status', sortable: true, width: 120 },
  { text: 'Tanggal Dibuat', value: 'created_at', sortable: true, width: 150 },
  { text: 'Aksi', value: 'operation', width: 120 }
];

// Fetch data on mount
onMounted(() => {
  fetchKarir();
});

// Fetch karir data
const fetchKarir = async () => {
  try {
    loading.value = true;
    const result = await karirService.fetchKarir();
    if (result.success && result.data) {
      karirList.value = result.data;
    } else {
      error.value = result.message || 'Gagal memuat data karir';
    }
  } catch (err) {
    error.value = 'Terjadi kesalahan saat memuat data';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Filtered items based on active tab and search term
const filteredItems = computed(() => {
  let items = karirList.value;

  if (activeTab.value !== 'all') {
    items = items.filter(item => item.tipe === activeTab.value);
  }

  if (statusFilter.value !== 'all') {
    items = items.filter(item => 'status' in item && item.status === statusFilter.value);
  }

  if (searchTerm.value.trim()) {
    const term = searchTerm.value.toLowerCase().trim();
    items = items.filter(item => 
      item.nama_lengkap.toLowerCase().includes(term) ||
      (item.tipe === 'pelamar' && (item as PelamarData).email?.toLowerCase().includes(term)) ||
      (item.tipe === 'mitra' && (item as MitraData).nama_perusahaan?.toLowerCase().includes(term))
    );
  }

  return items;
});

// Open view dialog
const openViewDialog = (item: KarirData) => {
  currentItem.value = item;
  viewDialog.value = true;
};

// Open edit dialog
const openEditDialog = (item: KarirData) => {
  currentItem.value = JSON.parse(JSON.stringify(item));
  editDialog.value = true;
};

// Open delete dialog
const openDeleteDialog = (item: KarirData) => {
  currentItem.value = item;
  deleteDialog.value = true;
};

// Confirm delete
const confirmDelete = async () => {
  if (!currentItem.value?.id) return;

  try {
    loading.value = true;
    const result = await karirService.deleteKarir(currentItem.value.id);
    if (result.success) {
      karirList.value = karirList.value.filter(item => item.id !== currentItem.value?.id);
      deleteDialog.value = false;
    } else {
      error.value = result.message || 'Gagal menghapus data';
    }
  } catch (err) {
    error.value = 'Terjadi kesalahan saat menghapus data';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Save edited item
const saveEditedItem = async () => {
  if (!currentItem.value?.id) return;

  try {
    loading.value = true;
    const result = await karirService.updateKarir(
      currentItem.value.id,
      currentItem.value
    );
    
    if (result.success && result.data) {
      karirList.value = karirList.value.map(item => 
        item.id === currentItem.value?.id ? result.data! : item
      );
      editDialog.value = false;
    } else {
      error.value = result.message || 'Gagal memperbarui data';
    }
  } catch (err) {
    error.value = 'Terjadi kesalahan saat memperbarui data';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID');
};

// Get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
    case 'aktif':
      return 'success';
    case 'pending':
      return 'warning';
    case 'rejected':
    case 'non-aktif':
      return 'error';
    default:
      return 'info';
  }
};
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  
  <v-row>
    <v-col cols="12">
      <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
        <v-card-item>
          <v-tabs v-model="activeTab" color="primary">
            <v-tab value="all">Semua</v-tab>
            <v-tab value="pelamar">Pelamar</v-tab>
            <v-tab value="mitra">Mitra</v-tab>
          </v-tabs>
          
          <v-row class="mt-4 align-center">
            <v-col cols="12" md="6">
              <v-text-field
                v-model="searchTerm"
                placeholder="Cari karir..."
                variant="outlined"
                prepend-inner-icon="mdi-magnify"
                density="compact"
                hide-details
                clearable
                @keyup.esc="searchTerm = ''"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="6" class="text-right">
              <v-btn
                variant="text"
                color="secondary"
                @click="showFilters = !showFilters"
                rounded="md"
                class="mr-2"
              >
                <v-icon icon="mdi-filter" class="mr-1"></v-icon>
                Filter
                <v-icon :icon="showFilters ? 'mdi-chevron-up' : 'mdi-chevron-down'" class="ml-1"></v-icon>
              </v-btn>
              
              <v-btn
                color="secondary"
                variant="text"
                @click="searchTerm = ''; statusFilter = 'all'"
                rounded="md"
                :disabled="!searchTerm && statusFilter === 'all'"
              >
                <v-icon icon="mdi-refresh" class="mr-1"></v-icon>
                Reset
              </v-btn>
            </v-col>
          </v-row>
          
          <v-expand-transition>
            <div v-if="showFilters" class="mt-4">
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="statusFilter"
                    :items="[
                      { title: 'Semua Status', value: 'all' },
                      { title: 'Pending', value: 'pending' },
                      { title: 'Approved', value: 'approved' },
                      { title: 'Rejected', value: 'rejected' },
                      { title: 'Aktif', value: 'aktif' },
                      { title: 'Non-Aktif', value: 'non-aktif' }
                    ]"
                    item-title="title"
                    item-value="value"
                    variant="outlined"
                    density="compact"
                    hide-details
                    label="Filter Status"
                  ></v-select>
                </v-col>
              </v-row>
            </div>
          </v-expand-transition>
        </v-card-item>
        
        <v-divider></v-divider>
        
        <v-card-text class="pa-0">
          <v-alert
            v-if="error"
            type="error"
            class="ma-4"
            @click="error = ''"
            variant="tonal"
          >
            {{ error }}
          </v-alert>
          
          <div v-if="loading" class="pa-8 text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          
          <div v-else-if="filteredItems.length === 0" class="pa-8 text-center">
            <v-icon icon="mdi-magnify" size="48" color="grey-lighten-1" class="mb-4"></v-icon>
            <h3 class="text-subtitle-1">Tidak ada data yang ditemukan</h3>
            <p class="text-body-2 text-grey">Coba ubah kriteria pencarian atau reset filter</p>
            <v-btn 
              color="primary" 
              variant="text" 
              @click="searchTerm = ''; statusFilter = 'all'" 
              class="mt-4"
              rounded="md"
            >
              Reset Filter
            </v-btn>
          </div>
          
          <EasyDataTable
            v-else
            :headers="headers"
            :items="filteredItems"
            table-class-name="customize-table"
            :rows-per-page="10"
            buttons-pagination
            class="pa-2"
          >
            <template #item-tipe="{ tipe }">
              <v-chip :color="tipe === 'pelamar' ? 'primary' : 'secondary'" size="small" rounded="md">
                {{ tipe === 'pelamar' ? 'Pelamar' : 'Mitra' }}
              </v-chip>
            </template>
            
            <template #item-status="{ status }">
              <v-chip :color="getStatusColor(status)" size="small" rounded="md">
                {{ status }}
              </v-chip>
            </template>
            
            <template #item-created_at="{ created_at }">
              {{ formatDate(created_at) }}
            </template>
            
            <template #item-operation="item">
              <div class="d-flex gap-1">
                <v-tooltip text="Lihat Detail">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      color="secondary"
                      variant="text"
                      rounded="md"
                      @click="openViewDialog(item)"
                    >
                      <SvgSprite name="custom-eye" style="width: 20px; height: 20px" />
                    </v-btn>
                  </template>
                </v-tooltip>
                
                <v-tooltip text="Edit">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      color="primary"
                      variant="text"
                      rounded="md"
                      @click="openEditDialog(item)"
                    >
                      <SvgSprite name="custom-edit-outline" style="width: 20px; height: 20px" />
                    </v-btn>
                  </template>
                </v-tooltip>
                
                <v-tooltip text="Hapus">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      color="error"
                      variant="text"
                      rounded="md"
                      @click="openDeleteDialog(item)"
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

  <!-- View Dialog -->
  <v-dialog v-model="viewDialog" max-width="800">
    <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
      <v-card-item class="pa-6">
        <v-card-title class="text-h5 mb-2">
          Detail {{ currentItem?.tipe === 'pelamar' ? 'Pelamar' : 'Mitra' }}
        </v-card-title>
      </v-card-item>
      <v-divider></v-divider>
      <v-card-text v-if="currentItem" class="pa-6">
        <v-container class="pa-0">
          <v-row class="mb-4">
            <v-col cols="12" class="text-center">
              <v-chip 
                :color="getStatusColor(currentItem.status || '')" 
                size="large" 
                class="px-6 py-2 text-h6" 
                rounded="lg"
              >
                {{ currentItem.status }}
              </v-chip>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12">
              <h3 class="text-h6 mb-2 text-primary">Informasi Utama</h3>
              <v-divider class="mb-4"></v-divider>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-label class="text-subtitle-2 text-medium-emphasis font-weight-bold mb-1">Nama Lengkap</v-label>
              <div class="text-subtitle-1 text-high-emphasis mb-4">
                {{ currentItem.nama_lengkap }}
              </div>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-label class="text-subtitle-2 text-medium-emphasis font-weight-bold mb-1">Tanggal Dibuat</v-label>
              <div class="text-subtitle-1 text-high-emphasis mb-4">
                {{ formatDate(currentItem.created_at || '') }}
              </div>
            </v-col>
          </v-row>
          
          <template v-if="currentItem.tipe === 'pelamar'">
            <v-row>
              <v-col cols="12">
                <h3 class="text-h6 mb-2 text-primary">Informasi Pelamar</h3>
                <v-divider class="mb-4"></v-divider>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-label class="text-subtitle-2 text-medium-emphasis font-weight-bold mb-1">Nama Panggilan</v-label>
                <div class="text-subtitle-1 text-high-emphasis mb-4">
                  {{ (currentItem as PelamarData).nama_panggilan || 'N/A' }}
                </div>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-label class="text-subtitle-2 text-medium-emphasis font-weight-bold mb-1">Email</v-label>
                <div class="text-subtitle-1 text-high-emphasis mb-4">
                  {{ (currentItem as PelamarData).email || 'N/A' }}
                </div>
              </v-col>
              
              <v-col cols="12">
                <v-label class="text-subtitle-2 text-medium-emphasis font-weight-bold mb-2">Dokumen Pendukung</v-label>
                <div class="d-flex flex-wrap gap-2">
                  <v-btn
                    v-if="(currentItem as PelamarData).link_ijazah"
                    variant="outlined"
                    color="primary"
                    size="small"
                    rounded="lg"
                    :href="(currentItem as PelamarData).link_ijazah"
                    target="_blank"
                    prepend-icon="mdi-file-document-outline"
                  >
                    Ijazah
                  </v-btn>
                  <v-btn
                    v-if="(currentItem as PelamarData).link_ktp"
                    variant="outlined"
                    color="primary"
                    size="small"
                    rounded="lg"
                    :href="(currentItem as PelamarData).link_ktp"
                    target="_blank"
                    prepend-icon="mdi-card-account-details-outline"
                  >
                    KTP
                  </v-btn>
                  <v-btn
                    v-if="(currentItem as PelamarData).link_cv"
                    variant="outlined"
                    color="primary"
                    size="small"
                    rounded="lg"
                    :href="(currentItem as PelamarData).link_cv"
                    target="_blank"
                    prepend-icon="mdi-file-account-outline"
                  >
                    CV
                  </v-btn>
                  <div 
                    v-if="!(currentItem as PelamarData).link_ijazah && !(currentItem as PelamarData).link_ktp && !(currentItem as PelamarData).link_cv" 
                    class="text-medium-emphasis text-subtitle-2"
                  >
                    Tidak ada dokumen tersedia
                  </div>
                </div>
              </v-col>
            </v-row>
          </template>
          
          <template v-else-if="currentItem.tipe === 'mitra'">
            <v-row>
              <v-col cols="12">
                <h3 class="text-h6 mb-2 text-primary">Informasi Perusahaan</h3>
                <v-divider class="mb-4"></v-divider>
              </v-col>
              
              <v-col cols="12">
                <v-label class="text-subtitle-2 text-medium-emphasis font-weight-bold mb-1">Nama Perusahaan</v-label>
                <div class="text-subtitle-1 text-high-emphasis mb-4">
                  {{ (currentItem as MitraData).nama_perusahaan || 'N/A' }}
                </div>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-label class="text-subtitle-2 text-medium-emphasis font-weight-bold mb-1">Email Perusahaan</v-label>
                <div class="text-subtitle-1 text-high-emphasis mb-4">
                  {{ (currentItem as MitraData).email_perusahaan || 'N/A' }}
                </div>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-label class="text-subtitle-2 text-medium-emphasis font-weight-bold mb-1">Nomor Telepon</v-label>
                <div class="text-subtitle-1 text-high-emphasis mb-4">
                  {{ (currentItem as MitraData).nomor_telepon || 'N/A' }}
                </div>
              </v-col>
              
              <v-col cols="12">
                <v-label class="text-subtitle-2 text-medium-emphasis font-weight-bold mb-1">Alamat</v-label>
                <div class="text-subtitle-1 text-high-emphasis mb-4">
                  {{ (currentItem as MitraData).alamat || 'N/A' }}
                </div>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-label class="text-subtitle-2 text-medium-emphasis font-weight-bold mb-1">Jenis Mitra</v-label>
                <div class="text-subtitle-1 text-high-emphasis mb-4">
                  {{ (currentItem as MitraData).jenis_mitra || 'N/A' }}
                </div>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-label class="text-subtitle-2 text-medium-emphasis font-weight-bold mb-1">Status</v-label>
                <div class="text-subtitle-1 text-high-emphasis mb-4">
                  <v-chip 
                    :color="getStatusColor((currentItem as MitraData).status || '')" 
                    size="small" 
                    rounded="md"
                  >
                    {{ (currentItem as MitraData).status }}
                  </v-chip>
                </div>
              </v-col>
              
              <v-col cols="12" v-if="(currentItem as MitraData).deskripsi">
                <v-label class="text-subtitle-2 text-medium-emphasis font-weight-bold mb-1">Deskripsi</v-label>
                <div class="text-subtitle-1 text-high-emphasis mb-4">
                  {{ (currentItem as MitraData).deskripsi }}
                </div>
              </v-col>
            </v-row>
          </template>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn 
          color="primary" 
          variant="flat" 
          @click="viewDialog = false" 
          rounded="lg"
        >
          Tutup
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Edit Dialog -->
  <v-dialog v-model="editDialog" max-width="600">
    <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
      <v-card-item class="pa-4">
        <v-card-title class="text-h5">
          Edit {{ currentItem?.tipe === 'pelamar' ? 'Pelamar' : 'Mitra' }}
        </v-card-title>
      </v-card-item>
      <v-divider></v-divider>
      <v-card-text v-if="currentItem" class="pa-4">
        <v-container class="pa-0">
          <v-row>
            <v-col cols="12">
              <v-alert
                v-if="error"
                type="error"
                class="mb-4"
                variant="tonal"
              >
                {{ error }}
              </v-alert>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model="currentItem.nama_lengkap"
                label="Nama Lengkap"
                variant="outlined"
                density="comfortable"
                hide-details
                rounded="lg"
              ></v-text-field>
            </v-col>
            
            <template v-if="currentItem.tipe === 'pelamar'">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="(currentItem as PelamarData).nama_panggilan"
                  label="Nama Panggilan"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  rounded="lg"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="(currentItem as PelamarData).email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  rounded="lg"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-select
                  v-model="(currentItem as PelamarData).status"
                  label="Status"
                  :items="['pending', 'approved', 'rejected']"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  rounded="lg"
                ></v-select>
              </v-col>
            </template>
            
            <template v-else-if="currentItem.tipe === 'mitra'">
              <v-col cols="12">
                <v-text-field
                  v-model="(currentItem as MitraData).nama_perusahaan"
                  label="Nama Perusahaan"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  rounded="lg"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="(currentItem as MitraData).email_perusahaan"
                  label="Email Perusahaan"
                  type="email"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  rounded="lg"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="(currentItem as MitraData).nomor_telepon"
                  label="Nomor Telepon"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  rounded="lg"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12">
                <v-text-field
                  v-model="(currentItem as MitraData).alamat"
                  label="Alamat"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  rounded="lg"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="(currentItem as MitraData).jenis_mitra"
                  label="Jenis Mitra"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  rounded="lg"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-select
                  v-model="(currentItem as MitraData).status"
                  label="Status"
                  :items="['aktif', 'non-aktif', 'pending']"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  rounded="lg"
                ></v-select>
              </v-col>
              
              <v-col cols="12">
                <v-textarea
                  v-model="(currentItem as MitraData).deskripsi"
                  label="Deskripsi"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  rows="3"
                  rounded="lg"
                ></v-textarea>
              </v-col>
            </template>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="editDialog = false" rounded="lg">
          Batal
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="saveEditedItem"
          :loading="loading"
          rounded="lg"
        >
          Simpan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Delete Dialog -->
  <v-dialog v-model="deleteDialog" max-width="500">
    <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
      <v-card-item class="pa-4">
        <v-card-title class="text-h5">
          Konfirmasi Hapus
        </v-card-title>
      </v-card-item>
      <v-divider></v-divider>
      <v-card-text class="pa-4">
        Apakah Anda yakin ingin menghapus {{ currentItem?.tipe === 'pelamar' ? 'pelamar' : 'mitra' }} ini?
        Tindakan ini tidak dapat dibatalkan.
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="secondary" variant="text" @click="deleteDialog = false" rounded="lg">
          Batal
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          @click="confirmDelete"
          :loading="loading"
          rounded="lg"
        >
          Hapus
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.customize-table {
  --easy-table-header-font-size: 14px;
  --easy-table-body-row-font-size: 14px;
}
</style>
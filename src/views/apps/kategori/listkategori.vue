<script setup lang="ts">
import { ref, computed, onMounted, shallowRef } from 'vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import axios from 'axios';
import type { Header, Item } from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

const page = ref({ title: 'Daftar Kategori Barang' });
const breadcrumbs = shallowRef([
  { title: 'Master Data', disabled: false, href: '#' },
  { title: 'Kategori Barang', disabled: true, href: '#' }
]);

interface Kategori {
  id: number;
  nama_kategori: string;
  deskripsi: string;
  created_at?: string;
}

// State management
const kategoriList = ref<Kategori[]>([]);
const loading = ref(false);
const deleteLoading = ref(false);
const errorMessage = ref('');

// Advanced Filter System
const searchTerm = ref('');
const showFilters = ref(false);
const filters = ref({
  searchField: {
    value: 'nama_kategori',
    options: [
      { title: 'Nama Kategori', value: 'nama_kategori' },
      { title: 'Deskripsi', value: 'deskripsi' }
    ]
  }
});

// Table headers
const headers: Header[] = [
  { text: 'ID', value: 'id', sortable: true },
  { text: 'Nama Kategori', value: 'nama_kategori', sortable: true },
  { text: 'Deskripsi', value: 'deskripsi', sortable: true },
  { text: 'Tanggal Dibuat', value: 'created_at', sortable: true },
  { text: 'Aksi', value: 'operation' }
];

// Advanced filtering logic
const filteredItems = computed(() => {
  if (!kategoriList.value) return [];
  
  return kategoriList.value.filter(item => {
    // Apply search term
    if (searchTerm.value.trim()) {
      const fieldValue = item[filters.value.searchField.value as keyof Kategori];
      if (!fieldValue) return false;
      return String(fieldValue).toLowerCase().includes(searchTerm.value.toLowerCase().trim());
    }
    
    return true;
  });
});

// Reset all filters
const resetFilters = () => {
  searchTerm.value = '';
};

// Dialogs
const dialog = ref(false);
const viewDialog = ref(false);
const editDialog = ref(false);
const deleteConfirmDialog = ref(false);

// Form data
const kategoriBaru = ref({
  nama_kategori: '',
  deskripsi: ''
});

const editKategoriData = ref({
  id: null as number | null,
  nama_kategori: '',
  deskripsi: ''
});

const hapusKategori = ref<number | null>(null);
const selectedKategori = ref<Kategori | null>(null);

// Snackbar state
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});

const showSnackbar = (message: string, color: 'success' | 'error' = 'success') => {
  snackbar.value = {
    show: true,
    message,
    color
  };
};

// Methods
const fetchKategori = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/kategori-barang', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    kategoriList.value = response.data.data;
    showSnackbar('Data kategori berhasil dimuat');
  } catch (error: any) {
    const message = error.response?.data?.message || 'Gagal memuat data kategori.';
    errorMessage.value = message;
    showSnackbar(message, 'error');
  } finally {
    loading.value = false;
  }
};

const openDeleteDialog = (id: number) => {
  selectedKategori.value = kategoriList.value.find(k => k.id === id) || null;
  hapusKategori.value = id;
  deleteConfirmDialog.value = true;
};

const confirmDelete = async () => {
  if (hapusKategori.value !== null) {
    try {
      deleteLoading.value = true;
      const token = localStorage.getItem('token');
      await axios.delete(`/api/kategori-barang/${hapusKategori.value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      
      kategoriList.value = kategoriList.value.filter(k => k.id !== hapusKategori.value);
      showSnackbar(`Kategori "${selectedKategori.value?.nama_kategori}" berhasil dihapus`);
      deleteConfirmDialog.value = false;
      hapusKategori.value = null;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal menghapus kategori.';
      showSnackbar(message, 'error');
    } finally {
      deleteLoading.value = false;
    }
  }
};

const openViewDialog = (kategori: Kategori) => {
  selectedKategori.value = kategori;
  viewDialog.value = true;
};

const openEditDialog = (kategori: Kategori) => {
  editKategoriData.value = {
    id: kategori.id,
    nama_kategori: kategori.nama_kategori,
    deskripsi: kategori.deskripsi
  };
  editDialog.value = true;
};

const addKategori = async () => {
  try {
    loading.value = true;
    errorMessage.value = '';
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token tidak ditemukan');
    
    const response = await axios.post('/api/kategori-barang', kategoriBaru.value, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 201 || response.status === 200) {
      kategoriList.value.push(response.data.data);
      dialog.value = false;
      kategoriBaru.value = {
        nama_kategori: '',
        deskripsi: ''
      };
      showSnackbar('Kategori berhasil ditambahkan');
    }
  } catch (error: any) {
    console.error('Error adding kategori:', error);
    errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan saat menambahkan kategori';
    showSnackbar(errorMessage.value, 'error');
  } finally {
    loading.value = false;
  }
};

const saveEditedKategori = async () => {
  if (editKategoriData.value.id === null) return;

  try {
    loading.value = true;
    errorMessage.value = '';
    const token = localStorage.getItem('token');
    
    const response = await axios.put(`/api/kategori-barang/${editKategoriData.value.id}`, {
      nama_kategori: editKategoriData.value.nama_kategori,
      deskripsi: editKategoriData.value.deskripsi
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Update local data
    const index = kategoriList.value.findIndex(k => k.id === editKategoriData.value.id);
    if (index !== -1) {
      kategoriList.value[index] = { ...kategoriList.value[index], ...response.data.data };
    }
    
    editDialog.value = false;
    showSnackbar('Kategori berhasil diperbarui');
  } catch (error: any) {
    console.error('Error saat update data:', error);
    errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan saat memperbarui data';
    showSnackbar(errorMessage.value, 'error');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchKategori);
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" md="12">
      <v-card elevation="0" variant="outlined" class="bg-surface overflow-hidden" rounded="lg">
        <v-card-item>
          <v-row class="align-center">
            <v-col cols="12">
              <div class="d-flex flex-wrap align-center gap-2">
                <v-text-field
                  v-model="searchTerm"
                  placeholder="Cari kategori..."
                  variant="outlined"
                  prepend-inner-icon="mdi-magnify"
                  density="compact"
                  hide-details
                  clearable
                  style="min-width: 200px; flex-grow: 1; max-width: 300px"
                  @keyup.esc="searchTerm = ''"
                ></v-text-field>

                <v-btn
                  variant="text"
                  color="secondary"
                  density="compact"
                  @click="showFilters = !showFilters"
                >
                  <v-icon icon="mdi-filter" class="mr-1"></v-icon>
                  Filter
                  <v-icon :icon="showFilters ? 'mdi-chevron-up' : 'mdi-chevron-down'" class="ml-1"></v-icon>
                </v-btn>
                
                <v-btn
                  color="secondary"
                  variant="text"
                  @click="resetFilters"
                  density="compact"
                  :disabled="!searchTerm"
                >
                  <v-icon icon="mdi-refresh" class="mr-1"></v-icon>
                  Reset
                </v-btn>

                <v-btn
                  color="primary"
                  variant="text"
                  @click="fetchKategori"
                  :loading="loading"
                  density="compact"
                >
                  <v-icon icon="mdi-refresh" class="mr-1"></v-icon>
                  Muat Ulang
                </v-btn>
              </div>
              
              <v-expand-transition>
                <div v-if="showFilters" class="mt-4">
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <div class="d-flex align-center">
                        <v-select
                          v-model="filters.searchField.value"
                          :items="filters.searchField.options"
                          item-title="title"
                          item-value="value"
                          variant="outlined"
                          density="compact"
                          hide-details
                          label="Cari berdasarkan"
                        ></v-select>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-expand-transition>
            </v-col>
          </v-row>
          
          <v-row class="mt-2">
            <v-col cols="12">
              <div class="d-flex justify-end">
                <v-dialog v-model="dialog" max-width="600">
                  <template v-slot:activator="{ props }">
                    <v-btn variant="flat" color="primary" rounded="md" v-bind="props">
                      <template v-slot:prepend>
                        <SvgSprite name="custom-plus" style="width: 20px; height: 20px" />
                      </template>
                      Tambah Kategori
                    </v-btn>
                  </template>
                  <v-card>
                    <perfect-scrollbar style="max-height: calc(100vh - 48px)">
                      <v-card-title class="pa-5">
                        <span class="text-h5">Kategori Baru</span>
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12">
                              <v-alert
                                v-if="errorMessage"
                                type="error"
                                class="mb-4"
                              >
                                {{ errorMessage }}
                              </v-alert>
                            </v-col>
                            <v-col cols="12">
                              <v-label class="mb-2">Nama Kategori</v-label>
                              <v-text-field
                                v-model="kategoriBaru.nama_kategori"
                                single-line
                                placeholder="Masukkan nama kategori"
                                hide-details
                                variant="outlined"
                                required
                                density="comfortable"
                                rounded="0"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                              <v-label class="mb-2">Deskripsi</v-label>
                              <v-textarea
                                v-model="kategoriBaru.deskripsi"
                                placeholder="Masukkan deskripsi kategori"
                                hide-details
                                variant="outlined"
                                density="comfortable"
                                rounded="0"
                                rows="3"
                              ></v-textarea>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" rounded="md" variant="text" @click="dialog = false"> Batal </v-btn>
                        <v-btn
                          color="primary"
                          rounded="md"
                          variant="flat"
                          @click="addKategori"
                          :loading="loading"
                        >
                          Tambah
                        </v-btn>
                      </v-card-actions>
                    </perfect-scrollbar>
                  </v-card>
                </v-dialog>
              </div>
            </v-col>
          </v-row>
        </v-card-item>
        
        <v-divider></v-divider>
        
        <v-card-text class="pa-0">
          <div v-if="filteredItems.length === 0 && !loading" class="pa-8 text-center">
            <v-icon icon="mdi-magnify" size="48" color="grey-lighten-1" class="mb-4"></v-icon>
            <h3 class="text-subtitle-1">Tidak ada data yang ditemukan</h3>
            <p class="text-body-2 text-grey">Coba ubah kriteria pencarian atau reset filter</p>
            <v-btn color="primary" variant="text" @click="resetFilters" class="mt-4">
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
          >
            <template #item-created_at="item">
              {{ item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : 'N/A' }}
            </template>
            
            <template #item-operation="item">
              <div class="d-flex gap-1">
                <v-btn
                   icon
                   color="secondary"
                   variant="text"
                   rounded="md"
                  @click="openViewDialog(item)"
                >
                  <SvgSprite name="custom-eye" style="width: 20px; height: 20px" />
                </v-btn>
                <v-btn
                   icon
                   color="primary"
                   variant="text"
                   rounded="md"
                  @click="openEditDialog(item)"
                >
                  <SvgSprite name="custom-edit-outline" style="width: 20px; height: 20px" />
                </v-btn>
                <v-btn
                   icon
                   color="error"
                   variant="text"
                   rounded="md"
                  @click="openDeleteDialog(item.id)"
                >
                  <SvgSprite name="custom-trash" style="width: 20px; height: 20px" />
                </v-btn>
              </div>
            </template>
          </EasyDataTable>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <!-- Dialog Konfirmasi Hapus -->
  <v-dialog v-model="deleteConfirmDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h5">
        Konfirmasi Hapus
      </v-card-title>
      <v-card-text>
        Apakah Anda yakin ingin menghapus kategori "<strong>{{ selectedKategori?.nama_kategori }}</strong>"? Tindakan ini tidak dapat dibatalkan.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" variant="text" @click="deleteConfirmDialog = false">
          Batal
        </v-btn>
        <v-btn color="error" variant="flat" @click="confirmDelete" :loading="deleteLoading">
          Hapus
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog View Detail -->
  <v-dialog v-model="viewDialog" max-width="600">
    <v-card>
      <v-card-title class="text-h5">
        Detail Kategori
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text v-if="selectedKategori">
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-label class="text-subtitle-2 text-medium-emphasis">ID</v-label>
              <div class="text-subtitle-1">{{ selectedKategori.id }}</div>
            </v-col>
            <v-col cols="12" md="6">
              <v-label class="text-subtitle-2 text-medium-emphasis">Nama Kategori</v-label>
              <div class="text-subtitle-1">{{ selectedKategori.nama_kategori }}</div>
            </v-col>
            <v-col cols="12">
              <v-label class="text-subtitle-2 text-medium-emphasis">Deskripsi</v-label>
              <div class="text-subtitle-1">{{ selectedKategori.deskripsi || 'Tidak ada deskripsi' }}</div>
            </v-col>
            <v-col cols="12" md="6" v-if="selectedKategori.created_at">
              <v-label class="text-subtitle-2 text-medium-emphasis">Tanggal Dibuat</v-label>
              <div class="text-subtitle-1">{{ new Date(selectedKategori.created_at).toLocaleDateString('id-ID') }}</div>
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

  <!-- Dialog Edit -->
  <v-dialog v-model="editDialog" max-width="600">
    <v-card>
      <perfect-scrollbar style="max-height: calc(100vh - 48px)">
        <v-card-title class="pa-5">
          <span class="text-h5">Edit Kategori</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-alert
                  v-if="errorMessage"
                  type="error"
                  class="mb-4"
                >
                  {{ errorMessage }}
                </v-alert>
              </v-col>
              <v-col cols="12">
                <v-label class="mb-2">Nama Kategori</v-label>
                <v-text-field
                  v-model="editKategoriData.nama_kategori"
                  single-line
                  placeholder="Masukkan nama kategori"
                  hide-details
                  variant="outlined"
                  required
                  density="comfortable"
                  rounded="0"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-label class="mb-2">Deskripsi</v-label>
                <v-textarea
                  v-model="editKategoriData.deskripsi"
                  placeholder="Masukkan deskripsi kategori"
                  hide-details
                  variant="outlined"
                  density="comfortable"
                  rounded="0"
                  rows="3"
                ></v-textarea>
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
            @click="saveEditedKategori"
            :loading="loading"
          >
            Simpan Perubahan
          </v-btn>
        </v-card-actions>
      </perfect-scrollbar>
    </v-card>
  </v-dialog>

  <!-- Snackbar untuk notifikasi -->
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="3000"
    location="top"
  >
    {{ snackbar.message }}
    <template v-slot:actions>
      <v-btn
        color="white"
        variant="text"
        @click="snackbar.show = false"
      >
        Tutup
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRatingStore } from '@/stores/apps/ranting';
import { useAuthStore } from '@/stores/auth';
import { useBarangStore } from '@/stores/apps/barang';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { Header } from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

// Page configuration
const page = ref({ title: 'Daftar Rating' });
const breadcrumbs = ref([
  { title: 'Rating', disabled: false, href: '#' },
  { title: 'List', disabled: true, href: '#' }
]);

// Store initialization
const ratingStore = useRatingStore();
const authStore = useAuthStore();
const barangStore = useBarangStore();

onMounted(async () => {
  await Promise.all([
    fetchRatings(),
    barangStore.ambilSemuaBarang()
  ]);
});

// Data fetching
onMounted(async () => {
  await fetchRatings();
});

const fetchRatings = async () => {
  try {
    await ratingStore.fetchRatings();
  } catch (error) {
    console.error('Failed to fetch ratings:', error);
    // You could add a toast/notification here
  }
};

// Filter system
const searchTerm = ref('');
const showFilters = ref(false);
const filters = ref({
  rating: {
    value: '',
    options: [
      { title: 'Semua Rating', value: '' },
      { title: '5 Bintang', value: '5' },
      { title: '4 Bintang', value: '4' },
      { title: '3 Bintang', value: '3' },
      { title: '2 Bintang', value: '2' },
      { title: '1 Bintang', value: '1' }
    ]
  },
  status: {
    value: '',
    options: [
      { title: 'Semua Status', value: '' },
      { title: 'Lunas', value: 'lunas' },
      { title: 'Belum Bayar', value: 'belum_bayar' }
    ]
  }
});

const resetFilters = () => {
  searchTerm.value = '';
  filters.value.rating.value = '';
  filters.value.status.value = '';
};

// Table configuration
const headers: Header[] = [
  { text: 'ID', value: 'id', sortable: true },
  { text: 'Barang', value: 'barang.nama_barang', sortable: true },
  { text: 'Rating', value: 'rating', sortable: true },
  { text: 'Komentar', value: 'komentar', sortable: true },
  { text: 'User', value: 'user.nama', sortable: true },
  { text: 'Tanggal', value: 'created_at', sortable: true },
  { text: 'Aksi', value: 'operation' }
];

const filteredItems = computed(() => {
  if (!ratingStore.ratings) return [];
  
  return [...ratingStore.ratings].filter(item => {
    // Apply rating filter
    if (filters.value.rating.value && item.rating !== Number(filters.value.rating.value)) {
      return false;
    }
    
    // Apply status filter
    if (filters.value.status.value && item.barang?.status_pembayaran !== filters.value.status.value) {
      return false;
    }
    
    // Apply search term
    if (searchTerm.value.trim()) {
      const searchTermLower = searchTerm.value.toLowerCase();
      return (
        item.barang?.nama_barang?.toLowerCase().includes(searchTermLower) ||
        item.user?.nama?.toLowerCase().includes(searchTermLower) ||
        item.komentar?.toLowerCase().includes(searchTermLower)
      );
    }
    
    return true;
  });
});

// Dialog controls
const dialog = ref({
  view: false,
  edit: false,
  delete: false,
  create: false
});

// Form data
const form = ref({
  create: {
    barang_id: '',
    rating: 5,
    komentar: ''


  },
  edit: {
    id: null as number | null,
    rating: 5,
    komentar: ''
  },
  deleteId: null as number | null
});

const productOptions = computed(() => {
  return barangStore.barangList.map(barang => ({
    title: barang.nama_barang,
    value: barang.id.toString()
  }));
});

const currentRating = ref<any>(null);

// Rating operations
const openEditDialog = (rating: any) => {
  form.value.edit = {
    id: rating.id,
    rating: rating.rating,
    komentar: rating.komentar
  };
  dialog.value.edit = true;
};

const openDeleteDialog = (id: number) => {
  form.value.deleteId = id;
  dialog.value.delete = true;
};

const openViewDialog = (rating: any) => {
  currentRating.value = rating;
  dialog.value.view = true;
};

// CRUD Operations
const createRating = async () => {
  try {
    await ratingStore.createRating({
      user_id: authStore.user?.id || 0,
      barang_id: Number(form.value.create.barang_id),
      rating: form.value.create.rating,
      komentar: form.value.create.komentar
    });

    await fetchRatings();
    dialog.value.create = false;
    resetCreateForm();
    // Show success notification here
  } catch (error) {
    console.error('Error creating rating:', error);
    // Show error notification here
  }
};

const updateRating = async () => {
  if (form.value.edit.id !== null) {
    try {
      await ratingStore.updateRating(form.value.edit.id, {
        rating: form.value.edit.rating,
        komentar: form.value.edit.komentar
      });
      
      await fetchRatings();
      dialog.value.edit = false;
      // Show success notification here
    } catch (error) {
      console.error('Error updating rating:', error);
      // Show error notification here
    }
  }
};

const deleteRating = async () => {
  if (form.value.deleteId !== null) {
    try {
      await ratingStore.deleteRating(form.value.deleteId);
      await fetchRatings();
      dialog.value.delete = false;
      // Show success notification here
    } catch (error) {
      console.error('Error deleting rating:', error);
      // Show error notification here
    }
  }
};

// Helpers
const resetCreateForm = () => {
  form.value.create = {
    barang_id: '',
    rating: 5,
    komentar: ''
  };
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'Invalid Date';
  
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return 'Invalid Date';
  }
};
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  
  <v-row>
    <v-col cols="12">
      <v-card elevation="0" variant="outlined" class="bg-surface overflow-hidden" rounded="lg">
        <v-card-item>
          <!-- Search and Filter Section -->
          <v-row class="align-center">
            <v-col cols="12">
              <div class="d-flex flex-wrap align-center gap-2">
                <v-text-field
                  v-model="searchTerm"
                  placeholder="Cari rating..."
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
                  :disabled="!searchTerm && !filters.rating.value && !filters.status.value"
                >
                  <v-icon icon="mdi-refresh" class="mr-1"></v-icon>
                  Reset
                </v-btn>
              </div>
              
              <!-- Filter Options -->
              <v-expand-transition>
                <div v-if="showFilters" class="mt-4">
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="filters.rating.value"
                        :items="filters.rating.options"
                        item-title="title"
                        item-value="value"
                        variant="outlined"
                        density="compact"
                        hide-details
                        label="Filter Rating"
                      ></v-select>
                    </v-col>
                    
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="filters.status.value"
                        :items="filters.status.options"
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
            </v-col>
          </v-row>
          
          <!-- Add Rating Button -->
          <v-row class="mt-2">
            <v-col cols="12">
              <div class="d-flex justify-end">
                <v-dialog v-model="dialog.create" max-width="600">
                  <template v-slot:activator="{ props }">
                    <v-btn variant="flat" color="primary" rounded="md" v-bind="props">
                      <template v-slot:prepend>
                        <SvgSprite name="custom-plus" style="width: 20px; height: 20px" />
                      </template>
                      Tambah Rating
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title class="pa-5">
                      <span class="text-h5">Rating Baru</span>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <v-select
                              v-model="form.create.barang_id"
                              :items="productOptions"
                              item-title="title"
                              item-value="value"
                              label="Pilih Barang"
                              variant="outlined"
                              required
                              :rules="[v => !!v || 'Barang harus dipilih']"
                            ></v-select>
                          </v-col>
                          <v-col cols="12">
                            <v-label class="mb-2">Rating</v-label>
                            <v-rating
                              v-model="form.create.rating"
                              color="amber"
                              half-increments
                              size="large"
                            ></v-rating>
                          </v-col>
                          
                          <v-col cols="12">
                            <v-textarea
                              v-model="form.create.komentar"
                              label="Komentar"
                              variant="outlined"
                              rows="3"
                              required
                              :rules="[v => !!v || 'Komentar harus diisi']"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="error" rounded="md" variant="text" @click="dialog.create = false">
                        Batal
                      </v-btn>
                      <v-btn
                        color="primary"
                        rounded="md"
                        variant="flat"
                        @click="createRating"
                        :loading="ratingStore.loading"
                      >
                        Simpan
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
            </v-col>
          </v-row>
        </v-card-item>
        
        <v-divider></v-divider>
        
        <!-- Data Table -->
        <v-card-text class="pa-0">
          <div v-if="filteredItems.length === 0" class="pa-8 text-center">
            <v-icon icon="mdi-magnify" size="48" color="grey-lighten-1" class="mb-4"></v-icon>
            <h3 class="text-subtitle-1">Tidak ada data rating yang ditemukan</h3>
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
            <template #item-rating="item">
              <v-rating
                :model-value="item.rating"
                readonly
                half-increments
                color="amber"
                density="compact"
                size="small"
              ></v-rating>
              <span class="text-caption ms-2">{{ item.rating }}</span>
            </template>
            
            <template #item-created_at="item">
              {{ formatDate(item.created_at) }}
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

  <!-- Delete Confirmation Dialog -->
  <v-dialog v-model="dialog.delete" max-width="400">
    <v-card>
      <v-card-title class="text-h5">
        Konfirmasi Hapus
      </v-card-title>
      <v-card-text>
        Apakah Anda yakin ingin menghapus rating ini? Tindakan ini tidak dapat dibatalkan.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" variant="text" @click="dialog.delete = false">
          Batal
        </v-btn>
        <v-btn color="error" variant="flat" @click="deleteRating" :loading="ratingStore.loading">
          Hapus
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Edit Rating Dialog -->
  <v-dialog v-model="dialog.edit" max-width="600">
    <v-card>
      <v-card-title class="pa-5">
        <span class="text-h5">Edit Rating</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-label class="mb-2">Rating</v-label>
              <v-rating
                v-model="form.edit.rating"
                color="amber"
                half-increments
                size="large"
              ></v-rating>
            </v-col>
            
            <v-col cols="12">
              <v-textarea
                v-model="form.edit.komentar"
                label="Komentar"
                variant="outlined"
                rows="3"
                required
                :rules="[v => !!v || 'Komentar harus diisi']"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" rounded="md" variant="text" @click="dialog.edit = false">
          Batal
        </v-btn>
        <v-btn
          color="primary"
          rounded="md"
          variant="flat"
          @click="updateRating"
          :loading="ratingStore.loading"
        >
          Simpan Perubahan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- View Rating Dialog -->
  <v-dialog v-model="dialog.view" max-width="600">
    <v-card>
      <v-card-title class="pa-5">
        <span class="text-h5">Detail Rating</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-label class="text-subtitle-2 text-medium-emphasis">Barang</v-label>
              <div class="text-subtitle-1">{{ currentRating?.barang?.nama_barang }}</div>
            </v-col>
            
            <v-col cols="12">
              <v-label class="text-subtitle-2 text-medium-emphasis">Rating</v-label>
              <div class="d-flex align-center">
                <v-rating
                  :model-value="currentRating?.rating"
                  readonly
                  half-increments
                  color="amber"
                  size="small"
                ></v-rating>
                <span class="text-subtitle-1 ms-2">{{ currentRating?.rating }}</span>
              </div>
            </v-col>
            
            <v-col cols="12">
              <v-label class="text-subtitle-2 text-medium-emphasis">Komentar</v-label>
              <div class="text-subtitle-1">{{ currentRating?.komentar }}</div>
            </v-col>
            
            <v-col cols="12">
              <v-label class="text-subtitle-2 text-medium-emphasis">User</v-label>
              <div class="text-subtitle-1">{{ currentRating?.user?.nama }}</div>
            </v-col>
            
            <v-col cols="12">
              <v-label class="text-subtitle-2 text-medium-emphasis">Tanggal</v-label>
              <div class="text-subtitle-1">{{ formatDate(currentRating?.created_at) }}</div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="flat" @click="dialog.view = false">
          Tutup
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.customize-table {
  --easy-table-header-font-size: 14px;
  --easy-table-header-height: 50px;
  --easy-table-row-height: 50px;
}

.v-table {
  width: 100%;
  border-collapse: collapse;
}

.v-table th {
  font-weight: 600;
  background-color: rgba(0, 0, 0, 0.02);
}

.v-table td, .v-table th {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.v-table tr:hover td {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>
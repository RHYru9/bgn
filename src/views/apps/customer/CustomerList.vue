<script setup lang="ts">
import { ref, computed, onMounted, shallowRef } from 'vue';
import { useCustomers } from '@/stores/apps/customers';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { Header, Item } from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

const page = ref({ title: 'Customer list' });
const breadcrumbs = shallowRef([
  { title: 'Customer', disabled: false, href: '#' },
  { title: 'List', disabled: true, href: '#' }
]);

const store = useCustomers();
const getCustomers = computed(() => store.getCustomers);

onMounted(() => {
  store.fetchCustomers();
});

// Advanced Filter System
const searchTerm = ref('');
const showFilters = ref(false);
const filters = ref({
  role: {
    value: '',
    include: true,
    options: [
      { title: 'Semua Role', value: '' },
      { title: 'Admin', value: 'admin' },
      { title: 'User', value: 'user' },
      { title: 'Driver', value: 'driver' }
    ]
  },
  searchField: {
    value: 'nama',
    options: [
      { title: 'Nama', value: 'nama' },
      { title: 'Email', value: 'email' },
      { title: 'No HP', value: 'no_hp' },
      { title: 'Alamat', value: 'alamat' }
    ]
  }
});

// Table headers
const headers: Header[] = [
  { text: 'ID', value: 'id', sortable: true },
  { text: 'Nama User', value: 'nama', sortable: true },
  { text: 'Email', value: 'email', sortable: true },
  { text: 'No HP', value: 'no_hp', sortable: true },
  { text: 'Alamat', value: 'alamat', sortable: true },
  { text: 'Kode Pos', value: 'kode_pos', sortable: true },
  { text: 'Role', value: 'role', sortable: true },
  { text: 'Aksi', value: 'operation' }
];

// Advanced filtering logic
const filteredItems = computed(() => {
  if (!getCustomers.value) return [];
  
  return getCustomers.value.filter(item => {
    // Apply role filter
    if (filters.value.role.value) {
      const match = item.role === filters.value.role.value;
      if (filters.value.role.include ? !match : match) return false;
    }
    
    // Apply search term
    if (searchTerm.value.trim()) {
      const fieldValue = item[filters.value.searchField.value];
      if (!fieldValue) return false;
      return String(fieldValue).toLowerCase().includes(searchTerm.value.toLowerCase().trim());
    }
    
    return true;
  });
});

// Reset all filters
const resetFilters = () => {
  searchTerm.value = '';
  filters.value.role.value = '';
};

// For loading states
const loading = ref(false);
const error = ref('');

// Dialogs
const dialog = ref(false);
const viewDialog = ref(false);
const editDialog = ref(false);
const deleteConfirmDialog = ref(false);

// Form data
const customerBaru = ref({
  nama: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const editCustomerData = ref({
  id: null as number | null,
  nama: '',
  email: '',
  password: '',
  password_confirmation: '',
  no_hp: '',
  alamat: '',
  kode_pos: ''
});

const hapusCustomer = ref<number | null>(null);

// Methods
const openDeleteDialog = (id: number) => {
  hapusCustomer.value = id;
  deleteConfirmDialog.value = true;
};

const confirmDelete = async () => {
  if (hapusCustomer.value !== null) {
    try {
      loading.value = true;
      await store.deleteCustomer(hapusCustomer.value);
      deleteConfirmDialog.value = false;
      hapusCustomer.value = null;
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      loading.value = false;
    }
  }
};

const openViewDialog = async (id: number) => {
  try {
    loading.value = true;
    await store.fetchCustomer(id);
    viewDialog.value = true;
  } catch (error) {
    console.error('Failed to fetch customer:', error);
  } finally {
    loading.value = false;
  }
};

const openEditDialog = async (id: number) => {
  try {
    loading.value = true;
    const customer = await store.fetchCustomer(id);
    if (customer) {
      editCustomerData.value = {
        id: customer.id,
        nama: customer.nama,
        email: customer.email,
        password: '',
        password_confirmation: '',
        no_hp: customer.no_hp || '',
        alamat: customer.alamat || '',
        kode_pos: customer.kode_pos || ''
      };
      editDialog.value = true;
    }
  } catch (error) {
    console.error('Failed to fetch customer for edit:', error);
  } finally {
    loading.value = false;
  }
};

const addCustomer = async () => {
  try {
    loading.value = true;
    error.value = '';
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token tidak ditemukan');
    
    const response = await axios.post('http://localhost:8000/api/auth/register', customerBaru.value, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 201) {
      store.customers.push(response.data.data);
      dialog.value = false;
      customerBaru.value = {
        nama: '',
        email: '',
        password: '',
        password_confirmation: ''
      };
    }
  } catch (error: any) {
    console.error('Error adding customer:', error);
    error.value = error.response?.data?.message || 'Terjadi kesalahan saat menambahkan customer';
  } finally {
    loading.value = false;
  }
};

const saveEditedCustomer = async () => {
  if (editCustomerData.value.id === null) return;

  try {
    loading.value = true;
    error.value = '';
    const dataToSend: any = {
      nama: editCustomerData.value.nama,
      email: editCustomerData.value.email,
      no_hp: editCustomerData.value.no_hp,
      alamat: editCustomerData.value.alamat,
      kode_pos: editCustomerData.value.kode_pos
    };
    
    if (editCustomerData.value.password) {
      dataToSend.password = editCustomerData.value.password;
      dataToSend.password_confirmation = editCustomerData.value.password_confirmation;
    }
    
    await store.updateCustomer(editCustomerData.value.id, dataToSend);
    editDialog.value = false;
  } catch (error: any) {
    console.error('Error saat update data:', error);
    error.value = error.response?.data?.message || 'Terjadi kesalahan saat memperbarui data';
  } finally {
    loading.value = false;
  }
};
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
                  placeholder="Cari customer..."
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
                  :disabled="!searchTerm && !filters.role.value"
                >
                  <v-icon icon="mdi-refresh" class="mr-1"></v-icon>
                  Reset
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
                    
                    <v-col cols="12" sm="6" md="4">
                      <div class="d-flex align-center gap-2">
                        <v-select
                          v-model="filters.role.value"
                          :items="filters.role.options"
                          item-title="title"
                          item-value="value"
                          variant="outlined"
                          density="compact"
                          hide-details
                          label="Role"
                        ></v-select>
                        <v-switch
                          v-model="filters.role.include"
                          :label="filters.role.include ? 'Include' : 'Exclude'"
                          density="compact"
                          hide-details
                          color="primary"
                        ></v-switch>
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
                      Tambah Customer
                    </v-btn>
                  </template>
                  <v-card>
                    <perfect-scrollbar style="max-height: calc(100vh - 48px)">
                      <v-card-title class="pa-5">
                        <span class="text-h5">Customer Baru</span>
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
                                <img src="@/assets/images/users/avatar-1.png" width="72" alt="profile" />
                                <input type="file" aria-label="upload" class="preview-upload" />
                              </v-avatar>
                            </v-col>
                            <v-col md="9" cols="12">
                              <v-row>
                                <v-col cols="12">
                                  <v-label class="mb-2">Nama</v-label>
                                  <v-text-field
                                    v-model="customerBaru.nama"
                                    single-line
                                    placeholder="Enter customer name"
                                    hide-details
                                    variant="outlined"
                                    required
                                    density="comfortable"
                                    rounded="0"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                  <v-label class="mb-2">Email</v-label>
                                  <v-text-field
                                    v-model="customerBaru.email"
                                    single-line
                                    type="email"
                                    hide-details
                                    placeholder="Enter customer email"
                                    required
                                    variant="outlined"
                                    density="comfortable"
                                    rounded="0"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                  <v-label class="mb-2">Password</v-label>
                                  <v-text-field
                                    v-model="customerBaru.password"
                                    single-line
                                    type="password"
                                    hide-details
                                    placeholder="Enter password"
                                    required
                                    variant="outlined"
                                    density="comfortable"
                                    rounded="0"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                  <v-label class="mb-2">Konfirmasi Password</v-label>
                                  <v-text-field
                                    v-model="customerBaru.password_confirmation"
                                    single-line
                                    type="password"
                                    hide-details
                                    placeholder="Confirm password"
                                    required
                                    variant="outlined"
                                    density="comfortable"
                                    rounded="0"
                                  ></v-text-field>
                                </v-col>
                              </v-row>
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
                          @click="addCustomer"
                          :loading="loading"
                        >
                          Add
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
          <div v-if="filteredItems.length === 0" class="pa-8 text-center">
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
            <template #item-operation="item">
              <div class="d-flex gap-1">
                <v-btn
                   icon
                   color="secondary"
                   variant="text"
                   rounded="md"
                  @click="openViewDialog(item.id)"
                >
                  <SvgSprite name="custom-eye" style="width: 20px; height: 20px" />
                </v-btn>
                <v-btn
                   icon
                   color="primary"
                   variant="text"
                   rounded="md"
                  @click="openEditDialog(item.id)"
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

  <v-dialog v-model="deleteConfirmDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h5">
        Confirm Delete
      </v-card-title>
      <v-card-text>
        Apakah Anda yakin ingin menghapus User ini? Tindakan ini tidak dapat dibatalkan.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" variant="text" @click="deleteConfirmDialog = false">
          Cancel
        </v-btn>
        <v-btn color="error" variant="flat" @click="confirmDelete" :loading="loading">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="viewDialog" max-width="600">
    <v-card>
      <v-card-title class="text-h5">
        Customer Detail
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text v-if="store.currentCustomer">
        <v-container>
          <v-row>
            <v-col cols="12" md="4" class="text-center">
              <v-avatar size="120" color="primary" class="mb-4">
                <img src="@/assets/images/users/avatar-1.png" alt="Profile" />
              </v-avatar>
            </v-col>
            <v-col cols="12" md="8">
              <v-row>
                <v-col cols="12" md="6">
                  <v-label class="text-subtitle-2 text-medium-emphasis">Nama</v-label>
                  <div class="text-subtitle-1">{{ store.currentCustomer.nama }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="text-subtitle-2 text-medium-emphasis">Email</v-label>
                  <div class="text-subtitle-1">{{ store.currentCustomer.email }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="text-subtitle-2 text-medium-emphasis">No HP.</v-label>
                  <div class="text-subtitle-1">{{ store.currentCustomer.no_hp || 'N/A' }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="text-subtitle-2 text-medium-emphasis">Role</v-label>
                  <div class="text-subtitle-1">{{ store.currentCustomer.role }}</div>
                </v-col>
                <v-col cols="12">
                  <v-label class="text-subtitle-2 text-medium-emphasis">Alamat</v-label>
                  <div class="text-subtitle-1">{{ store.currentCustomer.alamat || 'N/A' }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="text-subtitle-2 text-medium-emphasis">Kode Pos</v-label>
                  <div class="text-subtitle-1">{{ store.currentCustomer.kode_pos || 'N/A' }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="text-subtitle-2 text-medium-emphasis">Anggota Sejak</v-label>
                  <div class="text-subtitle-1">{{ new Date(store.currentCustomer.created_at).toLocaleDateString() }}</div>
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

  <v-dialog v-model="editDialog" max-width="800" class="customer-modal">
    <v-card>
      <perfect-scrollbar style="max-height: calc(100vh - 48px)">
        <v-card-title class="pa-5">
          <span class="text-h5">Edit Customer</span>
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
                  <img src="@/assets/images/users/avatar-1.png" width="72" alt="profile" />
                  <input type="file" aria-label="upload" class="preview-upload" />
                </v-avatar>
              </v-col>
              <v-col md="9" cols="12">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-label class="mb-2">Nama</v-label>
                    <v-text-field
                      v-model="editCustomerData.nama"
                      single-line
                      placeholder="Enter customer name"
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
                      v-model="editCustomerData.email"
                      single-line
                      type="email"
                      hide-details
                      placeholder="Enter customer email"
                      required
                      variant="outlined"
                      density="comfortable"
                      rounded="0"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-label class="mb-2">No HP.</v-label>
                    <v-text-field
                      v-model="editCustomerData.no_hp"
                      single-line
                      hide-details
                      placeholder="Enter phone number"
                      variant="outlined"
                      density="comfortable"
                      rounded="0"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-label class="mb-2">Kode Pos</v-label>
                    <v-text-field
                      v-model="editCustomerData.kode_pos"
                      single-line
                      hide-details
                      placeholder="Enter postal code"
                      variant="outlined"
                      density="comfortable"
                      rounded="0"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-label class="mb-2">Alamat</v-label>
                    <v-text-field
                      v-model="editCustomerData.alamat"
                      single-line
                      hide-details
                      placeholder="Enter address"
                      variant="outlined"
                      density="comfortable"
                      rounded="0"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-label class="mb-2">Biarkan Sandi = tidak ingin mengubah.</v-label>
                    <v-text-field
                      v-model="editCustomerData.password"
                      single-line
                      type="password"
                      hide-details
                      placeholder="Enter new password"
                      variant="outlined"
                      density="comfortable"
                      rounded="0"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-label class="mb-2">Konfirmasi Password</v-label>
                    <v-text-field
                      v-model="editCustomerData.password_confirmation"
                      single-line
                      type="password"
                      hide-details
                      placeholder="Confirm new password"
                      variant="outlined"
                      density="comfortable"
                      rounded="0"
                    ></v-text-field>
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
            @click="saveEditedCustomer"
            :loading="loading"
          >
            Save Changes
          </v-btn>
        </v-card-actions>
      </perfect-scrollbar>
    </v-card>
  </v-dialog>
</template>
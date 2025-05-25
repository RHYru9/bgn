<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSuppliers } from '@/stores/apps/supplier';
import { useAuthStore } from '@/stores/auth';
import SvgSprite from '@/components/shared/SvgSprite.vue';

const router = useRouter();
const authStore = useAuthStore();
const supplierStore = useSuppliers();

const loading = ref(false);
const errors = ref<Record<string, string[]>>({});
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref<'success' | 'error'>('success');
const unauthorized = ref(false);

const form = ref({
  nama: '',
  alamat: '',
  no_telp: '',
  kategori: '',
  kode_pos: '',
  email: '',
  kontak_person: '',
});

const showSnackbar = (text: string, color: 'success' | 'error' = 'success') => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
};

const submitForm = async () => {
  errors.value = {};
  loading.value = true;
  unauthorized.value = false;

  console.log('Submitting data:', form.value); // Debug log

  try {
    const response = await supplierStore.createSupplier(form.value);
    console.log('API Response:', response); // Debug log
    
    showSnackbar('Supplier berhasil ditambahkan', 'success');
    
    // Optional: Reset form after successful submission
    form.value = {
      nama: '',
      alamat: '',
      no_telp: '',
      kategori: '',
      kode_pos: '',
      email: '',
      kontak_person: '',
    };
    
    // Comment out if you don't want automatic redirect
    // await router.push('/suppliers');
    
  } catch (error: any) {
    console.error('Full error:', error); // Detailed error logging
    
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors;
      showSnackbar('Terdapat kesalahan dalam form', 'error');
    } else if (error.response?.status === 401) {
      unauthorized.value = true;
      showSnackbar('Sesi telah berakhir, silakan login kembali', 'error');
      authStore.logout();
      await router.push('/login');
    } else {
      const errorMsg = error.response?.data?.message || 
                      error.message || 
                      'Gagal menambahkan supplier';
      showSnackbar(errorMsg, 'error');
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
  }
});
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-card variant="outlined" rounded="lg">
        <v-card-title class="pa-6 pb-0 d-flex align-center">
          <v-avatar size="40" color="primary" variant="tonal" class="me-3">
            <SvgSprite name="custom-supplier" style="width: 20px; height: 20px" />
          </v-avatar>
          <h5 class="text-h5">Tambah Supplier Baru</h5>
        </v-card-title>
        
        <v-divider />

        <v-card-text class="pa-6">
          <v-form @submit.prevent="submitForm">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.nama"
                  label="Nama Supplier"
                  variant="outlined"
                  density="comfortable"
                  :error-messages="errors.nama"
                  required
                  clearable
                />
                <v-text-field
                  v-model="form.kontak_person"
                  label="Kontak Person"
                  variant="outlined"
                  density="comfortable"
                  :error-messages="errors.kontak_person"
                  required
                  clearable
                />
                <v-text-field
                  v-model="form.no_telp"
                  label="No. Telepon"
                  variant="outlined"
                  density="comfortable"
                  :error-messages="errors.no_telp"
                  required
                  clearable
                />
                <v-text-field
                  v-model="form.email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  density="comfortable"
                  :error-messages="errors.email"
                  clearable
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.kategori"
                  label="Kategori"
                  variant="outlined"
                  density="comfortable"
                  :error-messages="errors.kategori"
                  clearable
                />
                <v-text-field
                  v-model="form.kode_pos"
                  label="Kode Pos"
                  variant="outlined"
                  density="comfortable"
                  :error-messages="errors.kode_pos"
                  required
                  clearable
                />
                <v-textarea
                  v-model="form.alamat"
                  label="Alamat"
                  variant="outlined"
                  density="comfortable"
                  :error-messages="errors.alamat"
                  rows="4"
                  required
                  clearable
                />
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>

            <div class="d-flex justify-end gap-2">
              <v-btn
                color="secondary"
                variant="outlined"
                :disabled="loading"
                @click="() => router.push('/suppliers')"
              >
                Batal
              </v-btn>
              <v-btn
                color="primary"
                variant="flat"
                type="submit"
                :loading="loading"
              >
                <v-icon left>mdi-content-save</v-icon>
                Simpan Supplier
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

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
.gap-2 {
  gap: 8px;
}
.me-3 {
  margin-right: 12px;
}
</style>
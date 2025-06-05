<script setup lang="ts">
import { ref, onMounted } from 'vue'
import userAvatar from '@/assets/images/users/avatar-1.png'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/apps/profile'
import type { UpdateProfilePayload } from '@/types/user'

const authStore = useAuthStore()
const profileStore = useProfileStore()

const formData = ref<UpdateProfilePayload>({
  nama: '',
  email: '',
  alamat: '',
  no_hp: '',
  kode_pos: ''
})

const isLoading = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')

// Load initial data
onMounted(async () => {
  try {
    isLoading.value = true
    await profileStore.getProfile()
    
    if (profileStore.user) {
      formData.value = {
        nama: profileStore.user.nama || '',
        email: profileStore.user.email || '',
        alamat: profileStore.user.alamat || '',
        no_hp: profileStore.user.no_hp || '',
        kode_pos: profileStore.user.kode_pos || ''
      }
    }
  } catch (error) {
    errorMessage.value = 'Gagal memuat data profil'
    console.error('Error loading profile:', error)
  } finally {
    isLoading.value = false
  }
})

// Handle update profile
const handleUpdate = async () => {
  try {
    isLoading.value = true
    isSuccess.value = false
    errorMessage.value = ''
    
    // Pastikan hanya field yang diperlukan yang dikirim
    const payload: UpdateProfilePayload = {
      nama: formData.value.nama,
      email: formData.value.email,
      alamat: formData.value.alamat,
      no_hp: formData.value.no_hp,
      kode_pos: formData.value.kode_pos
    }


    const updatedUser = await profileStore.updateProfile(payload)
    
    // Update auth store dengan data terbaru - periksa apakah method setUser ada
    if (authStore.user && typeof authStore.setUser === 'function') {
      const updatedAuthUser = { ...authStore.user, ...updatedUser }
      authStore.setUser(updatedAuthUser)
    } else if (authStore.user) {
      // Jika setUser tidak ada, update langsung property user
      Object.assign(authStore.user, updatedUser)
    }
    
    isSuccess.value = true
    setTimeout(() => isSuccess.value = false, 3000)
    
    // Clear password field setelah berhasil update
    formData.value.password = ''
    
  } catch (error) {
    console.error('Update profile error:', error)
    errorMessage.value = 'Gagal memperbarui profil'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12" md="4">
      <v-card variant="flat" rounded="lg">
        <v-card variant="outlined" rounded="lg">
          <div class="pa-6">
            <h5 class="text-subtitle-1 mb-0">Foto Profil</h5>
          </div>
          <v-divider></v-divider>
          <v-card-text class="text-center">
            <img :src="userAvatar" width="100" class="rounded-md" alt="foto profil" />
            <p class="text-subtitle-2 text-disabled font-weight-medium my-4">Unggah atau ganti foto profil Anda</p>
            <v-btn color="primary" rounded="md" variant="flat" size="small">Unggah Avatar</v-btn>
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>
    <v-col cols="12" md="8">
      <v-card variant="flat" rounded="lg">
        <v-card variant="outlined" rounded="lg">
          <div class="px-5 py-6">
            <h5 class="text-subtitle-1 mb-0">Edit Detail Akun</h5>
          </div>
          <v-divider></v-divider>
          <v-card-text>
            <v-alert
              v-if="isSuccess"
              type="success"
              variant="tonal"
              class="mb-4"
            >
              Profil berhasil diperbarui!
            </v-alert>
            
            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              class="mb-4"
            >
              {{ errorMessage }}
            </v-alert>
            
            <v-row>
              <v-col cols="12">
                <v-label class="mb-2">Nama Lengkap</v-label>
                <v-text-field
                  type="text"
                  v-model="formData.nama"
                  placeholder="Masukkan nama lengkap"
                  single-line
                  density="comfortable"
                  color="primary"
                  variant="outlined"
                  :disabled="isLoading"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-label class="mb-2">Alamat Email</v-label>
                <v-text-field
                  type="email"
                  v-model="formData.email"
                  placeholder="Masukkan email Anda"
                  single-line
                  density="comfortable"
                  color="primary"
                  variant="outlined"
                  :disabled="isLoading"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-label class="mb-2">Alamat</v-label>
                <v-text-field
                  type="text"
                  v-model="formData.alamat"
                  placeholder="Masukkan alamat"
                  single-line
                  density="comfortable"
                  color="primary"
                  variant="outlined"
                  :disabled="isLoading"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2">Nomor HP</v-label>
                <v-text-field
                  type="text"
                  v-model="formData.no_hp"
                  placeholder="Masukkan nomor HP"
                  single-line
                  density="comfortable"
                  color="primary"
                  variant="outlined"
                  :disabled="isLoading"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2">Kode Pos</v-label>
                <v-text-field
                  type="text"
                  v-model="formData.kode_pos"
                  placeholder="Masukkan kode pos"
                  single-line
                  density="comfortable"
                  color="primary"
                  variant="outlined"
                  :disabled="isLoading"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-btn
              color="primary"
              rounded="md"
              variant="flat"
              class="mt-5"
              :loading="isLoading"
              @click="handleUpdate"
            >
              {{ isLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>
  </v-row>
</template>
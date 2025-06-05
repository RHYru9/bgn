<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProfileStore } from '@/stores/apps/profile'
import { useAuthStore } from '@/stores/auth' // Untuk logout setelah delete akun
import { useRouter } from 'vue-router'

const profileStore = useProfileStore()
const authStore = useAuthStore()
const router = useRouter()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const errors = ref({
  current: '',
  new: '',
  confirm: ''
})

const isLoading = ref(false)
const isDeleting = ref(false)
const showDeleteDialog = ref(false)
const deleteConfirmPassword = ref('')
const deleteError = ref('')

const showSuccessAlert = ref(false)
const showErrorAlert = ref(false)
const successMessage = ref('')
const generalErrorMessage = ref('')

const validate = () => {
  let valid = true
  errors.value = {
    current: '',
    new: '',
    confirm: ''
  }

  if (!currentPassword.value) {
    errors.value.current = 'Kata sandi saat ini wajib diisi.'
    valid = false
  }

  if (!newPassword.value) {
    errors.value.new = 'Kata sandi baru wajib diisi.'
    valid = false
  } else if (newPassword.value.length < 8) {
    errors.value.new = 'Kata sandi minimal 8 karakter.'
    valid = false
  }

  if (confirmPassword.value !== newPassword.value) {
    errors.value.confirm = 'Konfirmasi kata sandi tidak cocok.'
    valid = false
  }

  return valid
}

const handleSubmit = async () => {
  if (!validate()) return

  // Reset notifications
  showSuccessAlert.value = false
  showErrorAlert.value = false
  generalErrorMessage.value = ''

  isLoading.value = true
  try {
    await profileStore.updatePassword(currentPassword.value, newPassword.value)

    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''

    successMessage.value = 'Kata sandi berhasil diubah!'
    showSuccessAlert.value = true

    setTimeout(() => {
      showSuccessAlert.value = false
    }, 5000)
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error updating password:', error.message)
    }

    if (profileStore.error) {
      if (
        profileStore.error.includes('Password lama tidak benar') ||
        profileStore.error.includes('Old password is incorrect')
      ) {
        errors.value.current = 'Kata sandi saat ini salah'
      } else if (profileStore.error.includes('password')) {
        errors.value.new = profileStore.error
      } else {
        generalErrorMessage.value = profileStore.error
        showErrorAlert.value = true
      }
    } else {
      generalErrorMessage.value = 'Terjadi kesalahan saat mengubah kata sandi'
      showErrorAlert.value = true
    }
  } finally {
    isLoading.value = false
  }
}

const openDeleteDialog = () => {
  showDeleteDialog.value = true
  deleteConfirmPassword.value = ''
  deleteError.value = ''
}

const closeDeleteDialog = () => {
  showDeleteDialog.value = false
  deleteConfirmPassword.value = ''
  deleteError.value = ''
}

const handleDeleteAccount = async () => {
  if (!deleteConfirmPassword.value) {
    deleteError.value = 'Kata sandi wajib diisi untuk konfirmasi'
    return
  }

  isDeleting.value = true
  try {
    await profileStore.deleteOwnAccount(deleteConfirmPassword.value)
    closeDeleteDialog()

    if (authStore && authStore.logout) {
      await authStore.logout()
    }
    router.push('/auth/login')
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error deleting account:', error.message)
    }
    if (profileStore.error) {
      deleteError.value = profileStore.error
    } else {
      deleteError.value = 'Gagal menghapus akun'
    }
  } finally {
    isDeleting.value = false
  }
}

const storeLoading = computed(() => profileStore.loading)
</script>

<template>
  <v-row>
    <v-col cols="12" md="8">
      <v-card variant="flat" rounded="lg">
        <v-card variant="outlined" rounded="lg">
          <div class="px-5 py-6">
            <h5 class="text-subtitle-1 mb-0">Ubah Kata Sandi</h5>
          </div>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-label class="mb-2">Kata sandi saat ini</v-label>
                <v-text-field
                  v-model="currentPassword"
                  :error-messages="errors.current"
                  type="password"
                  placeholder="Masukkan kata sandi saat ini"
                  density="comfortable"
                  color="primary"
                  variant="outlined"
                  :disabled="isLoading || storeLoading"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-label class="mb-2">Kata sandi baru</v-label>
                <v-text-field
                  v-model="newPassword"
                  :error-messages="errors.new"
                  type="password"
                  placeholder="Masukkan kata sandi baru"
                  density="comfortable"
                  color="primary"
                  variant="outlined"
                  :disabled="isLoading || storeLoading"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-label class="mb-2">Ulangi kata sandi baru</v-label>
                <v-text-field
                  v-model="confirmPassword"
                  :error-messages="errors.confirm"
                  type="password"
                  placeholder="Masukkan konfirmasi kata sandi"
                  density="comfortable"
                  color="primary"
                  variant="outlined"
                  :disabled="isLoading || storeLoading"
                />
              </v-col>
            </v-row>

            <!-- Success Alert -->
            <v-alert
              v-if="showSuccessAlert"
              type="success"
              variant="tonal"
              class="mt-3"
              closable
              @click:close="showSuccessAlert = false"
            >
              {{ successMessage }}
            </v-alert>

            <!-- Error Alert -->
            <v-alert
              v-if="showErrorAlert"
              type="error"
              variant="tonal"
              class="mt-3"
              closable
              @click:close="showErrorAlert = false"
            >
              {{ generalErrorMessage }}
            </v-alert>

            <!-- Error message dari store (jika tidak ada field-specific errors) -->
            <v-alert
              v-if="profileStore.error && !errors.current && !errors.new && !errors.confirm && !showErrorAlert"
              type="error"
              variant="tonal"
              class="mt-3"
            >
              {{ profileStore.error }}
            </v-alert>

            <v-btn
              color="primary"
              rounded="md"
              variant="flat"
              class="mt-5"
              :loading="isLoading || storeLoading"
              :disabled="isLoading || storeLoading"
              @click="handleSubmit"
            >
              Ubah Kata Sandi
            </v-btn>
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>

    <!-- Hapus Akun -->
    <v-col cols="12" md="4">
      <v-card variant="flat" rounded="lg">
        <v-card variant="outlined" rounded="lg">
          <div class="pa-6">
            <h5 class="text-subtitle-1 mb-0">Hapus Akun</h5>
          </div>
          <v-divider></v-divider>
          <v-card-text>
            <p class="text-lightText">
              Untuk menonaktifkan akun Anda, hapus dulu semua sumber daya yang dimiliki. Jika Anda satu-satunya pemilik tim mana pun, silakan
              tetapkan pemilik baru atau nonaktifkan tim tersebut.
            </p>
            <v-btn
              color="error"
              rounded="md"
              variant="outlined"
              class="mt-4"
              @click="openDeleteDialog"
              :disabled="storeLoading"
            >
              Nonaktifkan Akun
            </v-btn>
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>
  </v-row>

  <!-- Dialog Konfirmasi Hapus Akun -->
  <v-dialog v-model="showDeleteDialog" max-width="500px" persistent>
    <v-card>
      <v-card-title class="text-h5">
        Konfirmasi Hapus Akun
      </v-card-title>
      <v-card-text>
        <p class="mb-4">
          Apakah Anda yakin ingin menghapus akun ini? Tindakan ini tidak dapat dibatalkan.
        </p>
        <v-text-field
          v-model="deleteConfirmPassword"
          type="password"
          label="Konfirmasi dengan kata sandi Anda"
          placeholder="Masukkan kata sandi"
          variant="outlined"
          density="comfortable"
          :error-messages="deleteError"
          :disabled="isDeleting"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="grey"
          variant="text"
          @click="closeDeleteDialog"
          :disabled="isDeleting"
        >
          Batal
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          @click="handleDeleteAccount"
          :loading="isDeleting"
          :disabled="isDeleting"
        >
          Hapus Akun
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

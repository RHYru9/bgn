<script setup lang="ts">
import { ref } from 'vue';
import Appbar from './AppBarMenu.vue';
import FooterSection from './FooterSection.vue';
import NewsLetter from './NewsLetter.vue';
import { useCustomizerStore } from '@/stores/customizer';
import SvgSprite from '@/components/shared/SvgSprite.vue';

const customizer = useCustomizerStore();
const formType = ref('pelamar');
const isLoading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// Form data
const pelamarForm = ref({
  nama_lengkap: '',
  nama_panggilan: '',
  email: '',
  link_ijazah: '',
  link_ktp: '',
  link_cv: ''
});

const mitraForm = ref({
  nama_lengkap: '',
  nama_perusahaan: '',
  email_perusahaan: '',
  nomor_telepon: '',
  alamat: '',
  jenis_mitra: '',
  status: 'aktif',
  deskripsi: ''
});

const jenisMitraOptions = [
  'Distribusi',
  'Supplier',
  'Kontraktor',
  'Jasa',
  'Lainnya'
];

// Validation rules
const rules = {
  required: (value: string) => !!value || 'Wajib diisi.',
  email: (value: string) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || 'Email tidak valid.';
  },
  url: (value: string) => {
    if (!value) return true;
    const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return pattern.test(value) || 'URL tidak valid';
  }
};

const submitForm = async () => {
  isLoading.value = true;
  successMessage.value = '';
  errorMessage.value = '';
  
  try {
    const formData = formType.value === 'pelamar' 
      ? { tipe: 'pelamar', ...pelamarForm.value }
      : { tipe: 'mitra', ...mitraForm.value };

    const response = await fetch('http://127.0.0.1:8000/api/karir/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    
    if (response.ok) {
      successMessage.value = 'Data berhasil dikirim!';
      resetForm();
    } else {
      errorMessage.value = data.message || 'Terjadi kesalahan saat mengirim data';
    }
  } catch (err) {
    errorMessage.value = 'Terjadi kesalahan jaringan';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  if (formType.value === 'pelamar') {
    pelamarForm.value = {
      nama_lengkap: '',
      nama_panggilan: '',
      email: '',
      link_ijazah: '',
      link_ktp: '',
      link_cv: ''
    };
  } else {
    mitraForm.value = {
      nama_lengkap: '',
      nama_perusahaan: '',
      email_perusahaan: '',
      nomor_telepon: '',
      alamat: '',
      jenis_mitra: '',
      status: 'aktif',
      deskripsi: ''
    };
  }
};
</script>

<template>
  <Appbar />
  <v-layout class="flex-column" :class="customizer.actTheme === 'dark' ? 'bg-containerBg' : 'bg-surface'">
    <v-main class="bg-surface pt-appbar">
      <v-container class="py-16">
        <!-- Header Section -->
        <v-row class="justify-center mb-10">
          <v-col cols="12" md="8" class="text-center">
            <h1 class="text-h2 mb-4 text-primary">Bergabung Dengan Kami</h1>
            <p class="text-h6 text-lightText">
              Kami selalu mencari talenta-talenta baru dan mitra yang dapat bekerja sama untuk mencapai kesuksesan bersama.
            </p>
          </v-col>
        </v-row>

        <!-- Form Selection Tabs -->
        <v-row class="justify-center mb-6">
          <v-col cols="12" md="8" class="text-center">
            <v-btn-toggle
              v-model="formType"
              mandatory
              rounded="lg"
              color="primary"
              class="elevation-1"
            >
              <v-btn value="pelamar" size="large">
                <v-icon start>mdi-account-tie</v-icon>
                Saya Pelamar
              </v-btn>
              <v-btn value="mitra" size="large">
                <v-icon start>mdi-handshake</v-icon>
                Saya Mitra
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>

        <!-- Form Container -->
        <v-row class="justify-center">
          <v-col cols="12" md="8">
            <v-card elevation="1" class="pa-6 rounded-xl">
              <!-- Success Message -->
              <v-alert
                v-if="successMessage"
                type="success"
                variant="tonal"
                class="mb-6"
              >
                {{ successMessage }}
              </v-alert>

              <!-- Error Message -->
              <v-alert
                v-if="errorMessage"
                type="error"
                variant="tonal"
                class="mb-6"
              >
                {{ errorMessage }}
              </v-alert>

              <!-- Pelamar Form -->
              <v-form v-if="formType === 'pelamar'" @submit.prevent="submitForm">
                <h2 class="text-h4 mb-6 text-primary">Formulir Pelamar</h2>
                
                <v-row class="mb-4">
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="pelamarForm.nama_lengkap"
                      label="Nama Lengkap"
                      variant="outlined"
                      color="primary"
                      :rules="[rules.required]"
                      persistent-placeholder
                      density="comfortable"
                    >
                      <template v-slot:prepend-inner>
                        <SvgSprite name="custom-user" style="width: 20px; height: 20px" />
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="pelamarForm.nama_panggilan"
                      label="Nama Panggilan"
                      variant="outlined"
                      color="primary"
                      persistent-placeholder
                      density="comfortable"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-text-field
                  v-model="pelamarForm.email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  color="primary"
                  :rules="[rules.required, rules.email]"
                  persistent-placeholder
                  density="comfortable"
                  class="mb-4"
                >
                  <template v-slot:prepend-inner>
                    <SvgSprite name="custom-mail-outline" style="width: 20px; height: 20px" />
                  </template>
                </v-text-field>

                <v-text-field
                  v-model="pelamarForm.link_ijazah"
                  label="Link Ijazah (URL)"
                  variant="outlined"
                  color="primary"
                  :rules="[rules.url]"
                  persistent-placeholder
                  hint="Upload ijazah Anda ke layanan cloud dan masukkan link-nya di sini"
                  persistent-hint
                  density="comfortable"
                  class="mb-4"
                >
                  <template v-slot:prepend-inner>
                    <SvgSprite name="custom-link" style="width: 20px; height: 20px" />
                  </template>
                </v-text-field>

                <v-text-field
                  v-model="pelamarForm.link_ktp"
                  label="Link KTP (URL)"
                  variant="outlined"
                  color="primary"
                  :rules="[rules.url]"
                  persistent-placeholder
                  hint="Upload scan KTP Anda ke layanan cloud dan masukkan link-nya di sini"
                  persistent-hint
                  density="comfortable"
                  class="mb-4"
                >
                  <template v-slot:prepend-inner>
                    <SvgSprite name="custom-id-card" style="width: 20px; height: 20px" />
                  </template>
                </v-text-field>

                <v-text-field
                  v-model="pelamarForm.link_cv"
                  label="Link CV (URL)"
                  variant="outlined"
                  color="primary"
                  :rules="[rules.required, rules.url]"
                  persistent-placeholder
                  hint="Upload CV Anda ke layanan cloud dan masukkan link-nya di sini"
                  persistent-hint
                  required
                  density="comfortable"
                  class="mb-4"
                >
                  <template v-slot:prepend-inner>
                    <SvgSprite name="custom-document" style="width: 20px; height: 20px" />
                  </template>
                </v-text-field>

                <div class="d-flex justify-end gap-4 mt-6">
                  <v-btn
                    color="error"
                    variant="outlined"
                    @click="resetForm"
                    size="large"
                    rounded="md"
                  >
                    Reset
                  </v-btn>
                  <v-btn
                    color="primary"
                    type="submit"
                    :loading="isLoading"
                    size="large"
                    rounded="md"
                  >
                    Kirim Lamaran
                  </v-btn>
                </div>
              </v-form>

              <!-- Mitra Form -->
              <v-form v-else @submit.prevent="submitForm">
                <h2 class="text-h4 mb-6 text-primary">Formulir Mitra</h2>
                
                <v-text-field
                  v-model="mitraForm.nama_lengkap"
                  label="Nama Lengkap"
                  variant="outlined"
                  color="primary"
                  :rules="[rules.required]"
                  persistent-placeholder
                  density="comfortable"
                  class="mb-4"
                >
                  <template v-slot:prepend-inner>
                    <SvgSprite name="custom-user" style="width: 20px; height: 20px" />
                  </template>
                </v-text-field>

                <v-text-field
                  v-model="mitraForm.nama_perusahaan"
                  label="Nama Perusahaan"
                  variant="outlined"
                  color="primary"
                  :rules="[rules.required]"
                  persistent-placeholder
                  density="comfortable"
                  class="mb-4"
                >
                  <template v-slot:prepend-inner>
                    <SvgSprite name="custom-building" style="width: 20px; height: 20px" />
                  </template>
                </v-text-field>

                <v-text-field
                  v-model="mitraForm.email_perusahaan"
                  label="Email Perusahaan"
                  variant="outlined"
                  color="primary"
                  :rules="[rules.required, rules.email]"
                  persistent-placeholder
                  density="comfortable"
                  class="mb-4"
                >
                  <template v-slot:prepend-inner>
                    <SvgSprite name="custom-mail-outline" style="width: 20px; height: 20px" />
                  </template>
                </v-text-field>

                <v-text-field
                  v-model="mitraForm.nomor_telepon"
                  label="Nomor Telepon"
                  variant="outlined"
                  color="primary"
                  :rules="[rules.required]"
                  persistent-placeholder
                  density="comfortable"
                  class="mb-4"
                >
                  <template v-slot:prepend-inner>
                    <SvgSprite name="custom-phone" style="width: 20px; height: 20px" />
                  </template>
                </v-text-field>

                <v-textarea
                  v-model="mitraForm.alamat"
                  label="Alamat"
                  variant="outlined"
                  color="primary"
                  :rules="[rules.required]"
                  persistent-placeholder
                  rows="2"
                  auto-grow
                  density="comfortable"
                  class="mb-4"
                ></v-textarea>

                <v-select
                  v-model="mitraForm.jenis_mitra"
                  :items="jenisMitraOptions"
                  label="Jenis Mitra"
                  variant="outlined"
                  color="primary"
                  :rules="[rules.required]"
                  persistent-placeholder
                  density="comfortable"
                  class="mb-4"
                >
                  <template v-slot:prepend-inner>
                    <SvgSprite name="custom-category" style="width: 20px; height: 20px" />
                  </template>
                </v-select>

                <v-radio-group
                  v-model="mitraForm.status"
                  label="Status"
                  inline
                  class="mb-4"
                >
                  <v-radio label="Aktif" value="aktif" color="primary"></v-radio>
                  <v-radio label="Non-Aktif" value="non-aktif" color="primary"></v-radio>
                </v-radio-group>

                <v-textarea
                  v-model="mitraForm.deskripsi"
                  label="Deskripsi Perusahaan"
                  variant="outlined"
                  color="primary"
                  persistent-placeholder
                  rows="3"
                  auto-grow
                  hint="Deskripsi singkat tentang perusahaan Anda"
                  persistent-hint
                  density="comfortable"
                  class="mb-4"
                ></v-textarea>

                <div class="d-flex justify-end gap-4 mt-6">
                  <v-btn
                    color="error"
                    variant="outlined"
                    @click="resetForm"
                    size="large"
                    rounded="md"
                  >
                    Reset
                  </v-btn>
                  <v-btn
                    color="primary"
                    type="submit"
                    :loading="isLoading"
                    size="large"
                    rounded="md"
                  >
                    Daftar Sebagai Mitra
                  </v-btn>
                </div>
              </v-form>
            </v-card>
          </v-col>
        </v-row>

        <!-- Additional Information -->
        <v-row class="justify-center mt-10">
          <v-col cols="12" md="8" class="text-center">
            <v-card variant="tonal" class="pa-6 rounded-xl">
              <h3 class="text-h5 mb-4 text-primary">Informasi Tambahan</h3>
              <p class="text-body-1">
                Untuk pertanyaan lebih lanjut tentang proses rekrutmen atau kemitraan, 
                silakan hubungi tim HR kami di <strong>hr@bangungo.id</strong> atau 
                melalui nomor telepon <strong>(021) 1234-5678</strong>.
              </p>
              <p class="text-body-1 mt-4">
                Kami akan menghubungi Anda dalam waktu 3-5 hari kerja setelah pengiriman formulir.
              </p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
  <NewsLetter />
  <FooterSection />
</template>

<style scoped>
.pt-appbar {
  padding-top: 40px;
}

/* Form spacing */
.v-text-field,
.v-textarea,
.v-select {
  margin-bottom: 16px;
}

.v-input__details {
  margin-top: 4px;
}

/* Card styling */
.v-card {
  background-color: var(--v-theme-surface);
  transition: all 0.3s ease;
}

/* Text styling */
.text-primary {
  color: rgb(var(--v-theme-primary)) !important;
}

/* Button styling */
.v-btn {
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: none;
}

/* Form field styling */
.v-field--variant-outlined .v-field__outline {
  border-width: 1px;
}

.v-field--variant-outlined .v-field__outline__start,
.v-field--variant-outlined .v-field__outline__notch::before,
.v-field--variant-outlined .v-field__outline__notch::after,
.v-field--variant-outlined .v-field__outline__end {
  border-width: 1px;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .v-container {
    padding-top: 80px;
    padding-bottom: 80px;
  }
}

/* Gap utility for buttons */
.gap-4 {
  gap: 16px;
}

/* Custom spacing for form elements */
.mb-4 {
  margin-bottom: 16px !important;
}

.mb-6 {
  margin-bottom: 24px !important;
}

.mt-4 {
  margin-top: 16px !important;
}

.mt-6 {
  margin-top: 24px !important;
}

/* Custom styling for form fields */
.v-input__prepend-inner {
  margin-right: 12px;
  align-self: center;
}

/* Hint text styling */
.v-messages__message {
  font-size: 0.75rem;
  line-height: 1.25;
}

/* Radio group styling */
.v-radio-group {
  margin-top: 8px;
  margin-bottom: 16px;
}

.v-radio {
  margin-right: 16px;
}
</style>
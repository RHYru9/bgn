<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRegisterStore } from '@/stores/register';
import { useVerifikasiStore } from '@/stores/apps/sudahVerifikasi';

const router = useRouter();
const registerStore = useRegisterStore();
const verifikasiStore = useVerifikasiStore();

const kodeOtp = ref('');
const formOtp = ref();
const hitungMundur = ref(0); // Mulai dari 0, tidak langsung countdown
let intervalHitungMundur: number | null = null;
const showOtpForm = ref(false); // Kontrol tampilan form OTP

// Aturan validasi OTP
const aturanOtp = ref([
  (v: string) => !!v || 'Kode OTP wajib diisi',
  (v: string) => /^\d{6}$/.test(v) || 'OTP harus 6 digit angka'
]);

// Computed untuk mendapatkan email dari store verifikasi atau register
const currentEmail = computed(() => {
  return verifikasiStore.userEmail || registerStore.currentEmail || '';
});

// Hitung mundur yang diformat
const hitungMundurTerkirim = computed(() => {
  const menit = Math.floor(hitungMundur.value / 60);
  const detik = hitungMundur.value % 60;
  return `${menit}:${detik.toString().padStart(2, '0')}`;
});

const bisaKirimUlang = computed(() => hitungMundur.value <= 0);

// Mulai hitung mundur
const mulaiHitungMundur = () => {
  // Reset hitung mundur ke 2 menit
  hitungMundur.value = 120;
  
  // Hentikan timer sebelumnya jika ada
  if (intervalHitungMundur) {
    clearInterval(intervalHitungMundur);
  }
  
  // Mulai timer baru
  intervalHitungMundur = window.setInterval(() => {
    hitungMundur.value -= 1;
    
    // Hentikan timer ketika mencapai 0
    if (hitungMundur.value <= 0) {
      if (intervalHitungMundur) {
        clearInterval(intervalHitungMundur);
        intervalHitungMundur = null;
      }
    }
  }, 1000);
};

// Kirim OTP - fungsi baru untuk mengirim OTP manual
const kirimOtp = async () => {
  if (!currentEmail.value) {
    registerStore.error = 'Email tidak ditemukan. Silakan daftar ulang.';
    return;
  }

  const berhasil = await registerStore.sendOTP(currentEmail.value);
  if (berhasil) {
    showOtpForm.value = true;
    kodeOtp.value = '';
    mulaiHitungMundur();
  }
};

// Verifikasi OTP
const verifikasiOtp = async () => {
  registerStore.clearErrors();

  const { valid } = await formOtp.value.validate();
  if (!valid) return;

  const berhasil = await registerStore.verifyOTP(currentEmail.value, kodeOtp.value);
  
  // Jika verifikasi berhasil, check status verifikasi dan redirect
  if (berhasil) {
    await verifikasiStore.checkVerifikasi();
    
    // Jika sudah terverifikasi, arahkan ke dashboard
    if (verifikasiStore.isVerified) {
      router.push('/user/dashboard');
    }
  }
};

// Kirim ulang OTP
const kirimUlangOtp = async () => {
  if (bisaKirimUlang.value) {
    const berhasil = await registerStore.resendOTP(currentEmail.value);
    if (berhasil) {
      kodeOtp.value = '';
      mulaiHitungMundur();
    }
  }
};

// Check verifikasi saat komponen dimount
const checkVerifikasiStatus = async () => {
  await verifikasiStore.checkVerifikasi();
  
  // Jika sudah terverifikasi, langsung arahkan ke dashboard
  if (verifikasiStore.isVerified) {
    router.push('/user/dashboard');
    return;
  }
};

// Lifecycle
onMounted(async () => {
  // Check status verifikasi terlebih dahulu
  await checkVerifikasiStatus();
  
  // Reset form OTP dan countdown
  showOtpForm.value = false;
  hitungMundur.value = 0;
  
  // Clear OTP sent status dari store
  registerStore.isOTPSent = false;
});

onUnmounted(() => {
  // Hentikan timer saat komponen di-unmount
  if (intervalHitungMundur) {
    clearInterval(intervalHitungMundur);
  }
});
</script>

<template>
  <v-row class="bg-containerBg position-relative" no-gutters>
    <div class="bg-blur">
      <div class="round-1"></div>
      <div class="round-2"></div>
    </div>
    
    <v-col cols="12" lg="12" class="d-flex align-center">
      <v-container>
        <div class="d-flex align-center justify-center" style="min-height: calc(100vh - 148px)">
          <v-row justify="center">
            <v-col cols="12" md="12">
              <v-card elevation="0" variant="outlined" rounded="lg" class="loginBox bg-surface">
                <v-card-text class="pa-sm-10 pa-6">
                  <div class="d-flex justify-space-between align-center mb-6">
                    <h3 class="text-h3 text-center mb-0">Verifikasi Email Anda</h3>
                    <router-link to="/login" class="text-primary text-decoration-none">Kembali ke Login</router-link>
                  </div>

                  <!-- Tampilkan email -->
                  <div class="mb-4 text-center" v-if="currentEmail">
                    <p class="text-body-2 text-lightText">
                      Email Anda:
                    </p>
                    <p class="text-body-1 font-weight-medium">
                      {{ currentEmail }}
                    </p>
                  </div>

                  <!-- Pesan jika sudah terverifikasi -->
                  <v-alert
                    v-if="verifikasiStore.isVerified"
                    type="success"
                    variant="tonal"
                    class="mb-4"
                  >
                    <div class="d-flex align-center">
                      <v-icon icon="mdi-check-circle" class="mr-2"></v-icon>
                      Email Anda sudah terverifikasi! Mengarahkan ke dashboard...
                    </div>
                  </v-alert>

                  <!-- Pesan Error -->
                  <v-alert
                    v-if="registerStore.error || registerStore.otpError"
                    type="error"
                    variant="tonal"
                    class="mb-4"
                    closable
                    @click:close="registerStore.clearErrors()"
                  >
                    {{ registerStore.error || registerStore.otpError }}
                  </v-alert>

                  <!-- Pesan Sukses -->
                  <v-alert
                    v-if="registerStore.isOTPSent && !registerStore.error && !registerStore.otpError"
                    type="success"
                    variant="tonal"
                    class="mb-4"
                  >
                    OTP telah berhasil dikirim ke email Anda!
                  </v-alert>

                  <!-- Tombol Kirim OTP - Tampil jika belum kirim OTP atau tidak ada countdown -->
                  <div v-if="!showOtpForm && !verifikasiStore.isVerified" class="text-center mb-4">
                    <p class="text-body-2 text-lightText mb-4">
                      Klik tombol di bawah untuk mengirim kode verifikasi ke email Anda
                    </p>
                    <v-btn
                      color="primary"
                      variant="flat"
                      rounded="md"
                      size="large"
                      :loading="registerStore.isOTPLoading"
                      :disabled="registerStore.isOTPLoading || !currentEmail"
                      @click="kirimOtp"
                      prepend-icon="mdi-email-send"
                    >
                      <span v-if="!registerStore.isOTPLoading">Kirim Kode Verifikasi</span>
                      <span v-else>Mengirim...</span>
                    </v-btn>
                  </div>

                  <!-- Form OTP - Tampil setelah OTP dikirim dan belum terverifikasi -->
                  <v-form 
                    v-if="showOtpForm && !verifikasiStore.isVerified"
                    ref="formOtp" 
                    @submit.prevent="verifikasiOtp" 
                    class="mt-4"
                  >
                    <div class="mb-4 text-center">
                      <p class="text-body-2 text-lightText">
                        Masukkan 6 digit kode yang telah dikirim ke email Anda
                      </p>
                    </div>

                    <div class="mb-6">
                      <v-label>Masukkan 6 digit kode*</v-label>
                      <v-text-field
                        v-model="kodeOtp"
                        :rules="aturanOtp"
                        placeholder="000000"
                        variant="outlined"
                        color="primary"
                        hide-details="auto"
                        class="mt-2 text-center"
                        maxlength="6"
                        :disabled="registerStore.isVerifyLoading"
                        style="font-size: 24px; letter-spacing: 8px;"
                      >
                        <template v-slot:prepend-inner>
                          <div class="d-flex align-center justify-center w-100">
                            <v-icon icon="mdi-lock-outline" class="mr-2"></v-icon>
                          </div>
                        </template>
                      </v-text-field>
                    </div>

                    <!-- Hitung mundur -->
                    <div class="text-center mb-4" v-if="!bisaKirimUlang && hitungMundur > 0">
                      <p class="text-body-2 text-lightText">
                        Kirim ulang dalam: <span class="font-weight-medium">{{ hitungMundurTerkirim }}</span>
                      </p>
                    </div>

                    <!-- Tombol Verifikasi -->
                    <v-btn
                      color="primary"
                      block
                      variant="flat"
                      rounded="md"
                      size="large"
                      type="submit"
                      :loading="registerStore.isVerifyLoading"
                      :disabled="registerStore.isVerifyLoading || !kodeOtp || kodeOtp.length !== 6"
                      class="mb-4"
                    >
                      <span v-if="!registerStore.isVerifyLoading">Verifikasi Kode</span>
                      <span v-else>Memverifikasi...</span>
                    </v-btn>

                    <!-- Tombol Kirim Ulang -->
                    <div class="text-center">
                      <p class="text-body-2 text-lightText mb-2">Tidak menerima kode?</p>
                      <v-btn
                        variant="text"
                        color="primary"
                        :disabled="!bisaKirimUlang || registerStore.isOTPLoading"
                        :loading="registerStore.isOTPLoading"
                        @click="kirimUlangOtp"
                      >
                        <span v-if="!registerStore.isOTPLoading">Kirim Ulang Kode</span>
                        <span v-else>Mengirim...</span>
                      </v-btn>
                    </div>
                  </v-form>

                  <!-- Kembali ke Register -->
                  <div class="text-center mt-6" v-if="!verifikasiStore.isVerified">
                    <router-link to="/register" class="text-primary text-decoration-none">
                      <v-icon icon="mdi-arrow-left" class="mr-1"></v-icon>
                      Kembali ke Pendaftaran
                    </router-link>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-col>
  </v-row>
</template>

<style lang="scss">
.loginBox {
  max-width: 475px;
  margin: 0 auto;
}

.bg-containerBg {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.bg-blur {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.round-1 {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(106, 17, 203, 0.2) 0%, rgba(37, 117, 252, 0.2) 100%);
  top: -100px;
  right: -100px;
}

.round-2 {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(106, 17, 203, 0.2) 0%, rgba(37, 117, 252, 0.2) 100%);
  bottom: -150px;
  left: -150px;
}

.text-center input {
  text-align: center !important;
}
</style>
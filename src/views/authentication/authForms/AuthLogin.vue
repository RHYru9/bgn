<script setup lang="ts">
import { ref } from 'vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import { useAuthStore } from '@/stores/auth';
import { Form, type SubmissionContext } from 'vee-validate';

const checkbox = ref(false);
const valid = ref(false);
const show1 = ref(false);
const password = ref('');
const email = ref('');

// Rules validasi password
const passwordRules = ref([
  (v: string) => !!v || 'Password wajib diisi',
  (v: string) => v === v.trim() || 'Password tidak boleh diawali/diakhiri spasi',
  (v: string) => v.length <= 20 || 'Password maksimal 20 karakter'
]);

// Rules validasi email
const emailRules = ref([
  (v: string) => !!v.trim() || 'Email wajib diisi',
  (v: string) => {
    const trimmedEmail = v.trim();
    return !/\s/.test(trimmedEmail) || 'Email tidak boleh mengandung spasi';
  },
  (v: string) => /.+@.+\..+/.test(v.trim()) || 'Email tidak valid'
]);

function validate(values: Record<string, unknown>, { setErrors }: SubmissionContext) {
  const trimmedEmail = email.value.trim();
  email.value = trimmedEmail;
  
  const authStore = useAuthStore();
  return authStore.login(trimmedEmail, password.value).catch((error: Error) => {
    // Tampilkan error API ke UI
    setErrors({ apiError: error.message });
  });
}
</script>

<template>
  <div class="d-flex justify-space-between align-center mt-4">
    <h3 class="text-h3 text-center mb-0">Masuk</h3>
    <router-link to="/register" class="text-primary text-decoration-none">
      Belum punya akun?
    </router-link>
  </div>
  
  <Form @submit="validate" class="mt-7 loginForm" v-slot="{ errors, isSubmitting }">
    <!-- Email -->
    <div class="mb-6">
      <v-label>Alamat Email</v-label>
      <v-text-field
        aria-label="alamat email"
        v-model="email"
        :rules="emailRules"
        class="mt-2"
        density="comfortable"
        required
        hide-details="auto"
        variant="outlined"
        color="primary"
      ></v-text-field>
    </div>
    
    <!-- Password -->
    <div>
      <v-label>Password</v-label>
      <v-text-field
        aria-label="password"
        v-model="password"
        :rules="passwordRules"
        required
        variant="outlined"
        density="comfortable"
        color="primary"
        hide-details="auto"
        :type="show1 ? 'text' : 'password'"
        class="pwdInput mt-2"
      >
        <template v-slot:append-inner>
          <v-btn color="secondary" aria-label="icon" icon rounded variant="text">
            <SvgSprite name="custom-eye-invisible" style="width: 20px; height: 20px" v-if="show1 == false" @click="show1 = !show1" />
            <SvgSprite name="custom-eye" style="width: 20px; height: 20px" v-if="show1 == true" @click="show1 = !show1" />
          </v-btn>
        </template>
      </v-text-field>
    </div>
    
    <!-- Ingat saya + Lupa password -->
    <div class="d-flex align-center mt-4 mb-7 mb-sm-0">
      <v-checkbox
        v-model="checkbox"
        :rules="[(v: boolean) => !!v || 'Anda harus menyetujui untuk melanjutkan!']"
        label="Ingat saya"
        required
        color="primary"
        class="ms-n2"
        hide-details
      ></v-checkbox>
      <div class="ms-auto">
        <router-link to="/lupa-password" class="text-darkText link-hover">Lupa Password?</router-link>
      </div>
    </div>

    <!-- Tombol submit -->
    <v-btn
      color="primary"
      :loading="isSubmitting"
      block
      class="mt-5"
      variant="flat"
      size="large"
      rounded="md"
      :disabled="valid"
      type="submit"
    >
      Masuk
    </v-btn>
    
    <!-- Error API -->
    <div v-if="errors.apiError" class="mt-2">
      <v-alert color="error">{{ errors.apiError }}</v-alert>
    </div>
  </Form>
</template>
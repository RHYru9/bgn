<script setup lang="ts">
import { ref, computed } from 'vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import { useRegisterStore } from '@/stores/register';

const registerStore = useRegisterStore();

const show1 = ref(false);
const password = ref('');
const confirmPassword = ref('');
const email = ref('');
const Regform = ref();
const firstname = ref('');
const lastname = ref('');

// Computed full name
const fullName = computed(() => {
  return `${firstname.value} ${lastname.value}`.trim();
});

// Password validation rules
const passwordRules = ref([
  (v: string) => !!v || 'Password is required',
  (v: string) => v === v.trim() || 'Password cannot start or end with spaces',
  (v: string) => v.length >= 8 || 'Password must be at least 8 characters',
  (v: string) => v.length <= 50 || 'Password must be less than 50 characters'
]);

// Confirm password validation rules
const confirmPasswordRules = ref([
  (v: string) => !!v || 'Password confirmation is required',
  (v: string) => v === password.value || 'Passwords do not match'
]);

const firstRules = ref([(v: string) => !!v || 'First Name is required']);
const lastRules = ref([(v: string) => !!v || 'Last Name is required']);

// Email validation rules
const emailRules = ref([
  (v: string) => !!v.trim() || 'E-mail is required',
  (v: string) => {
    const trimmedEmail = v.trim();
    return !/\s/.test(trimmedEmail) || 'E-mail must not contain spaces';
  },
  (v: string) => /.+@.+\..+/.test(v.trim()) || 'E-mail must be valid'
]);

async function handleSubmit() {
  // Clear previous errors
  registerStore.clearErrors();
  
  // Validate form
  const { valid } = await Regform.value.validate();
  
  if (!valid) {
    return;
  }
  
  // Prepare registration data
  const registerData = {
    email: email.value.trim(),
    nama: fullName.value,
    password: password.value,
    password_confirmation: confirmPassword.value
  };
  
  // Call register function from store
  await registerStore.register(registerData);
}
</script>

<template>
  <div class="d-flex justify-space-between align-center">
    <h3 class="text-h3 text-center mb-0">Sign up</h3>
    <router-link to="/login1" class="text-primary text-decoration-none">Already have an account?</router-link>
  </div>
  
  <!-- Error Alert -->
  <v-alert
    v-if="registerStore.error"
    type="error"
    variant="tonal"
    class="mt-4"
    closable
    @click:close="registerStore.clearErrors()"
  >
    {{ registerStore.error }}
  </v-alert>
  
  <v-form ref="Regform" lazy-validation class="mt-7 loginForm" @submit.prevent="handleSubmit">
    <v-row class="my-0">
      <v-col cols="12" sm="6" class="py-0">
        <div class="mb-6">
          <v-label>First Name*</v-label>
          <v-text-field
            v-model="firstname"
            :rules="firstRules"
            hide-details="auto"
            required
            variant="outlined"
            class="mt-2"
            color="primary"
            placeholder="John"
            :disabled="registerStore.isLoading"
          ></v-text-field>
        </div>
      </v-col>
      <v-col cols="12" sm="6" class="py-0">
        <div class="mb-6">
          <v-label>Last Name*</v-label>
          <v-text-field
            v-model="lastname"
            :rules="lastRules"
            hide-details="auto"
            required
            variant="outlined"
            class="mt-2"
            color="primary"
            placeholder="Doe"
            :disabled="registerStore.isLoading"
          ></v-text-field>
        </div>
      </v-col>
    </v-row>
    
    <div class="mb-6">
      <v-label>Email Address*</v-label>
      <v-text-field
        v-model="email"
        :rules="emailRules"
        placeholder="demo@company.com"
        class="mt-2"
        required
        hide-details="auto"
        variant="outlined"
        color="primary"
        :disabled="registerStore.isLoading"
      ></v-text-field>
    </div>
    
    <div class="mb-6">
      <v-label>Password*</v-label>
      <v-text-field
        v-model="password"
        :rules="passwordRules"
        placeholder="Enter your password"
        required
        variant="outlined"
        color="primary"
        hide-details="auto"
        :type="show1 ? 'text' : 'password'"
        class="pwdInput mt-2"
        :disabled="registerStore.isLoading"
      >
        <template v-slot:append-inner>
          <v-btn color="secondary" aria-label="icon" icon rounded variant="text">
            <SvgSprite 
              name="custom-eye-invisible" 
              style="width: 20px; height: 20px" 
              v-if="show1 == false" 
              @click="(show1 = !show1)" 
            />
            <SvgSprite 
              name="custom-eye" 
              style="width: 20px; height: 20px" 
              v-if="show1 == true" 
              @click="(show1 = !show1)" 
            />
          </v-btn>
        </template>
      </v-text-field>
    </div>
    
    <div class="mb-6">
      <v-label>Confirm Password*</v-label>
      <v-text-field
        v-model="confirmPassword"
        :rules="confirmPasswordRules"
        placeholder="Confirm your password"
        required
        variant="outlined"
        color="primary"
        hide-details="auto"
        type="password"
        class="mt-2"
        :disabled="registerStore.isLoading"
      ></v-text-field>
    </div>

    <div class="d-sm-inline-flex align-center mt-2 mb-7 mb-sm-0 font-weight-bold">
      <h6 class="text-caption">
        By Signing up, you agree to our
        <router-link to="/privacy-policy" class="text-primary link-hover font-weight-medium">Terms of Service </router-link>
        and
        <router-link to="/privacy-policy" class="text-primary link-hover font-weight-medium">Privacy Policy</router-link>
      </h6>
    </div>
    
    <v-btn 
      color="primary" 
      block 
      class="mt-4" 
      variant="flat" 
      rounded="md" 
      size="large" 
      type="submit"
      :loading="registerStore.isLoading"
      :disabled="registerStore.isLoading"
    >
      <span v-if="!registerStore.isLoading">Create Account</span>
      <span v-else>Creating Account...</span>
    </v-btn>
  </v-form>
</template>
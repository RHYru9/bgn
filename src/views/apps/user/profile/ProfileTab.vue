<script setup lang="ts">
import { ref, onMounted } from 'vue';
import userAvatar from '@/assets/images/users/avatar-1.png';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const textNama = ref<string>();
const textEmail = ref<string>();
const textAlamat = ref<string>();
const textNoHp = ref<string>();
const textKodePos = ref<string>();

onMounted(() => {
  if (authStore.user) {
    textNama.value = authStore.user.nama;
    textEmail.value = authStore.user.email;
    textAlamat.value = authStore.user.alamat;
    textNoHp.value = authStore.user.no_hp;
    textKodePos.value = authStore.user.kode_pos;
  }
});
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
            <v-row>
              <v-col cols="12">
                <v-label class="mb-2">Nama Lengkap</v-label>
                <v-text-field
                  type="text"
                  v-model="textNama"
                  placeholder="Masukkan nama lengkap"
                  single-line
                  density="comfortable"
                  color="primary"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-label class="mb-2">Alamat Email</v-label>
                <v-text-field
                  type="email"
                  v-model="textEmail"
                  placeholder="Masukkan email Anda"
                  single-line
                  density="comfortable"
                  color="primary"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-label class="mb-2">Alamat</v-label>
                <v-text-field
                  type="text"
                  v-model="textAlamat"
                  placeholder="Masukkan alamat"
                  single-line
                  density="comfortable"
                  color="primary"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2">Nomor HP</v-label>
                <v-text-field
                  type="text"
                  v-model="textNoHp"
                  placeholder="Masukkan nomor HP"
                  single-line
                  density="comfortable"
                  color="primary"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2">Kode Pos</v-label>
                <v-text-field
                  type="text"
                  v-model="textKodePos"
                  placeholder="Masukkan kode pos"
                  single-line
                  density="comfortable"
                  color="primary"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-btn color="primary" rounded="md" variant="flat" class="mt-5">Ubah Detail</v-btn>
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>
  </v-row>
</template>

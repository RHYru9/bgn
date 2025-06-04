<script setup lang="ts"></script>

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
                  type="text"
                  single-line
                  placeholder="Masukkan kata sandi saat ini"
                  density="comfortable"
                  color="primary"
                  variant="outlined"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-label class="mb-2">Kata sandi baru</v-label>
                <v-text-field
                  type="text"
                  single-line
                  placeholder="Masukkan kata sandi baru"
                  density="comfortable"
                  color="primary"
                  variant="outlined"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-label class="mb-2">Ulangi kata sandi baru</v-label>
                <v-text-field
                  type="text"
                  single-line
                  placeholder="Masukkan konfirmasi kata sandi"
                  density="comfortable"
                  color="primary"
                  variant="outlined"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-btn color="primary" rounded="md" variant="flat" class="mt-5">Ubah Kata Sandi</v-btn>
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>
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

            <v-btn color="error" rounded="md" variant="outlined" class="mt-4">Nonaktifkan Akun</v-btn>
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>
  </v-row>
</template>

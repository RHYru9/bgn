<script setup lang="ts">
import { ref } from 'vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import { keranjangService } from '@/stores/apps/keranjang/KeranjangService';

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  address: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update-address', 'next', 'update-items']);

const loading = ref(false);
const addressForm = ref();

function formatPrice(price: number) {
  return keranjangService.formatPrice(price);
}

async function removeItem(itemId: string) {
  try {
    loading.value = true;
    await keranjangService.removeFromKeranjang(itemId);
    emit('update-items');
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function updateQuantity(itemId: string, newQuantity: number) {
  if (newQuantity < 1) return;
  
  try {
    loading.value = true;
    // Perubahan di sini - langsung mengirim number sebagai payload
    await keranjangService.updateKeranjangItem(itemId, newQuantity);
    emit('update-items');
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

function next() {
  addressForm.value.validate().then(({ valid }: { valid: boolean }) => {
    if (valid) {
      emit('update-address', props.address);
      emit('next');
    }
  });
}
</script>

<template>
  <v-card class="pa-4 rounded-lg" color="#1D2630" elevation="1">
    <v-card-title class="text-h6 text-white mb-3 px-0">Keranjang Belanja</v-card-title>

    <div class="mb-4">
      <div 
        v-for="item in items" 
        :key="item.id" 
        class="d-flex py-3 px-0"
        style="border-bottom: 1px solid #2D3748;"
      >
        <v-avatar rounded size="70" class="mr-3">
          <v-img 
            :src="item.barang.gambar_barang ? `http://127.0.0.1:8000/${item.barang.gambar_barang}` : 'https://via.placeholder.com/300x300?text=No+Image'" 
            height="70"
            width="70"
            cover
          />
        </v-avatar>
        
        <div class="d-flex flex-column justify-space-between flex-grow-1">
          <div>
            <div class="text-white text-subtitle-1 font-weight-medium mb-1">
              {{ item.barang.nama_barang }}
            </div>
            <div class="text-grey-lighten-1 text-body-2">
              {{ formatPrice(item.barang.harga_jual) }}
            </div>
          </div>
          
          <div class="d-flex align-center justify-space-between mt-3">
            <div class="d-flex align-center">
              <v-btn 
                icon 
                variant="text" 
                size="x-small" 
                @click="updateQuantity(item.id, item.jumlah - 1)"
                :disabled="item.jumlah <= 1"
                class="mr-1"
              >
                <SvgSprite name="custom-line" width="16" height="16" />
              </v-btn>
              
              <span class="mx-2 text-white text-body-1">{{ item.jumlah }}</span>
              
              <v-btn 
                icon 
                variant="text" 
                size="x-small" 
                @click="updateQuantity(item.id, item.jumlah + 1)"
                class="ml-1"
              >
                <SvgSprite name="custom-plus" width="16" height="16" />
              </v-btn>
            </div>
            
            <v-btn 
              icon 
              @click="removeItem(item.id)" 
              color="red" 
              variant="text"
              :loading="loading"
              size="small"
            >
              <SvgSprite name="custom-trash-fill" width="18" height="18" />
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <v-divider class="my-4" color="grey-darken-3" />

    <v-card-title class="text-h6 text-white mb-3 px-0">Alamat Pengiriman</v-card-title>

    <v-form ref="addressForm" @submit.prevent="next">
      <v-row dense>
        <v-col cols="12" md="6" class="mb-2">
          <v-text-field
            v-model="address.nama"
            label="Nama Penerima"
            variant="outlined"
            density="compact"
            color="blue"
            :rules="[v => !!v || 'Nama harus diisi']"
            class="rounded-lg"
            hide-details="auto"
          />
        </v-col>
        <v-col cols="12" md="6" class="mb-2">
          <v-text-field
            v-model="address.no_hp"
            label="No. HP"
            variant="outlined"
            density="compact"
            color="blue"
            :rules="[v => !!v || 'No. HP harus diisi']"
            class="rounded-lg"
            hide-details="auto"
          />
        </v-col>
        <v-col cols="12" md="6" class="mb-2">
          <v-text-field
            v-model="address.email"
            label="Email"
            type="email"
            variant="outlined"
            density="compact"
            color="blue"
            :rules="[
              v => !!v || 'Email harus diisi',
              v => /.+@.+\..+/.test(v) || 'Email tidak valid'
            ]"
            class="rounded-lg"
            hide-details="auto"
          />
        </v-col>
        <v-col cols="12" class="mb-2">
          <v-textarea
            v-model="address.alamat"
            label="Alamat Lengkap"
            variant="outlined"
            density="compact"
            color="blue"
            auto-grow
            rows="2"
            :rules="[v => !!v || 'Alamat harus diisi']"
            class="rounded-lg"
            hide-details="auto"
          />
        </v-col>
        <v-col cols="12" md="4" class="mb-2">
          <v-text-field
            v-model="address.kode_pos"
            label="Kode Pos"
            variant="outlined"
            density="compact"
            color="blue"
            :rules="[v => !!v || 'Kode pos harus diisi']"
            class="rounded-lg"
            hide-details="auto"
          />
        </v-col>
      </v-row>

      <v-card-actions class="mt-4 px-0">
        <v-spacer />
        <v-btn 
          color="blue" 
          type="submit"
          :loading="loading"
          class="px-4 py-1 rounded-lg text-white"
          size="small"
        >
          Lanjut Ke Pembayaran
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<style scoped>
.v-card-title {
  font-size: 1.125rem;
}
</style>
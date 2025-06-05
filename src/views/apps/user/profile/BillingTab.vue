<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue';
import { useUserAdminBankStore } from '@/stores/apps/bank/userAdminBank';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import KartuBangungo from './KartuBangungo.vue';

// Import bank SVG assets
import bcaIcon from '@/assets/images/bank/bca.svg';
import bniIcon from '@/assets/images/bank/bni.svg';
import briIcon from '@/assets/images/bank/bri.svg';
import mandiriIcon from '@/assets/images/bank/mandiri.svg';
import btnIcon from '@/assets/images/bank/btn.svg';
import danaIcon from '@/assets/images/bank/dana.svg';
import ovoIcon from '@/assets/images/bank/ovo.svg';
import gopayIcon from '@/assets/images/bank/gopay.svg';
import transferIcon from '@/assets/images/bank/transfer.svg';

const bankStore = useUserAdminBankStore();
const showDialog = ref(false);
const isEditing = ref(false);
const currentBankId = ref<number | null>(null);

const form = reactive({
  nama_rekening: '',
  bank_tipe: 'bca',
  no_rekening: ''
});

const bankTypes = [
  { title: 'BCA', value: 'bca' },
  { title: 'BNI', value: 'bni' },
  { title: 'BRI', value: 'bri' },
  { title: 'Mandiri', value: 'mandiri' },
  { title: 'BTN', value: 'btn' },
  { title: 'DANA', value: 'dana' },
  { title: 'OVO', value: 'ovo' },
  { title: 'GoPay', value: 'gopay' },
  { title: 'Transfer', value: 'transfer' }
];

// Bank icon configurations
const getBankIcon = (bankType: string) => {
  const iconPaths: Record<string, string> = {
    bca: bcaIcon,
    bni: bniIcon,
    bri: briIcon,
    mandiri: mandiriIcon,
    btn: btnIcon,
    dana: danaIcon,
    ovo: ovoIcon,
    gopay: gopayIcon,
    transfer: transferIcon
  };
  
  return iconPaths[bankType] || transferIcon;
};

onMounted(async () => {
  try {
    await bankStore.ambilBankSaya();
    await bankStore.ambilBankAdmin();
  } catch (error) {
    console.error('Error fetching bank data:', error);
  }
});

function resetForm() {
  form.nama_rekening = '';
  form.bank_tipe = 'bca';
  form.no_rekening = '';
  currentBankId.value = null;
  isEditing.value = false;
}

function openAddDialog() {
  resetForm();
  showDialog.value = true;
}

async function openEditDialog(id: number) {
  try {
    const bank = await bankStore.ambilDetailBank(id);
    if (bank) {
      form.nama_rekening = bank.nama_rekening;
      form.bank_tipe = bank.bank_tipe;
      form.no_rekening = bank.no_rekening;
      currentBankId.value = id;
      isEditing.value = true;
      showDialog.value = true;
    }
  } catch (error) {
    console.error('Error fetching bank details:', error);
  }
}

async function submitForm() {
  try {
    if (isEditing.value && currentBankId.value) {
      await bankStore.ubahBankSaya(currentBankId.value, { ...form });
    } else {
      await bankStore.buatBankSaya({ ...form });
    }
    showDialog.value = false;
    resetForm();
  } catch (error) {
    console.error('Error saving bank:', error);
  }
}

async function setDefaultBank(id: number) {
  try {
    const bank = bankStore.bankSaya.find(b => b.id === id);
    if (bank) {
      bankStore.bankSaya = [
        bank,
        ...bankStore.bankSaya.filter(b => b.id !== id)
      ];
    }
  } catch (error) {
    console.error('Error setting default bank:', error);
  }
}

const bills = computed(() => [
  {
    title: 'Total Banks',
    color: 'error',
    subtitle: bankStore.bankSaya.length.toString(),
    moveto: 'Lihat Semua'
  },
  {
    title: 'Admin Banks',
    color: 'warning',
    subtitle: bankStore.bankAdmin.length.toString(),
    moveto: 'Lihat Semua'
  },
  {
    title: 'Default Bank',
    color: 'success',
    subtitle: bankStore.bankSaya.length > 0 ? bankStore.bankSaya[0].bank_tipe : 'None',
    moveto: 'Jadikan Utama'
  }
]);
</script>

<template>
  <v-row>
    <v-col cols="12" md="4" sm="6" v-for="(bill, i) in bills" :key="i">
      <div :class="'pa-5 rounded-lg v-alert--border v-alert--border-start position-relative bg-light ' + bill.color">
        <div :class="'v-alert__border bg-' + bill.color"></div>
        <span>{{ bill.title }}</span>
        <h2 class="text-h2 mb-3 font-weight-medium">{{ bill.subtitle }}</h2>
        <span :class="'text-subtitle-1 cursor-pointer font-weight-medium text-decoration-none d-flex align-center text-' + bill.color">
          {{ bill.moveto }}
          <SvgSprite name="custom-arrow-right" class="ms-1" style="width: 16px; height: 16px" />
        </span>
      </div>
    </v-col>
  </v-row>

  <!-- Payment Method List -->
  <v-row>
    <v-col cols="12">
      <v-card variant="flat" rounded="lg" class="mt-3">
        <v-card variant="outlined" class="overflow-hidden" rounded="lg">
          <v-list aria-label="title">
            <v-list-item class="d-sm-flex d-block">
              <template #title>
                <h5 class="text-subtitle-1 mt-1 mb-3 mb-sm-0">Payment Methods</h5>
              </template>
              <template #append>
                <v-btn 
                  size="small" 
                  color="primary" 
                  rounded="md" 
                  variant="flat" 
                  class="ms-2"
                  @click="openAddDialog"
                  prepend-icon="mdi-plus"
                >
                  Add New Method
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <v-list lines="two" density="compact" aria-label="method list">
              <template v-for="(bank, i) in bankStore.bankSaya" :key="bank.id">
                <v-list-item>
                  <template #prepend>
                    <div class="me-3" style="width: 60px; height: 40px; display: flex; align-items: center;">
                      <div 
                        class="bank-icon-container"
                        style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 8px; background: #f5f5f5; border: 1px solid #e0e0e0;"
                      >
                        <img 
                          :src="getBankIcon(bank.bank_tipe)" 
                          :alt="bank.bank_tipe.toUpperCase()"
                          style="width: 32px; height: 32px; object-fit: contain;"
                          @error="$event.target.style.display = 'none'"
                        />
                      </div>
                    </div>
                  </template>
                  <template #title>
                    <div class="d-none d-sm-block">
                      <h5 class="text-subtitle-1 mt-1 mb-0">{{ bank.nama_rekening }}</h5>
                      <span class="text-subtitle-2 text-disabled font-weight-medium">
                        Ending in {{ bank.no_rekening.slice(-4) }}
                      </span>
                    </div>
                  </template>
                  <template #append>
                    <div class="d-sm-flex align-center mt-3">
                      <v-chip 
                        color="primary" 
                        size="small" 
                        variant="tonal" 
                        v-if="i === 0"
                        prepend-icon="mdi-check"
                      >
                        Default
                      </v-chip>
                      <v-chip 
                        color="secondary" 
                        size="small" 
                        variant="tonal" 
                        v-else
                        @click="setDefaultBank(bank.id)"
                        class="cursor-pointer"
                      >
                        Set as default
                      </v-chip>
                      <v-divider inset vertical class="mx-4" style="height: 20px"></v-divider>
                      <v-btn 
                        size="small" 
                        rounded="md" 
                        variant="outlined" 
                        color="primary" 
                        class="me-2"
                        @click="openEditDialog(bank.id)"
                        prepend-icon="mdi-pencil"
                      >
                        Edit
                      </v-btn>
                      <v-btn 
                        size="small" 
                        rounded="md" 
                        variant="outlined" 
                        color="error"
                        @click="bankStore.hapusBankSaya(bank.id)"
                        prepend-icon="mdi-delete"
                      >
                        Delete
                      </v-btn>
                    </div>
                  </template>
                </v-list-item>
                <v-divider v-if="i < bankStore.bankSaya.length - 1" />
              </template>
            </v-list>
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>

    <!-- Kartu Bangungo Component -->
    <v-col cols="12">
      <KartuBangungo :banks="bankStore.bankSaya" />
    </v-col>
  </v-row>

  <!-- Add/Edit Bank Dialog -->
  <v-dialog v-model="showDialog" max-width="600" persistent>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>{{ isEditing ? 'Edit Bank Account' : 'Add New Bank Account' }}</span>
        <v-btn icon="mdi-close" variant="text" @click="showDialog = false"></v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pt-6">
        <v-form @submit.prevent="submitForm">
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="form.bank_tipe"
                :items="bankTypes"
                item-title="title"
                item-value="value"
                label="Bank Type"
                variant="outlined"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.nama_rekening"
                label="Account Name"
                variant="outlined"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.no_rekening"
                :label="['dana', 'ovo', 'gopay'].includes(form.bank_tipe) ? 'Phone Number' : 'Account Number'"
                variant="outlined"
                required
                :rules="[
                  v => !!v || 'This field is required',
                  v => (v.length <= (['dana', 'ovo', 'gopay'].includes(form.bank_tipe) ? 14 : 20)) || `Maximum ${['dana', 'ovo', 'gopay'].includes(form.bank_tipe) ? 14 : 20} characters`
                ]"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="outlined"
          color="secondary"
          class="me-3"
          @click="showDialog = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="submitForm"
          :loading="bankStore.memuat"
        >
          {{ isEditing ? 'Update' : 'Save' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Error Snackbar -->
  <v-snackbar v-model="bankStore.galat" color="error" timeout="3000">
    {{ bankStore.galat }}
    <template v-slot:actions>
      <v-btn variant="text" @click="bankStore.hapusGalat">Close</v-btn>
    </template>
  </v-snackbar>
</template>
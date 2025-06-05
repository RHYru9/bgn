<script setup lang="ts">
import { defineProps } from 'vue';

interface Bank {
  id: number;
  bank_tipe: string;
  nama_rekening: string;
  no_rekening: string;
}

const props = defineProps<{
  banks: Bank[];
}>();
</script>

<template>
  <v-card variant="flat" rounded="lg" class="overflow-hidden">
    <v-card variant="outlined" rounded="lg" class="overflow-hidden">
      <div class="pa-5">
        <h5 class="text-subtitle-1 mb-0">Bank Cards</h5>
      </div>
      <v-divider></v-divider>
      <v-card-text class="pa-4">
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            v-for="(bank, index) in banks"
            :key="index"
            class="d-flex justify-center"
          >
            <v-card
              class="mx-auto"
              width="280"
              height="180"
              style="
                background: linear-gradient(135deg, #075B5E 0%, #FFE6E1 100%);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                border-radius: 16px;
                position: relative;
                overflow: visible;
                border: 1px solid rgba(255, 255, 255, 0.3);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
              "
            >
              <div class="card-line-box" style="
                position: absolute;
                top: -4px;
                left: -4px;
                right: -4px;
                bottom: -4px;
                border: 1px dashed rgba(255, 255, 255, 0.5);
                border-radius: 20px;
                pointer-events: none;
              "></div>

              <v-card-text class="d-flex flex-column justify-space-between h-100 pa-4">
                <div>
                  <h3 class="text-h6 font-weight-bold text-white mb-1">{{ bank.bank_tipe.toUpperCase() }}</h3>
                  <p class="text-white text-caption" style="opacity: 0.85;">bangungo.id</p>
                </div>

                <div class="d-flex align-center">
                  <div class="bg-white rounded-sm" style="width: 32px; height: 20px"></div>
                  <div class="text-subtitle-2 font-weight-medium text-white ml-3 letter-spacing">
                    **** {{ bank.no_rekening.slice(-4) }}
                  </div>
                </div>

                <div class="text-white text-caption mt-2" style="opacity: 0.9;">
                  {{ bank.nama_rekening }}
                </div>
              </v-card-text>

              <div
                style="
                  position: absolute;
                  right: 0;
                  top: 0;
                  height: 100%;
                  width: 50px;
                  background: white;
                  border-top-right-radius: 16px;
                  border-bottom-right-radius: 16px;
                "
                class="d-flex flex-column justify-center align-center"
              >
                <span
                class="font-weight-bold text-primary text-caption"
                style="transform: rotate(90deg); margin-bottom: 15px; white-space: nowrap;"
                >BANGUNGO
                </span>
            <div class="bg-primary rounded-circle"
                style="width: 14px; height: 14px;
                box-shadow: inset -2px -2px 4px rgba(0,0,0,0.1);
                margin-top:
                12px;">
            </div>

            </div>
        </v-card>
        </v-col>
    </v-row>
</v-card-text>
</v-card>
</v-card>
</template>

<style scoped>
.letter-spacing {
  letter-spacing: 1.5px !important;
}
</style>

<script setup lang="ts">
import { keranjangService } from '@/stores/apps/keranjang/KeranjangService';

defineProps({
  checkoutState: {
    type: Object,
    required: true
  }
});

function formatPrice(price: number) {
  return keranjangService.formatPrice(price);
}
</script>

<template>
  <v-card variant="outlined" class="mb-4">
    <v-card-title>Ringkasan Pesanan</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item v-for="item in checkoutState.keranjangItems" :key="item.id">
          <v-list-item-content>
            <v-list-item-title>{{ item.barang.nama_barang }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ item.jumlah }} x {{ formatPrice(item.barang.harga_jual) }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            {{ formatPrice(item.jumlah * parseFloat(item.barang.harga_jual)) }}
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-divider class="my-3" />

      <v-list>
        <v-list-item>
          <v-list-item-title>Subtotal</v-list-item-title>
          <v-list-item-action>
            {{ formatPrice(checkoutState.totalHarga) }}
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Ongkos Kirim</v-list-item-title>
          <v-list-item-action>
            {{ formatPrice(0) }} <!-- Adjust if you have shipping costs -->
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Total</v-list-item-title>
          <v-list-item-action class="font-weight-bold">
            {{ formatPrice(checkoutState.totalHarga) }}
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
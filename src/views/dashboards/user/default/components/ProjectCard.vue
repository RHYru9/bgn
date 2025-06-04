<script setup lang="ts">
import { shallowRef } from 'vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import CardHeader from '@/components/shared/CardHeader.vue';

const projectitems = shallowRef([
  {
    color: 'warning',
    name: 'Tata Letak Horizontal',
    task: '2'
  },
  {
    color: 'warning',
    name: 'Generator Invoice'
  },
  {
    color: 'primary',
    name: 'Peningkatan Paket'
  },
  {
    color: 'success',
    name: 'Figma Auto Layout'
  }
]);
</script>

<template>
  <CardHeader title="Proyek Saya" class="overflow-hidden">
    <div class="pa-6">
      <div class="d-flex justify-space-between mb-2">
        <p class="text-body-1 mb-0">Versi Rilis v1.2.0</p>
        <p class="text-body-1 mb-0">72%</p>
      </div>
      <v-progress-linear aria-label="progressbar" rounded color="primary" model-value="72" height="6"></v-progress-linear>

      <v-list class="py-5" aria-busy="true" aria-label="daftar proyek">
        <v-list-item v-for="(item, index) in projectitems" :key="index" :value="index" rounded="md">
          <template v-slot:prepend>
            <v-avatar size="8" :color="item.color"></v-avatar>
          </template>
          <span class="text-body-1">{{ item.name }}</span>
          <template v-slot:append>
            <v-chip size="small" rounded="md" v-if="item.task">
              <template v-slot:prepend>
                <SvgSprite name="custom-link1" class="me-1" style="width: 12px; height: 12px" />
              </template>
              {{ item.task }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list>

      <v-btn color="primary" variant="flat" rounded="md" block>
        <template v-slot:prepend>
          <SvgSprite name="custom-plus" style="width: 18px; height: 18px" />
        </template>
        Tambah Tugas
      </v-btn>
    </div>
  </CardHeader>
</template>

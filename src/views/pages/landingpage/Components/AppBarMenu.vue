<script setup lang="ts">
import { ref } from 'vue';
import { useDisplay } from 'vuetify';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import Logo from './LogoMain.vue';
import techData from '@/utils/techData';
import { useIspValue } from '@/utils/useIspValue';

import type { Technology } from '@/types/tech-types';

const { mdAndUp } = useDisplay();
const drawer = ref(false);
const isMenuOpen = ref(false);
const { ispValue } = useIspValue();

const url = ref<string>(ispValue.value ? '/login?isp=1' : '/login');

const getFinalUrl = (item: Technology) => {
  if (item.link !== '#!' && ispValue.value) {
    return `${item.link}?isp=1`;
  }
  return item.link;
};
</script>

<template>
  <v-app-bar elevation="0" flat height="74" class="border-bottom position-fixed" border="0">
    <v-container class="fill-height maxWidth">
      <div class="d-flex align-center ga-2 w-100">
        <div class="d-flex ga-1 align-center">
          <Logo />
          <v-chip rounded="lg" size="small" variant="outlined" color="secondary" class="px-1" style="height: 20px">BG</v-chip>
        </div>

        <v-spacer />

        <template v-if="mdAndUp">
          <v-btn variant="text" class="font-weight-medium" :to="ispValue ? '/home?isp=1' : '/'" target="_">
            Home
          </v-btn>
          <v-btn variant="text" class="font-weight-medium" :to="ispValue ? '/produk?isp=1' : '/produk'" target="_">
            Produk
          </v-btn>
          <v-btn variant="text" class="font-weight-medium" :to="ispValue ? '/bantuan?isp=1' : '/bantuan'">
            Bantuan
          </v-btn>

          <v-menu v-model="isMenuOpen" :close-on-content-click="false">
            <template #activator="{ props }">
              <v-btn variant="text" v-bind="props" class="font-weight-medium">
                Menu
                <SvgSprite
                  name="custom-chevron-down-2"
                  class="ms-1"
                  style="width: 15px; height: 15px; transition: 0.2s"
                  :style="{ transform: isMenuOpen ? 'rotate(-180deg)' : 'rotate(0deg)' }"
                />
              </v-btn>
            </template>
            <v-sheet rounded="md" width="170">
              <v-list class="py-0">
                <v-list-item
                  v-for="(item, index) in techData"
                  :key="index"
                  class="py-sm-3 py-2 px-sm-4 px-3"
                  :href="getFinalUrl(item as Technology)"
                  :target="item.target"
                >
                  <template #prepend>
                    <v-img
                      :src="item.image"
                      alt="technology"
                      style="width: 30px; height: 30px; min-width: 36px"
                      :style="item.name === 'Halaman Tidak Ditemukan' ? 'filter: grayscale(1)' : ''"
                    />
                  </template>
                  {{ item.title }}
                  <v-tooltip activator="parent" offset="-12" location="bottom">
                    <span class="text-caption">{{ item.name }}</span>
                  </v-tooltip>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-menu>

          <v-btn variant="flat" class="font-weight-medium ms-4" height="42px" color="success" rounded="md" :href="url" target="_">
            <template #prepend>
              <SvgSprite name="custom-link2" style="width: 20px; height: 20px" />
            </template>
            Masuk
          </v-btn>
        </template>

        <template v-else>
          <v-btn variant="outlined" color="warning" class="font-weight-medium" to="/bantuan" rounded="md">
            Support
          </v-btn>
          <v-btn icon rounded="sm" variant="text" size="small" @click.stop="drawer = !drawer">
            <SvgSprite name="custom-menu-outline" style="width: 20px; height: 20px" />
          </v-btn>
        </template>
      </div>
    </v-container>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary location="top" style="height: 310px" floating v-if="!mdAndUp">
    <v-list>
      <v-list-item :to="ispValue ? '/dashboard/default?isp=1' : '/dashboard/default'">
        <template #prepend>
          <SvgSprite name="custom-line" style="width: 20px; height: 20px" />
        </template>
        <v-list-item-title class="ms-3 text-h6">Dashboard</v-list-item-title>
      </v-list-item>
      <v-list-item :to="ispValue ? '/produk?isp=1' : '/produk'">
        <template #prepend>
          <SvgSprite name="custom-line" style="width: 20px; height: 20px" />
        </template>
        <v-list-item-title class="ms-3 text-h6">Produk</v-list-item-title>
      </v-list-item>
      <v-list-item :to="ispValue ? '/bantuan?isp=1' : '/bantuan'">
        <template #prepend>
          <SvgSprite name="custom-line" style="width: 20px; height: 20px" />
        </template>
        <v-list-item-title class="ms-3 text-h6">Bantuan</v-list-item-title>
      </v-list-item>

      <v-list-item class="px-5">
        <v-list-item-title>
          <v-menu v-model="isMenuOpen" :close-on-content-click="false">
            <template #activator="{ props }">
              <v-btn
                variant="text"
                v-bind="props"
                block
                class="preview-btn text-h6"
                style="justify-content: flex-start; padding: 0"
              >
                <template #prepend>
                  <SvgSprite name="custom-line" style="width: 20px; height: 20px" />
                </template>
                Menu
                <SvgSprite
                  name="custom-chevron-down-2"
                  class="ms-1"
                  style="width: 15px; height: 15px; transition: 0.2s"
                  :style="{ transform: isMenuOpen ? 'rotate(-180deg)' : 'rotate(0deg)' }"
                />
              </v-btn>
            </template>
            <v-sheet rounded="md" width="170">
              <perfect-scrollbar style="min-height: 320px; height: 320px">
                <v-list class="py-0">
                  <v-list-item
                    v-for="(item, index) in techData"
                    :key="index"
                    class="py-sm-3 py-2 px-sm-4 px-3"
                    :href="getFinalUrl(item as Technology)"
                    :target="item.target"
                  >
                    <template #prepend>
                      <v-img
                        :src="item.image"
                        alt="technology"
                        style="width: 30px; height: 30px; min-width: 36px"
                        :style="item.name === 'Menu Tidak Ada' ? 'filter: grayscale(1)' : ''"
                      />
                    </template>
                    {{ item.title }}
                  </v-list-item>
                </v-list>
              </perfect-scrollbar>
            </v-sheet>
          </v-menu>
        </v-list-item-title>
      </v-list-item>

      <v-list-item :href="url" target="_">
        <template #prepend>
          <SvgSprite name="custom-line" style="width: 20px; height: 20px" />
        </template>
        <v-list-item-title class="ms-3 text-h6">Masuk</v-list-item-title>
        <template #append>
          <v-chip color="primary" variant="flat" size="small">v1.0</v-chip>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style lang="scss">
.preview-btn {
  &:focus-visible {
    > .v-btn__overlay {
      opacity: 0;
    }
  }
  &.v-btn--active > .v-btn__overlay,
  &[aria-haspopup='menu'][aria-expanded='true'] > .v-btn__overlay {
    opacity: 0;
  }
  &:hover > .v-btn__overlay,
  &[aria-haspopup='menu'][aria-expanded='true']:hover > .v-btn__overlay {
    opacity: 0;
  }
}
</style>

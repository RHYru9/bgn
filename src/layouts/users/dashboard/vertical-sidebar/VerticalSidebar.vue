<script setup lang="ts">
import { shallowRef } from 'vue';
import { useCustomizerStore } from '../../../../stores/customizer';
import sidebarItems from './sidebarItem';

import NavGroup from './NavGroup/NavGroup.vue';
import NavItem from './NavItem/NavItem.vue';
import NavCollapse from './NavCollapse/NavCollapse.vue';
import ExtraBox from './extrabox/ExtraBox.vue';
import Logo from '../logo/LogoMain.vue';

const customizer = useCustomizerStore();
const sidebarMenu = shallowRef(sidebarItems);
</script>

<template>
  <v-navigation-drawer
    left
    v-model="customizer.sidebarDrawer"
    elevation="0"
    rail-width="90"
    mobile-breakpoint="lg"
    width="279"
    app
    class="leftSidebar"
    :rail="customizer.miniSidebar"
    expand-on-hover
  >
    <!---Logo part -->

    <div class="pa-5">
      <Logo />
    </div>
    <!-- ---------------------------------------------- -->
    <!---Navigation -->
    <!-- ---------------------------------------------- -->
    <perfect-scrollbar class="scrollnavbar" :options="{ suppressScrollX: true }">
      <v-list aria-busy="true" class="px-2" aria-label="menu list">
        <!---Menu Loop -->
        <template v-for="(item, i) in sidebarMenu" :key="i">
          <!---Item Sub Header -->
          <NavGroup :item="item" v-if="item.header" :key="item.title" />
          <!---Item Divider -->
          <v-divider class="my-3" v-else-if="item.divider" />
          <!---If Has Child -->
          <NavCollapse class="leftPadding" :item="item" :level="0" v-else-if="item.children" />
          <!---Single Item-->
          <NavItem :item="item" v-else />
          <!---End Single Item-->
        </template>
      </v-list>
      <div class="pa-4">
        <ExtraBox />
      </div>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>

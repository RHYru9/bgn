<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import { useCustomizerStore } from '../../../../stores/customizer';
import { useAuthStore } from '@/stores/auth';

const tab = ref(null);
const authStore = useAuthStore();
const customizer = useCustomizerStore();
const router = useRouter();

const userName = computed(() => {
  return authStore.user?.nama || 'Guest';
});

const goToProfile = () => {
  router.push('/app/akun/profil');
};

const goToBank = () => {
  router.push('/app/bank');
};

const profiledata1 = ref([
  {
    title: 'Edit profile',
    icon: 'custom-edit',
    action: goToProfile
  },
  {
    title: 'View Profile',
    icon: 'custom-user-1',
    action: goToProfile
  },
  {
    title: 'Akun Bank',
    icon: 'custom-wallet',
    action: goToBank
  }
]);
</script>

<template>
  <!-- Profile Dropdown -->
  <div>
    <div class="d-flex align-center pa-5">
      <v-avatar size="40" class="me-2">
        <img src="@/assets/images/users/avatar-6.png" width="40" alt="profile" />
      </v-avatar>
      <div>
        <h6 class="text-subtitle-1 mb-0">{{ userName }}</h6>
        <p class="text-caption text-lightText mb-0">Admin Sistem</p>
      </div>
      <div class="ms-auto">
        <v-btn
          variant="text"
          aria-label="logout"
          color="error"
          rounded="sm"
          icon
          size="large"
          @click="authStore.logout()"
        >
          <SvgSprite name="custom-logout-1" />
        </v-btn>
      </div>
    </div>

    <v-tabs v-model="tab" color="primary" grow>
      <v-tab value="111">
        <div class="v-icon--start">
          <SvgSprite name="custom-user-outline" style="width: 18px; height: 18px" />
        </div>
        Profil
      </v-tab>
    </v-tabs>

    <v-divider></v-divider>

    <perfect-scrollbar style="height: calc(100vh - 300px); max-height: 240px">
      <v-window v-model="tab">
        <v-window-item value="111">
          <v-list class="px-2" aria-label="profile list" aria-busy="true">
            <v-list-item
              v-for="(item, index) in profiledata1"
              :key="index"
              @click="item.action"
              color="primary"
              :base-color="customizer.actTheme === 'dark' ? 'lightText' : 'secondary'"
              rounded="md"
              :value="item.title"
            >
              <template v-slot:prepend>
                <div class="me-4">
                  <SvgSprite :name="item.icon || ''" style="width: 18px; height: 18px" />
                </div>
              </template>
              <v-list-item-title class="text-h6">{{ item.title }}</v-list-item-title>
            </v-list-item>

            <v-list-item
              @click="authStore.logout()"
              color="primary"
              :base-color="customizer.actTheme === 'dark' ? 'lightText' : 'secondary'"
              rounded="md"
            >
              <template v-slot:prepend>
                <div class="me-4">
                  <SvgSprite name="custom-logout-1" style="width: 18px; height: 18px" />
                </div>
              </template>
              <v-list-item-title class="text-h6">Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-window-item>

        <v-window-item value="222">
          <v-list class="px-2" aria-label="settings list" aria-busy="true">
            <v-list-item
              v-for="(item, index) in profiledata2"
              :key="index"
              @click="item.action"
              color="primary"
              :base-color="customizer.actTheme === 'dark' ? 'lightText' : 'secondary'"
              rounded="md"
              :value="item.title"
            >
              <template v-slot:prepend>
                <div class="me-4">
                  <SvgSprite :name="item.icon || ''" style="width: 18px; height: 18px" />
                </div>
              </template>
              <v-list-item-title class="text-h6">{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-window-item>
      </v-window>
    </perfect-scrollbar>
  </div>
</template>

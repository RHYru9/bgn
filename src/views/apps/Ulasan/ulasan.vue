<script setup lang="ts">
import { ref } from 'vue';
import { useDisplay } from 'vuetify';

import SvgSprite from '@/components/shared/SvgSprite.vue';
import { useIspValue } from '@/utils/useIspValue';
import techData from '@/utils/techData';
import type { Technology } from '@/types/tech-types';

const { smAndUp } = useDisplay();

const isMenuOpen = ref(false);

const { ispValue } = useIspValue();

const getFinalUrl = (item: Technology) => {
  if (item.link !== '#!' && ispValue.value) {
    return `${item.link}?isp=1`;
  }
  return item.link;
};
</script>

<template>
    <div class="ulasan">
        Ulasan Pembelian
        <main class="ulasan-container">

            <divider class="ulasan-divider">
            </divider>
        </main>
    </div>
</template>

<style>
.ulasan {
  font-size: 1.7000rem;
  line-height: 1.3;
  font-weight: 700;
  @media (max-width: 1264px) {
    font-size: 0.3rem;
  }
  @media (max-width: 800px) {
    font-size: 2rem;
  }
  @media (max-width: 768px) {
    font-size: 1.825rem;
  }
}

.ulasan-container {
    
}

</style>
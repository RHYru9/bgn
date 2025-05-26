<script setup lang="ts">
import { ref } from 'vue';
import { useDisplay } from 'vuetify';

import SvgSprite from '@/components/shared/SvgSprite.vue';
import { useIspValue } from '@/utils/useIspValue';
import techData from '@/utils/techData';

// types
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
  <div class="home-bg">
    <v-container class="maxWidth">
      <v-row class="spacer align-center justify-center">
        <v-col cols="12" lg="7" md="6" sm="8">
          <div class="pe-lg-4 homeContent text-center">
            <h1 class="bannerText mb-5" data-aos="fade-up" data-aos-duration="500">
              Your Custom Dashboard Starter
            </h1>
            <p class="mb-8 text-h5 font-weight-regular" data-aos="fade-up" data-aos-duration="800">
              Build and scale your application with a clean and customizable admin panel.
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <div class="technology">
      <v-list class="d-flex justify-center py-0" aria-busy="true" aria-label="technology">
        <v-list-item
          v-for="(item, index) in techData"
          class="py-sm-3 py-2 px-sm-4 px-3"
          :key="index"
          :href="getFinalUrl(item as Technology)"
          target="_blank"
        >
          <v-img :src="item.image" alt="technology" cover />
          <v-tooltip activator="parent" aria-label="tooltip" location="bottom" content-class="smallTooltip">
            <span class="text-caption">{{ item.name }}</span>
          </v-tooltip>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<style lang="scss">
.home-bg {
  overflow: hidden;
  min-height: 670px;
  position: relative;
  height: calc(100vh - 74px);
  padding-bottom: 92px;
  display: flex;
  align-items: center;
  @media (max-width: 1264px) {
    min-height: 540px;
  }
  @media (max-width: 599px) {
    min-height: 530px;
  }
}

.technology {
  border-top: 1px solid rgb(var(--v-theme-borderLight));
  border-bottom: 1px solid rgb(var(--v-theme-borderLight));
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  flex: 1 1 auto;
  overflow-x: auto;

  .v-list {
    flex: 1 0 auto;
  }

  .v-list-item {
    border-left: 1px solid rgb(var(--v-theme-borderLight));

    [dir='rtl'] & {
      border-right: 1px solid rgb(var(--v-theme-borderLight));
      border-left: unset;
    }

    &:last-child {
      border-right: 1px solid rgb(var(--v-theme-borderLight));

      [dir='rtl'] & {
        border-left: 1px solid rgb(var(--v-theme-borderLight));
      }
    }
  }

  .v-img {
    width: 65px;
    @media (max-width: 960px) {
      width: 50px;
    }
    @media (max-width: 599px) {
      width: 32px;
    }
  }
}

.homeContent {
  position: relative;
  z-index: 2;
  p {
    width: 76%;
    margin-inline: auto;
    @media (max-width: 1279px) {
      width: 100%;
    }
  }
}

.bannerText {
  font-size: 3.4375rem;
  line-height: 1.3;
  font-weight: 700;
  @media (max-width: 1264px) {
    font-size: 2rem;
  }
  @media (max-width: 800px) {
    font-size: 2rem;
  }
  @media (max-width: 768px) {
    font-size: 1.825rem;
  }
}

.text-animation {
  background: linear-gradient(90deg, rgb(37, 161, 244), rgb(249, 31, 169), rgb(37, 161, 244)) 0 0/400% 100%;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: move-bg 24s infinite linear;
}

@keyframes move-bg {
  100% {
    background-position: 400% 0;
  }
}
</style>

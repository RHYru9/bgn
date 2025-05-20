<script setup lang="ts">
import { ref } from 'vue';
import { useDisplay } from 'vuetify';

import SvgSprite from '@/components/shared/SvgSprite.vue';
import { useIspValue } from '@/utils/useIspValue';
import techData from '@/utils/techData';

// types
import type { Technology } from '@/types/tech-types';

const { smAndUp } = useDisplay();

const rating = ref(5);

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
              Explore One of the <span class="text-animation">Featured Dashboard</span> Template in Themeforest
            </h1>
            <p class="mb-8 text-h5 font-weight-regular" data-aos="fade-up" data-aos-duration="800">
              Able Pro is the one of the Featured admin dashboard template in Envato Marketplace and used by over 2.5K+ Customers wordwide.
            </p>
            <div data-aos="fade-up" class="d-flex ga-1 flex-wrap justify-center" data-aos-duration="1000">
              <v-btn
                color="secondary"
                rounded="md"
                :size="smAndUp ? 'large' : 'default'"
                variant="outlined"
                class="me-4"
                :to="ispValue ? '/components/buttons?isp=1' : '/components/buttons'"
                >Explore components</v-btn
              >
              <v-menu v-model="isMenuOpen" :close-on-content-click="false">
                <template #activator="{ props }">
                  <v-btn v-bind="props" color="primary" rounded="md" variant="flat" :size="smAndUp ? 'large' : 'default'">
                    Live preview
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
                    <v-list class="py-0" aria-busy="true" aria-label="technology">
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
                            :style="item.name === 'Live Preview not available' ? 'filter: grayscale(1)' : ''"
                          />
                        </template>
                        {{ item.title }}
                        <v-tooltip activator="parent" offset="-12" aria-label="tooltip" content-class="smallTooltip" location="bottom">
                          <span class="text-caption">{{ item.name }}</span>
                        </v-tooltip>
                      </v-list-item>
                    </v-list>
                  </perfect-scrollbar>
                </v-sheet>
              </v-menu>
            </div>
            <ul data-aos="fade-up" class="d-flex ratings justify-center mt-6" data-aos-duration="1100">
              <li style="list-style-type: none">
                <v-rating v-model="rating" :size="20" readonly color="inputBorder" active-color="warning" density="compact"></v-rating>
                <h4 class="text-h4 mt-1 mb-0">
                  4.7/5
                  <span class="font-weight-regular text-lightText" style="font-size: 75%">Ratings</span>
                </h4>
              </li>
              <li style="list-style-type: none">
                <span class="text-lightText text-caption">Sales</span>
                <h4 class="text-h4 mb-0">2.5K+</h4>
              </li>
            </ul>
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
          disbled
          target="_"
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
.ratings {
  gap: 30px;
  li {
    position: relative;
    + li {
      &::before {
        content: '';
        position: absolute;
        height: 30px;
        bottom: 10px;
        left: -15px;
        right: auto;
        width: 1px;
        background: rgb(var(--v-theme-borderLight));
        [dir='rtl'] & {
          left: unset;
          right: -15px;
        }
      }
    }
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
.widgetImages {
  max-width: 100%;
  filter: drop-shadow(0px 0px 50px rgb(33 150 243 / 30%));
}
</style>

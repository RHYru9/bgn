<script setup>
import Logo from '@/layouts/dashboard/logo/LogoMain.vue';
import AuthLogin from './authForms/AuthLogin.vue';
// assets
import facebookImg from '@/assets/images/icons/facebook.svg';
import twitterImg from '@/assets/images/icons/twitter.svg';
import googleImg from '@/assets/images/icons/google.svg';

import { createApp } from 'vue';
import { VueReCaptcha, useReCaptcha } from 'vue-recaptcha-v3';

const component = {
  setup() {
    const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();

    const recaptcha = async () => {
      // (optional) Wait until recaptcha has been loaded.
      await recaptchaLoaded();

      // Execute reCAPTCHA with action "login".
      // Removed the assignment of token since it's not being used
      await executeRecaptcha('login');

      // Do stuff with the received token.
    };

    return {
      recaptcha
    };
  },
  template: '<button @click="recaptcha">Execute recaptcha</button>'
};

createApp(component).use(VueReCaptcha, { siteKey: '6LeCprcaAAAAAOD0aEK7WpfHc__CyRmk3rD-otNt' });
</script>

<template>
  <v-row class="bg-containerBg position-relative" no-gutters>
    <div class="bg-blur">
      <div class="round-1"></div>
      <div class="round-2"></div>
    </div>
    <!---Login Part-->
    <v-col cols="12" lg="12" class="d-flex align-center">
      <v-container>
        <div class="d-flex align-center justify-center" style="min-height: calc(100vh - 148px)">
          <v-row justify="center">
            <v-col cols="12" md="12">
              <v-card elevation="0" variant="outlined" rounded="lg" class="loginBox bg-surface">
                <v-card-text class="pa-sm-10 pa-6">
                  <div class="text-center">
                    <Logo class="mb-5" />
                    <v-list aria-label="social list" aria-busy="true">
                      <v-list-item color="secondary" variant="tonal" href="#" rounded="md" class="mb-2">
                        <v-img
                          :src="facebookImg"
                          alt="social icon"
                          class="me-2 d-inline-flex"
                          style="vertical-align: middle"
                          width="9"
                          height="16"
                        />
                        Sign in with facebook
                      </v-list-item>
                      <v-list-item color="secondary" variant="tonal" href="#" rounded="md" class="mb-2">
                        <v-img
                          :src="twitterImg"
                          alt="social icon"
                          class="me-2 d-inline-flex"
                          style="vertical-align: middle"
                          width="16"
                          height="13"
                        />
                        Sign in with twitter
                      </v-list-item>
                      <v-list-item color="secondary" variant="tonal" href="#" rounded="md" class="mb-2">
                        <v-img
                          :src="googleImg"
                          alt="social icon"
                          class="me-2 d-inline-flex"
                          style="vertical-align: middle"
                          width="16"
                          height="16"
                        />
                        Sign in with google
                      </v-list-item>
                    </v-list>
                    <v-row>
                      <v-col cols="12" class="d-flex align-center">
                        <v-divider />
                        <div class="orbtn">OR</div>
                        <v-divider />
                      </v-col>
                    </v-row>
                  </div>
                  <!---Login Form-->
                  <AuthLogin />
                  <!---Login Form-->
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-col>
    <!---Login Part-->
  </v-row>
</template>
<style lang="scss">
.loginBox {
  max-width: 475px;
  margin: 0 auto;
}
</style>

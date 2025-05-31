<script setup lang="ts">
import { shallowRef } from 'vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import Logo from './LogoMain.vue';

const isExternalLink = (url: string) => {
  try {
    const linkUrl = new URL(url, window.location.origin);
    return linkUrl.origin !== window.location.origin;
  } catch (e) {
    return false;
  }
};

const value: string = window.location.search;
const params = new URLSearchParams(value);
const ispValue = params.get('isp');

const getFinalUrl = (link: string) => {
  if (link !== '#!' && ispValue) {
    return `${link}?isp=1`;
  }
  return link;
};

const list1 = shallowRef([
  { name: 'Profil Perusahaan', link: '/profil' },
  { name: 'Beranda', link: '/' },
  { name: 'Github', link: 'https://github.com/rhyru9/' }
]);
const list2 = shallowRef([
  { name: 'Dokumentasi API', link: 'https://github.com/rhyru9/bangunan-api' },
  { name: 'FAQ', link: '/faq' },
  { name: 'Pusat Dukungan Teknis', link: '/support' },
  { name: 'Kontak Kami', link: '/kontak' }
]);
const list3 = shallowRef([
  { name: 'PT Semen Gresik', link: '/' },
  { name: 'PT Paku Indonesia', link: '/' },
  { name: 'PT Paku Lamongan', link: '/' },
  { name: 'PT Pasir Nusantara', link: '/' },
  { name: 'PT Cat Warna', link: '/' },
  { name: 'PT Pribumi Bangun Jaya', link: '/' }
]);
const list4 = shallowRef([
  { name: 'Syarat & Ketentuan', link: '/syarat-ketentuan' },
  { name: 'Karir di bangunGO', link: '/karir' },
  { name: 'Kebijakan Privasi', link: '/kebijakan-privasi' }
]);
</script>

<template>
  <v-footer class="bg-gray100 py-md-16 py-8 flex-column position-relative">
    <v-row>
      <v-col cols="12">
        <v-container>
          <v-row>
            <v-col lg="4" cols="12">
              <div class="contactDetails pe-lg-6">
                <Logo />
                <p class="mt-4 text-h6">
                  bangunGO dipercaya oleh ribuan pengguna di seluruh Indonesia sebagai solusi manajemen bahan bangunan dan proyek konstruksi. Kami berkomitmen menyediakan layanan dan produk terbaik untuk kebutuhan pembangunan Anda.
                </p>
              </div>
            </v-col>

            <v-col lg="2" md="3" cols="6">
              <h5 class="text-h5 mb-md-6 mb-4">Perusahaan</h5>
              <div class="d-flex flex-column footer-list">
                <a
                  v-for="(item, i) in list1"
                  :key="i"
                  :href="item.link"
                  :target="isExternalLink(item.link) ? '_blank' : null"
                  rel="noopener"
                  class="text-h6"
                >
                  {{ item.name }}
                </a>
              </div>
            </v-col>

            <v-col lg="2" md="3" cols="6">
              <h5 class="text-h5 mb-md-6 mb-4">Bantuan & Dukungan</h5>
              <div class="d-flex flex-column footer-list">
                <a
                  v-for="(item, i) in list2"
                  :key="i"
                  :href="item.link"
                  :target="isExternalLink(item.link) ? '_blank' : null"
                  rel="noopener"
                  class="text-h6"
                >
                  {{ item.name }}
                </a>
              </div>
            </v-col>

            <v-col lg="2" md="3" cols="6">
              <h5 class="text-h5 mb-md-6 mb-4">Mitra Kami</h5>
              <div class="d-flex flex-column footer-list">
                <a
                  v-for="(item, i) in list3"
                  :key="i"
                  :href="getFinalUrl(item.link)"
                  :target="isExternalLink(item.link) ? '_blank' : null"
                  rel="noopener"
                  class="text-h6"
                >
                  {{ item.name }}
                </a>
              </div>
            </v-col>

            <v-col lg="2" md="3" cols="6">
              <h5 class="text-h5 mb-md-6 mb-4">Informasi Lainnya</h5>
              <div class="d-flex flex-column footer-list">
                <a
                  v-for="(item, i) in list4"
                  :key="i"
                  :href="item.link"
                  :target="isExternalLink(item.link) ? '_blank' : null"
                  rel="noopener"
                  class="text-h6"
                >
                  {{ item.name }}
                </a>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-footer>

  <v-divider></v-divider>

  <div class="sub-footer text-surface bg-gray100 py-4">
    <v-container class="py-0">
      <v-row class="align-center">
        <v-col sm="6">
          <h6 class="text-h6 text-lightText mb-0">
            © 2025 <span class="text-primary">bangunGO</span>. Dibuat dengan sepenuh hati oleh tim RhyRu9 Indonesia.
          </h6>
        </v-col>
        <v-col sm="6" class="text-end">
          <v-btn
            icon
            variant="plain"
            size="small"
            href="https://github.com/rhyru9/"
            target="_blank"
            rel="noopener"
            aria-label="github"
            color="secondary"
          >
            <SvgSprite name="custom-github" />
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style lang="scss">
.footer-list {
  a {
    color: rgb(var(--v-theme-darkText));
    &:hover {
      color: rgb(var(--v-theme-primary));
      text-decoration: none;
    }
    + a {
      margin-top: 20px;
      @media (max-width: 991px) {
        margin-top: 10px;
      }
    }
  }
}
</style>

const PublicRoutes = {
  path: '/',
  component: () => import('@/layouts/blank/BlankLayout.vue'),
  meta: {
    requiresAuth: false
  },
  children: [
    {
      name: 'Landing',
      path: '/',
      component: () => import('@/views/pages/landingpage/LandingPage.vue')
    },
    {
      name: 'Authentication',
      path: '/login',
      component: () => import('@/views/authentication/LoginPage.vue')
    },
    {
      name: 'ContactUs',
      path: '/contact-us',
      component: () => import('@/views/pages/landingpage/ContactUs.vue')
    },
    {
      name: 'PrivacyPolicy',
      path: '/privacy-policy',
      component: () => import('@/views/pages/landingpage/PrivacyPolicy.vue')
    },
    {
      path: '/produk',
      name: 'PublicProductPage',
      component: () => import('@/views/pages/landingpage/ProductPage.vue')
    },
    {
      name: 'Product Checkout',
      path: '/ecommerce/checkout',
      component: () => import('@/components/apps/ecommerce/cart/CartCheckout.vue'),
    },
    {
      name: 'FAQs',
      path: '/faq',
      component: () => import('@/views/pages/landingpage/FAQs.vue')
    },
    {
      name: 'Produk Detail',
      path: '/produk/detail/:id',
      component: () => import('@/views/apps/eCommerce/ProductDetail.vue')
    },
    {
      name: 'Reset Password 2',
      path: '/reset-pwd2',
      component: () => import('@/views/authentication/auth2/ResetPwd2.vue')
    },
    {
      name: 'Register',
      path: '/register',
      component: () => import('@/views/authentication/auth1/RegisterPage1.vue')
    },
    {
      name: 'Verifikasi',
      path: '/verifikasi',
      component: () => import('@/views/authentication/auth2/verfikasiKode.vue')
    },
    {
      name: 'Forgot Password',
      path: '/lupa-password',
      component: () => import('@/views/authentication/auth1/ForgotPwd1.vue')
    },
    {
      name: 'Check Mail',
      path: '/cek-email',
      component: () => import('@/views/authentication/auth1/CheckMail1.vue')
    },
    {
      name: 'Reset Password',
      path: '/reset-pwd1',
      component: () => import('@/views/authentication/auth1/ResetPwd1.vue')
    },
    {
      name: 'Profil Perusahaan',
      path: '/profil',
      component: () => import('@/views/pages/landingpage/Components/ProfilePerusahaan.vue')
    },
    {
      name: 'Syarat dan Ketentuan',
      path: '/syarat-ketentuan',
      component: () => import('@/views/pages/landingpage/Components/syarat-ketentuan.vue')
    },
    {
      name: 'Karir Form',
      path: '/karir',
      component: () => import('@/views/pages/landingpage/Components/karirForm.vue')
    },
    {
      name: 'Privasi',
      path: '/kebijakan-privasi',
      component: () => import('@/views/pages/landingpage/Components/privasi.vue')
    },
    {
      name: 'Kontak Kami',
      path: '/kontak',
      component: () => import('@/views/pages/landingpage/Components/Kontak.vue')
    },
    {
      name: 'Dukungan Teknis',
      path: '/support',
      component: () => import('@/views/pages/landingpage/Components/DukunganTeknis.vue')
    },
    {
      name: 'Coming Soon 1',
      path: '/comingsoon1',
      component: () => import('@/views/pages/maintenance/comingsoon/ComingSoonPage1.vue')
    },
    {
      name: 'Coming Soon 2',
      path: '/comingsoon2',
      component: () => import('@/views/pages/maintenance/comingsoon/ComingSoonPage2.vue')
    },
    {
      name: 'Under Construction 1',
      path: '/construction1',
      component: () => import('@/views/pages/underconstruction/UnderConstruction1.vue')
    },
    {
      name: 'Under Construction 2',
      path: '/construction2',
      component: () => import('@/views/pages/underconstruction/UnderConstruction2.vue')
    },
    {
      name: 'Error 404',
      path: '/error',
      component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
    },
    {
      name: 'Error 500',
      path: '/error500',
      component: () => import('@/views/pages/maintenance/error/Error500Page.vue')
    }
  ]
};

export default PublicRoutes;

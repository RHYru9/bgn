const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true
  },
  redirect: '/main/dashboard/default',
  component: () => import('@/layouts/dashboard/DashboardLayout.vue'),
  children: [
    {
      name: 'Default',
      path: '/dashboard/default',
      component: () => import('@/views/dashboards/default/DefaultDashboard.vue'),
      meta: { roles: ['admin', 'user', 'driver'] }
    },
    {
      name: 'Customer',
      path: '/customer/customerlist',
      component: () => import('@/views/apps/customer/CustomerList.vue'),
      meta: { roles: ['admin'] }
    },
    {
      name: 'Karir',
      path: '/customer/karirList',
      component: () => import('@/views/apps/customer/karirList.vue'),
    },
    {
      name: 'Order Details',
      path: '/app/customer/order-details',
      component: () => import('@/views/apps/customer/order-details/OrderDetailPage.vue'),
      meta: { roles: ['admin'] }
    },
    {
      name: 'Invoice dashboard',
      path: '/app/transaksi/dashboard',
      component: () => import('@/views/apps/invoice/MyDashboard.vue'),
      meta: { roles: ['admin'] }
    },
    {
      name: 'Transaksi Dashboard',
      path: '/app/transaksi/buat',
      component: () => import('@/views/apps/customer/BuatTransaksi.vue'),
      meta: { roles: ['admin'] }
    },
    {
      name: 'OrderList',
      path: '/app/transaksi/list',
      component: () => import('@/views/apps/customer/OrderList.vue'),
      meta: { roles: ['admin'] }
    },
    {
      name: 'UserProfile',
      path: '/app/user/userprofile',
      component: () => import('@/views/apps/users/user-profile/UserProfilePage.vue'),
      meta: { roles: ['admin', 'user', 'driver'] }
    },
    {
      name: 'Profile',
      path: '/app/akun/profil',
      component: () => import('@/views/apps/users/account-profile/profile3/ProfilePage3.vue'),
      meta: { roles: ['admin', 'user', 'driver'] }
    },
    {
      name: 'Add Products',
      path: '/ecommerce/add-product',
      component: () => import('@/views/apps/eCommerce/AddProduct.vue'),
      meta: { roles: ['admin'] }
    },
    {
      name: 'Product Listing',
      path: '/ecommerce/productlist',
      component: () => import('@/views/apps/eCommerce/ProductList.vue'),
      meta: { roles: ['admin'] }
    },
    {
      name: 'kategori',
      path: '/ecommerce/kategori/list',
      component: () => import('@/views/apps/kategori/listkategori.vue'),
      meta: { roles: ['admin'] }
    },
    {
      path: '/ulasan/ulasan',
      name: 'ulasan',
      component: () => import('@/views/apps/Ulasan/ulasan.vue'),
      meta: { roles: ['admin'] }
    },
    {
      name: 'Supplier',
      path: '/ecommerce/supplier',
      component: () => import('@/views/apps/eCommerce/Supplier.vue'),
      meta: { roles: ['admin'] }
    },
    {
      path: '/ecommerce/supplier/add',
      name: 'AddSupplier',
      component: () => import('@/views/apps/eCommerce/AddSupplier.vue'),
      meta: { roles: ['admin'] }
    }
  ]
};

export default MainRoutes;
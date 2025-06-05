const userRoutes = {
    path: '/main',
    meta: {
        requiresAuth: true
    },
    redirect: '/main/user/dashboard',
    component: () => import('@/layouts/users/dashboard/DashboardLayout.vue'),
    children: [
    {
        name: 'dashboard',
        path: '/user/dashboard',
        component: () => import('@/views/dashboards/user/default/DefaultDashboard.vue'),
    },
    {
        name: 'Detail Transaksi',
        path: '/app/user/transaksi',
        component: () => import('@/views/apps/user/transaksi/invoice/MyDashboard.vue')
    },
    {
        name: 'Profile',
        path: '/app/akun/profil',
        component: () => import('@/views/apps/user/profile/UserProfilePage.vue')
    },
    {
        name: 'Security',
        path: '/app/akun/security',
        component: () => import('@/views/apps/user/profile/SecurityTab.vue'),
    },
    {
        name: 'bank',
        path: '/app/bank',
        component: () => import('@/views/apps/user/profile/BillingTab.vue')
    },
    {
        name: 'transaksi List',
        path: '/app/transaksi/user',
        component: () => import('@/views/apps/user/transaksi/transaksiSaya.vue')
    },
    ]
};

export default userRoutes;
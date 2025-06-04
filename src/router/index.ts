import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import PublicRoutes from './PublicRoutes';
import ComponentRoutes from './ComponentRoutes';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import userRoutes from './userRoutes';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
    },
    PublicRoutes,
    MainRoutes,
    userRoutes,
    ComponentRoutes
  ]
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  const uiStore = useUIStore();
  uiStore.isLoading = true;

  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path) && to.matched.some((record) => record.meta.requiresAuth);

  if (authRequired && !auth.user) {
    auth.returnUrl = to.fullPath;
    return next('/login');
  }

  next();
});

router.afterEach(() => {
  const uiStore = useUIStore();
  uiStore.isLoading = false;
});

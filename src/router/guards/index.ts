import { type Router } from 'vue-router';
import { TOKEN } from '@/utils/constant';

export default function ensureHooks(router: Router) {
  router.beforeEach((to, from, next) => {
    const token:string|null = localStorage.getItem(TOKEN);

    if (!token && to.path !== '/login') {
      next('/login');
    } else {
      next();
    }
  });
}

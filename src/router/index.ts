import {
  createRouter, createWebHistory, type RouteRecordRaw, type RouterHistory, type Router,
} from 'vue-router';
import type { App } from 'vue';
import HomeView from '../views/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
];

let router: Router | null = null;
let history: RouterHistory | null = null;

export default (app: App) => {
  history = createWebHistory();
  router = createRouter({
    history,
    routes,
  });
  app.use(router);
};

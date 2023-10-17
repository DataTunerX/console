import {
  createRouter, createWebHistory, type RouteRecordRaw, type RouterHistory, type Router,
} from 'vue-router';
import type { App } from 'vue';
import DatasetList from '@/views/dataset/DatasetList.vue';
import DatasetCreate from '@/views/dataset/DatasetCreate.vue';
import Home from '@/views/HomeView.vue';
import RouterContent from '@/views/RouterContent.vue';
import DatasetDetail from '@/views/dataset/DatasetDetail.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: {
      name: 'Datasets',
    },
    children: [
      {
        path: 'datasets',
        component: RouterContent,
        children: [
          {
            path: '',
            name: 'Datasets',
            component: DatasetList,
          },
          {
            path: 'create',
            name: 'DatasetCreate',
            component: DatasetCreate,
          },
          {
            path: ':id',
            name: 'DatasetDetail',
            component: DatasetDetail,
          },
        ],
      },
      {
        path: 'home',
        name: 'Home',
        component: Home,
      },

    ],
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

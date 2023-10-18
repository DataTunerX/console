import {
  createRouter, createWebHistory, type RouteRecordRaw, type RouterHistory, type Router,
} from 'vue-router';
import type { App } from 'vue';
import DatasetList from '@/views/dataset/DatasetList.vue';
import DatasetCreate from '@/views/dataset/DatasetCreate.vue';
import HyperparameterList from '@/views/hyperparameter/HyperparameterList.vue';
import HyperparameterCreate from '@/views/hyperparameter/HyperparameterCreate.vue';
import RouterContent from '@/views/RouterContent.vue';
import DatasetDetail from '@/views/dataset/DatasetDetail.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: {
      name: 'DatasetList',
    },
    children: [
      {
        path: 'datasets',
        component: RouterContent,
        children: [
          {
            path: '',
            name: 'DatasetList',
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
        path: 'hyperparameter',
        component: RouterContent,
        children: [
          {
            path: '',
            name: 'HyperparameterList',
            component: HyperparameterList,
          },
          {
            path: 'create',
            name: 'HyperparameterCreate',
            component: HyperparameterCreate,
          },
        ],

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

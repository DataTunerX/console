import {
  createRouter, type RouteRecordRaw, type RouterHistory, type Router, createWebHashHistory,
} from 'vue-router';
import type { App } from 'vue';
import RouterContent from '@/views/RouterContent.vue';

import DatasetList from '@/views/dataset/DatasetList.vue';
import DatasetCreate from '@/views/dataset/DatasetCreate.vue';
import DatasetDetail from '@/views/dataset/DatasetDetail.vue';

import HyperparameterList from '@/views/hyperparameter/HyperparameterList.vue';
import HyperparameterCreate from '@/views/hyperparameter/HyperparameterCreate.vue';
import HyperparameterDetail from '@/views/hyperparameter/HyperparameterDetail.vue';

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
            path: ':name',
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
          {
            path: ':name',
            name: 'HyperparameterDetail',
            component: HyperparameterDetail,
          },
        ],

      },

    ],
  },
];

let router: Router | null = null;
let history: RouterHistory | null = null;

export default (app: App) => {
  history = createWebHashHistory();
  router = createRouter({
    history,
    routes,
  });
  app.use(router);
};

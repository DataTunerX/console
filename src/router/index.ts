import {
  createRouter, type RouteRecordRaw, type RouterHistory, type Router, createWebHistory,
} from 'vue-router';
import type { App } from 'vue';
import RouterContent from '@/views/RouterContent.vue';

import DatasetList from '@/views/dataset/DatasetList.vue';
import DatasetCreate from '@/views/dataset/DatasetCreate.vue';
import DatasetDetail from '@/views/dataset/DatasetDetail.vue';

import HyperparameterList from '@/views/hyperparameter/HyperparameterList.vue';
import HyperparameterCreate from '@/views/hyperparameter/HyperparameterCreate.vue';
import HyperparameterDetail from '@/views/hyperparameter/HyperparameterDetail.vue';

import FinetuneExperimentList from '@/views/finetune-experiment/FinetuneExperimentList.vue';
import FinetuneExperimentDetail from '@/views/finetune-experiment/FinetuneExperimentDetail.vue';
import FinetuneExperimentCreate from '@/views/finetune-experiment/FinetuneExperimentCreate.vue';
import FinetuneExperimentJobDetail from '@/views/finetune-experiment-job/FinetuneExperimentJobDetail.vue';

import FinetuneRegistryList from '@/views/finetune-registry/FinetuneRegistryList.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: {
      name: 'FinetuneExperimentList',
    },
    children: [
      {
        path: 'fine-tune',
        component: RouterContent,
        children: [
          {
            path: '',
            name: 'FinetuneExperimentList',
            component: FinetuneExperimentList,
          },
          {
            path: 'create',
            name: 'FinetuneExperimentCreate',
            component: FinetuneExperimentCreate,
          },
          {
            path: ':name',
            name: 'FinetuneExperimentDetail',
            component: FinetuneExperimentDetail,
          },
          {
            path: ':name/job/:jobName',
            name: 'FinetuneExperimentJobDetail',
            component: FinetuneExperimentJobDetail,
          },
        ],

      },
      {
        path: 'finetune-registry',
        component: RouterContent,
        children: [
          {
            path: '',
            name: 'FinetuneRegistryList',
            component: FinetuneRegistryList,
          },
        ],
      },
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
  history = createWebHistory();
  router = createRouter({
    history,
    routes,
  });
  app.use(router);
};

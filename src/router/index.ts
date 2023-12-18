import { App } from 'vue';
import {
  createRouter, type RouteRecordRaw, type RouterHistory, type Router, createWebHistory,
} from 'vue-router';
import Guards from '@/router/guards/index';
import RouterContent from '@/layout/RouterContent.vue';
import ConsoleContainer from '@/layout/console-container.vue';

import Login from '@/views/login/Login.vue';

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

import ModelRegistryList from '@/views/model-registry/ModelRegistryList.vue';

import InferenceApplicationList from '@/views/inference-application/InferenceApplicationList.vue';
import InferenceApplicationModelCompare from '@/views/inference-application/InferenceApplicationModelCompare.vue';
import JobList from '@/views/finetune-experiment/components/JobList.vue';
import JobComparison from '@/views/finetune-experiment/components/JobComparison.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: {
      name: 'Login',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/ns',
    name: 'ConsoleContainer',
    component: ConsoleContainer,
    children: [
      {
        path: ':ns',
        component: RouterContent,
        children: [
          {
            path: 'finetune',
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
                redirect: {
                  name: 'JobList',
                },
                children: [
                  {
                    path: 'job-list',
                    name: 'JobList',
                    component: JobList,
                  },
                  {
                    path: 'job-comparison',
                    name: 'JobComparison',
                    component: JobComparison,
                  },
                ],
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
                name: 'ModelRegistryList',
                component: ModelRegistryList,
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

          {
            path: 'inference-application',
            component: RouterContent,
            children: [
              {
                path: '',
                name: 'InferenceApplicationList',
                component: InferenceApplicationList,
              },
              {
                path: 'inference-application-model-compare',
                name: 'InferenceApplicationModelCompare',
                component: InferenceApplicationModelCompare,
              },
            ],
          },

        ],
      },
    ],
  },
  {
    path: '/:pathMatch(.*)',
    redirect: {
      name: 'Login',
    },
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
  Guards(router);
};

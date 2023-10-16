import type { App } from 'vue';

import daoStyle from '@dao-style/core';
import '@dao-style/core/dist/style.css';

import {
  createNoty, installer, DaoHistoryLink, createGlobalLoading, vLoading, DaoConfirmDialogFooter,
} from '@dao-style/extend';

const components = {
  DaoHistoryLink,
  DaoConfirmDialogFooter,
};

export const noty = createNoty();

export const useGlobalLoading = createGlobalLoading();

const installDaoStyle = (Vue: App): void => {
  Vue.use(daoStyle);
  Vue.use(installer(components));
  noty.install(Vue);
  useGlobalLoading.install(Vue);
  Vue.directive('loading', vLoading);
};

export default installDaoStyle;

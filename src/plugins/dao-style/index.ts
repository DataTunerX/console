import type { App } from 'vue';

import daoStyle from '@dao-style/core';
import '@dao-style/core/dist/style.css';

import {
  createNoty,
  installer,
  DaoHistoryLink,
  createGlobalLoading,
  vLoading,
  setNotyDefault,
  DaoConfirmDialogFooter,
  DaoStateIcon,
  DaoHoverCard,
  DaoLabelExtend,
  DaoFormItemValidate,
  DaoMultiRowEditor,
  DaoKeyValueLayout,
  DaoKeyValueLayoutItem,
  DaoKeyValueEditor,
  registerAllValidations,
  type VueI18nLike,
} from '@dao-style/extend';

const components = {
  DaoHistoryLink,
  DaoConfirmDialogFooter,
  DaoStateIcon,
  DaoHoverCard,
  DaoLabelExtend,
  DaoMultiRowEditor,
  DaoKeyValueLayout,
  DaoKeyValueLayoutItem,
  DaoFormItemValidate,
  DaoKeyValueEditor,
};

setNotyDefault({
  showClose: true,
});

export const noty = createNoty();

export const useGlobalLoading = createGlobalLoading();

const installDaoStyle = (Vue: App, vueI18nLike: VueI18nLike): void => {
  Vue.use(daoStyle);
  Vue.use(installer(components));
  noty.install(Vue);
  useGlobalLoading.install(Vue);
  Vue.directive('loading', vLoading);
  registerAllValidations(vueI18nLike);
};

export default installDaoStyle;

import { App } from 'vue';
import routerInstall from '@/router';
import VueDOMPurifyHTML from 'vue-dompurify-html';
import { errorHandlers, type ErrorHandler } from './fetch';
import daoStyleInstall from './dao-style';
import i18nInstall, { loadLocaleMessages, i18n, loadLanguageAsync } from './vue-i18n';
import piniaInstall from './pinia';
import dayjsInstall, { loadDayjsLanguageAsync } from './dayjs';
import './vee-validate';

export default function install<T>(app: App<T>) {
  app.use(routerInstall);
  app.use(daoStyleInstall, i18n);
  app.use(i18nInstall);
  app.use(dayjsInstall);
  app.use(piniaInstall);
  app.use(VueDOMPurifyHTML);
}

export {
  loadLocaleMessages,
  i18n,
  loadLanguageAsync,
  errorHandlers,
  type ErrorHandler,
  loadDayjsLanguageAsync,
};

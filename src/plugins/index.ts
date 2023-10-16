import type { App } from 'vue';
import routerInstall from '@/router';
import { errorHandlers, type ErrorHandler } from './fetch';
import daoStyleInstall from './dao-style';
import i18nInstall, { loadLocaleMessages, i18n, loadLanguageAsync } from './vue-i18n';
import piniaInstall from './pinia';
import dayjsInstall from './dayjs';

export default function install<T>(app: App<T>) {
  app.use(routerInstall);
  app.use(daoStyleInstall);
  app.use(i18nInstall);
  app.use(dayjsInstall);
  app.use(piniaInstall);
}

export {
  loadLocaleMessages, i18n, loadLanguageAsync, errorHandlers, type ErrorHandler,
};

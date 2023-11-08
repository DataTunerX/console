import type { App } from 'vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(utc);
dayjs.extend(relativeTime);

const dayjsInstall = (Vue: App): void => {
  const app = Vue;

  app.config.globalProperties.$dayjs = dayjs;
};

function setDayjsLocal(lang: string) {
  dayjs.locale(lang);

  return lang;
}

export function loadDayjsLanguageAsync(lang = 'zh-CN') {
  let language = lang;

  if (!language) {
    language = window.navigator.language;
  }
  if (language.toLowerCase().includes('zh')) {
    language = 'zh-cn';
  } else {
    language = 'en';
  }

  return Promise.resolve(setDayjsLocal(language));
}

export { dayjs };

export default dayjsInstall;

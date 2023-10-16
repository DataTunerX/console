import dayjs from 'dayjs';
import type { App } from 'vue';

const dayjsInstall = (Vue: App): void => {
  const app = Vue;

  app.config.globalProperties.$dayjs = dayjs;
};

export default dayjsInstall;

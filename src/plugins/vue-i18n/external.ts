import DaoStyleCore from '@dao-style/core';
import { setFetchAcceptLanguage } from '@/plugins/fetch/request';

export async function loadExternalLanguage(lang: string) {
  const { default: daoStyleExtend } = await import(
    `@dao-style/extend/dist/locales/${lang}.js`
  );
  const daoStyleCore = DaoStyleCore.locale(lang);

  return [
    daoStyleExtend,
    daoStyleCore,
  ];
}

// 单独拆出来方便cli-plugin修改
export function setI18nLanguageExternal(lang: string) {
  setFetchAcceptLanguage(lang);

  const html = document.querySelector('html');

  html?.setAttribute('lang', lang);
}

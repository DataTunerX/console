import { createI18n, LocaleMessages, VueMessageType } from 'vue-i18n';
import { App } from 'vue';
import { loadExternalLanguage, setI18nLanguageExternal } from './external';

function getRegisterMap(path: string[], map: Record<string | symbol, unknown>) {
  const { length } = path;

  if (length > 1) {
    let tMap = map;

    for (let i = 0; i < length - 1; i += 1) {
      const key = path[i];

      if (!tMap[key]) {
        const messages = {};

        tMap[key] = messages;
      }

      tMap = tMap[key] as Record<string | symbol, unknown>;
    }

    return tMap;
  }

  return map;
}

function getFileName(fileName: string) {
  let rst = fileName;

  if (fileName.includes('.')) {
    [rst] = fileName.split('.');
  }

  return rst;
}

/**
 * Load locale messages
 *
 * The loaded `JSON` locale messages is pre-compiled by `@intlify/vue-i18n-loader`,
 * which is integrated into `vue-cli-plugin-i18n`.
 * See: https://github.com/intlify/vue-i18n-loader#rocket-i18n-resource-pre-compilation
 */
export function loadLocaleMessages(
  locales: __WebpackModuleApi.RequireContext,
): LocaleMessages<VueMessageType> {
  const messages: LocaleMessages<VueMessageType> = {};

  locales.keys().forEach((key) => {
    const matched = key.substring(2).split('/');
    let rst = locales(key);

    if (rst.default && typeof rst.default === 'object') {
      rst = rst.default;
    }
    if (matched && matched.length > 1) {
      const { length } = matched;
      const localMap = getRegisterMap(matched, messages);
      const locale = getFileName(matched[length - 1]);

      localMap[locale] = rst;
    } else if (matched?.length === 1) {
      const locale = getFileName(matched[0]);

      messages[locale] = rst;
    }
  });

  return messages;
}

const i18nPlugin = createI18n({
  legacy: false,
  globalInjection: true,
  locale: process.env.VUE_APP_I18N_LOCALE || 'zh-CN',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en-US',
});

export default function i18nInstall(app: App) {
  app.use(i18nPlugin);
}

export const i18n = i18nPlugin.global;

const loadedLanguages: string[] = [];

function setI18nLanguage(lang: string) {
  i18n.locale.value = lang;

  setI18nLanguageExternal(lang);

  return lang;
}

export function loadLanguageAsync(lang: string) {
  let language = lang;

  if (!language) {
    language = window.navigator.language;
  }
  if (language.toLowerCase().includes('zh')) {
    language = 'zh-CN';
  } else {
    language = 'en-US';
  }
  // If the language was already loaded
  if (loadedLanguages.includes(language)) {
    return Promise.resolve(setI18nLanguage(language));
  }

  // If the language hasn't been loaded yet

  return import(
    /* webpackChunkName: "lang-[request]" */ `../../locales/${language}/lang.ts`
  ).then(async (messages) => {
    i18n.setLocaleMessage(language, messages.default);

    const externalLang = await loadExternalLanguage(language);

    externalLang.forEach((l) => {
      i18n.mergeLocaleMessage(language, l);
    });

    loadedLanguages.push(language);

    return setI18nLanguage(language);
  });
}

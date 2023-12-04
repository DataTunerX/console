import { defineStore, acceptHMRUpdate } from 'pinia';

import { loadLanguageAsync, errorHandlers, type ErrorHandler } from '@/plugins';
import { TOKEN, USERNAME, FAVICON } from '@/utils/constant';
import pathJoin from '@/utils/pathJoin';
import getUrlBase from '@/utils/getUrlBase';
import type { GProduct, TopNavResponse, GetGProductLicensesOverQuotaResponse } from '@/types/nav';
import { App } from 'vue';

// eslint-disable-next-line max-len
type StoreValues = string | GProduct[] | number | TopNavResponse | GetGProductLicensesOverQuotaResponse;

type Handler<T> = Map<string, Set<T>>

const handlers: Handler<(val: StoreValues) => void> = new Map();

type LoadLanguageAsync = typeof loadLanguageAsync;

const loadLanguageAsyncHandlers: Handler<LoadLanguageAsync> = new Map([['anakin', new Set([loadLanguageAsync])]]);

const setFn = (id: string, val: StoreValues) => {
  handlers.get(id)
    ?.forEach((fn) => {
      if (typeof fn === 'function') {
        fn(val);
      }
    });
};

const globalStateFn = () => ({
  idToken: localStorage.getItem(TOKEN) || '',
  username: localStorage.getItem(USERNAME) || '',
  email: '',
  locale: '',
  productList: [] as GProduct[],
  noticeUnread: 0,
  navConfig: {} as TopNavResponse,
  license: {} as GetGProductLicensesOverQuotaResponse,
  activeAppName: '',
});

type State = ReturnType<typeof globalStateFn>;

const globalStoreConfig = {
  id: 'global',
  state: globalStateFn,
  getters: {
    getProductInfoById(state: State) {
      return (productId: string) => state.productList.find((product) => product.id === productId);
    },
    hasProduct(state: State) {
      return (productId: string) => !!state.productList.find((product) => product.id === productId);
    },
    getProductLink(state: State) {
      return (productId: string, to: string) => {
        const productInfo = state.productList.find((product) => product.id === productId);
        const url = productInfo?.url;
        const baseUrl = url?.endsWith('/') ? url.slice(0, url.length - 1) : url;

        return `${baseUrl}${to.startsWith('/') ? to : `/${to}`}`;
      };
    },
  },
  actions: {
    setIdToken(val: string) {
      localStorage.setItem(TOKEN, val);
      setFn('idToken', val);
    },
    setUsername(val: string) {
      localStorage.setItem(USERNAME, val);
      setFn('username', val);
    },
    setEmail(val: string) {
      setFn('email', val);
    },
    async setLocale(val: string) {
      const languageHandlers: Array<ReturnType<LoadLanguageAsync>> = [];

      loadLanguageAsyncHandlers.forEach((item) => {
        item.forEach((handler) => {
          languageHandlers.push(handler(val));
        });
      });

      await Promise.all(languageHandlers);
      setFn('locale', val);
    },
    setProductList(val: GProduct[]) {
      const basePath = getUrlBase();
      const relVal = val.map((item) => (
        {
          ...item,
          uiAssetsUrl: pathJoin(basePath, item.uiAssetsUrl || ''),
          url: pathJoin(basePath, item.url || ''),
        }
      ));

      setFn('productList', relVal);
    },
    setNoticeUnread(val: number) {
      setFn('noticeUnread', val);
    },
    setNavConfig(val: TopNavResponse) {
      if (val.favicon) {
        localStorage.setItem(FAVICON, val.favicon);
      }
      setFn('navConfig', val);
    },
    setLicense(val: GetGProductLicensesOverQuotaResponse) {
      setFn('license', val);
    },
    setActiveAppName(val: string) {
      setFn('activeAppName', val);
    },
  },
};

type StateKey = keyof State;

type StateKeys = Array<StateKey>;

export const useGlobalStore = defineStore(globalStoreConfig);

// eslint-disable-next-line max-len
function setValue<S extends ReturnType<typeof useGlobalStore>, K extends StateKey, V extends State[K]>(
  store: S,
  key: K,
  value: V,
) {
  // eslint-disable-next-line no-param-reassign
  store.$state[key] = value;
}

export const initGlobalStore = () => {
  const globalState = globalStoreConfig.state();
  const store = useGlobalStore();

  (Object.keys(globalState) as StateKeys).forEach((key) => {
    handlers.set(key, new Set([(val) => {
      setValue(store, key, val);
    }]));
  });

  return store;
};

export const registerGlobalStoreHandler = (app: App, defineStoreFn: typeof defineStore) => {
  const globalStore = useGlobalStore();
  const useChildStore = defineStoreFn(globalStoreConfig);
  const childStore = useChildStore();

  const globalState = globalStore.$state;

  childStore.$state = {
    ...globalState,
  };
  const globalStateKeys = Object.keys(globalState) as StateKeys;

  globalStateKeys.forEach((key) => {
    handlers.get(key)
      ?.add((val) => {
        setValue(childStore, key, val);
      });
  });
  app.provide('globalStore', childStore);
  // eslint-disable-next-line no-param-reassign
  app.config.globalProperties.$globalStore = childStore;

  return childStore;
};

export const registerLoadLanguageAsyncHandler = (loadLanguageAsyncFn: LoadLanguageAsync) => {
  const globalStore = useGlobalStore();
  const { activeAppName } = globalStore;
  const activeAppHandlersSet = loadLanguageAsyncHandlers.get(activeAppName);

  if (activeAppHandlersSet) {
    activeAppHandlersSet.add(loadLanguageAsyncFn);
  } else {
    loadLanguageAsyncHandlers.set(activeAppName, new Set([loadLanguageAsyncFn]));
  }
};

export const clearLoadLanguageAsyncHandler = (appName: string) => {
  loadLanguageAsyncHandlers.get(appName)?.clear();
};

export const registerErrorHandlers = (errorHandler: ErrorHandler) => {
  const globalStore = useGlobalStore();
  const { activeAppName } = globalStore;
  const activeAppHandlersSet = errorHandlers.get(activeAppName);

  if (activeAppHandlersSet) {
    activeAppHandlersSet.add(errorHandler);
  } else {
    errorHandlers.set(activeAppName, new Set([errorHandler]));
  }
};

export const clearErrorHandlers = (appName: string) => {
  errorHandlers.get(appName)?.clear();
};

// this is for webpack 5.x
if (import.meta.webpackHot) {
  import.meta.webpackHot?.accept(acceptHMRUpdate(useGlobalStore, import.meta.webpackHot));
}

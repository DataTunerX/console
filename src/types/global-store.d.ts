import type { Store, defineStore } from 'pinia';

type GProduct = {
  id?: string | undefined;
  title?: string | undefined;
  url?: string | undefined;
  ui_assets_url?: string | undefined;
}

export type globalStore = Store<string,
  {
    id_token: string;
    username: string;
    email: string;
    locale: string;
    productList: GProduct[],
  },
  Record<string, never>,
  {
    setIdToken(val: string): void;
    setUsername(val: string): void;
    setEmail(val: string): void;
    setLocale(val: string): Promise<void>;
    setProductList(val: GProduct[]): void;
  }>

export type loadLanguageAsyncFn = (lang?: string) => Promise<string>;

export type registerGlobalStoreHandler =
  (app: App, defineStoreFn: typeof defineStore) => globalStore;

export type registerLoadLanguageAsyncHandler =
  (loadLanguageAsyncFn: loadLanguageAsyncFn) => Set<loadLanguageAsyncFn>;

import { defineStore, acceptHMRUpdate } from 'pinia';

export type GhippoAnakinConfig = {
  ghippo_anakin_doc_url: string
};

const useConfigStore = defineStore('config', {
  state: (): GhippoAnakinConfig => ({
    ghippo_anakin_doc_url: 'https://docs.daocloud.io/dce/what/',
  }),
});

// this is for webpack 5.x
if (import.meta.webpackHot) {
  import.meta.webpackHot?.accept(acceptHMRUpdate(useConfigStore, import.meta.webpackHot));
}

export default useConfigStore;

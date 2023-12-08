import { defineStore } from 'pinia';
import { TOKEN } from '@/utils/constant';
import { useNamespaceStore } from '@/stores/namespace';
import { i18n } from '@/plugins/vue-i18n';
import { nError } from '@/utils/useNoty';
import isEmpty from 'lodash/isEmpty';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem(TOKEN) as string,
  }),
  actions: {
    setToken(val: string) {
      localStorage.setItem(TOKEN, val);
      this.token = val;
    },

    isLoginSuccess() {
      return !isEmpty(this.token);
    },

    async initView() {
      const namespaceStore = useNamespaceStore();

      try {
        await namespaceStore.fetchNamespace();
      } catch (error) {
        nError(i18n.t('common.fetchFailed'), error);
      }
    },

    async login(val: string) {
      this.setToken(val);
    },

    async logout() {
      localStorage.removeItem(TOKEN);
    },

  },
});

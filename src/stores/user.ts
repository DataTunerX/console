import { defineStore } from 'pinia';
import { TOKEN } from '@/utils/constant';
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

    async login(val: string) {
      this.setToken(val);
    },

    async logout() {
      localStorage.removeItem(TOKEN);
    },

  },
});

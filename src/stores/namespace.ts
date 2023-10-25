import { NAMESPACE } from '@/utils/constant';
import { Namespace } from 'kubernetes-types/core/v1';
import { defineStore } from 'pinia';
import { listNamespaces } from '@/api/namespace';

export const useNamespaceStore = defineStore('namespace', {
  state: () => ({
    namespace: localStorage.getItem(NAMESPACE) as string,
    namespaces: [] as Namespace[],
  }),
  actions: {
    async fetchNamespace() {
      try {
        const response = await listNamespaces(); // 请求数据

        this.namespaces = response.data.items;

        const [firstNamespace] = response.data.items;
        const cachedNamespace = localStorage.getItem(NAMESPACE);

        if (!cachedNamespace && firstNamespace) {
          this.setNamespace(firstNamespace.metadata?.name || '');
        }
      } catch (error) {
        console.error('接口请求失败：', error);
      }
    },
    setNamespace(val: string) {
      localStorage.setItem(NAMESPACE, val);
      this.namespace = val;
    },
  },
});

import { nError } from '@/utils/useNoty';
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
      const { t } = useI18n();

      try {
        const { data } = await listNamespaces(); // 请求数据

        this.namespaces = data.items;

        const [firstNamespace] = data.items;
        const cachedNamespace = localStorage.getItem(NAMESPACE);

        if (!cachedNamespace && firstNamespace) {
          this.setNamespace(firstNamespace.metadata?.name || '');
        }
      } catch (error) {
        nError(t('common.fetchFailed'), error);
      }
    },
    setNamespace(val: string) {
      localStorage.setItem(NAMESPACE, val);
      this.namespace = val;
    },
  },
});

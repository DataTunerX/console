import { FinetuneExperiment, finetuneExperimentClient } from '@/api/finetune-experiment';
import { nError } from '@/utils/useNoty';
import { useNamespaceStore } from './namespace';

export const useExperimentStore = defineStore('experiment', {
  state: () => ({
    experiment: [] as FinetuneExperiment[],
    experimentMap: {} as { [key: string]: FinetuneExperiment },
  }),

  actions: {
    async fetchExperiment() {
      const { namespace } = storeToRefs(useNamespaceStore());
      const { t } = useI18n();

      try {
        const { data } = await finetuneExperimentClient.list(namespace.value);

        this.experiment = data.items;

        this.experimentMap = this.experiment.reduce((map, experiment) => {
          if (experiment.metadata?.name) {
            const newMap = { ...map };

            newMap[experiment.metadata.name] = experiment;

            return newMap;
          }

          return map;
        }, {} as { [key: string]: FinetuneExperiment });
      } catch (error) {
        nError(t('common.fetchFailed'), error);
      }
    },
  },
});

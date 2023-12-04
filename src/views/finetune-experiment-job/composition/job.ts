import { nError } from '@/utils/useNoty';

import { FinetuneJob, finetuneJobClient } from '@/api/finetune-job';

export const useFinetuneJob = () => {
  const { t } = useI18n();
  const state = reactive({
    jobs: [] as FinetuneJob[],
  });

  const fetchJobs = async (namespace: string) => {
    try {
      const { data } = await finetuneJobClient.list(namespace);

      state.jobs = data.items;
    } catch (error) {
      nError(t('common.fetchFailed'), error);
    }
  };

  return {
    ...toRefs(state),
    fetchJobs,
  };
};

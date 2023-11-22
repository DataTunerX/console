import { useI18n } from 'vue-i18n';
import { nError } from '@/utils/useNoty';
import { reactive, toRefs } from 'vue';
import { FinetuneJob, finetuneJobClient } from '@/api/finetune-job';

export const useFinetuneJob = () => {
  const { t } = useI18n();
  const state = reactive({
    jobs: [] as FinetuneJob[],
  });

  const fetchJobs = async (namespace: string) => {
    try {
      const res = await finetuneJobClient.list(namespace);

      state.jobs = res.data.items;
    } catch (error) {
      nError(t('common.fetchFailed'), error);
    }
  };

  return {
    ...toRefs(state),
    fetchJobs,
  };
};

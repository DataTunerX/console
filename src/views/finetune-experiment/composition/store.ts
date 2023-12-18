import { useNamespaceStore } from '@/stores/namespace';
import { FinetuneExperiment, finetuneExperimentClient } from '@/api/finetune-experiment';
import {
  ProcessedMetrics,
  getMetrics,
  processedData,
  FinetuneMetricsMap,
  TrainMetrics,
} from '@/api/finetune-metrics';
import { nError } from '@/utils/useNoty';

export const useFinetuneExperimentStore = defineStore('finetuneExperiment', () => {
  const { t } = useI18n();
  const { namespace } = storeToRefs(useNamespaceStore());

  const finetuneExperiment = ref<FinetuneExperiment>({});

  const finetuneMetrics = ref<ProcessedMetrics>({
    train_metrics: [],
    eval_metrics: [],
  });
  const originMetrics = ref<FinetuneMetricsMap>({});

  const loaded = ref(false);
  const fetchMetrics = async () => {
    loaded.value = false;
    try {
      const { data } = await getMetrics(
        namespace.value,
        finetuneExperiment.value.spec?.finetuneJobs.map((job) => job.name) ?? [],
      );

      originMetrics.value = data.reduce((acc: { [key: string]: TrainMetrics[] }, item) => {
        acc[item.finetune_name] = item.metrics.train_metrics.map((metric) => ({
          ...metric,
        }));

        return acc;
      }, {});

      finetuneMetrics.value = processedData(data);
      loaded.value = true;
    } catch (error) {
      nError(t('common.fetchFailed'), error);
    }
  };

  const fetchExperiment = async (name: string) => {
    try {
      const { data } = await finetuneExperimentClient.read(namespace.value, name);

      finetuneExperiment.value = data;
      fetchMetrics();
    } catch (error) {
      nError(t('common.fetchFailed'), error);
    }
  };

  const jobs = computed(() => finetuneExperiment.value.spec?.finetuneJobs.map((job) => {
    // TODO: 从微调任务中获取状态
    const status = finetuneExperiment.value?.status?.jobsStatus?.find(
      (item) => item.name === job.name,
    );

    return {
      ...job,
      status: status?.status,
      metrics: originMetrics.value[job.name],
    };
  }));

  return {
    fetchExperiment,
    loaded,
    finetuneExperiment,
    jobs,
    finetuneMetrics,
  };
});

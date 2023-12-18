// import { FinetuneJob, finetuneJobClient } from '@/api/finetune-job';
// import { ProcessedMetrics, getMetrics, processedData } from '@/api/finetune-metrics';
// import { useNamespaceStore } from '@/stores/namespace';
// import { nError } from '@/utils/useNoty';

// export const useCounterStore = defineStore('finetune-job', () => {
//   const { namespace } = toRefs(useNamespaceStore());
//   const { t } = useI18n();

//   const finetuneJob = ref<FinetuneJob>({});

//   const fetchFinetuneJob = async () => {
//     try {
//       const { data } = await finetuneJobClient.read(namespace.value, jobName);

//       finetuneJob.value = data;
//     } catch (error) {
//       nError(t('common.fetchFailed'), error);
//     }
//   };
//   const loaded = ref(false);
//   const finetuneMetrics = ref<ProcessedMetrics>({
//     train_metrics: [],
//     eval_metrics: [],
//   });

//   const fetchMetrics = async () => {
//     loaded.value = false;
//     const { data } = await getMetrics(namespace.value, ['finetune-sample']);

//     finetuneMetrics.value = processedData(data);
//     loaded.value = true;
//   };

//   return {
//     fetchFinetuneJob,
//     fetchMetrics,
//   };
// 1});

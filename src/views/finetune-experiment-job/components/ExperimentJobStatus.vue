<script lang="ts" setup>
import { FinetuneJob, State as FinetuneJobState } from '@/api/finetune-job';
import type { StateIconType } from '@dao-style/extend';

const props = defineProps({
  data: {
    type: Object as PropType<FinetuneJob>,
    default: () => ({}),
  },
});

const { t } = useI18n();

interface JobStatusMap {
  text: string;
  type: StateIconType;
}

const statusMap: Record<string, JobStatusMap> = {
  [FinetuneJobState.Buildimage]: {
    text: t('views.FinetuneExperiment.jobState.buildimage'),
    type: 'spin',
  },
  [FinetuneJobState.Failed]: {
    text: t('views.FinetuneExperiment.jobState.failed'),
    type: 'error',
  },
  [FinetuneJobState.Finetune]: {
    text: t('views.FinetuneExperiment.jobState.finetune'),
    type: 'spin',
  },
  [FinetuneJobState.Init]: {
    text: t('views.FinetuneExperiment.jobState.init'),
    type: 'default',
  },
  [FinetuneJobState.Serve]: {
    text: t('views.FinetuneExperiment.jobState.serve'),
    type: 'spin',
  },
  [FinetuneJobState.Successful]: {
    text: t('views.FinetuneExperiment.jobState.successful'),
    type: 'info',
  },
  unknown: {
    text: t('views.FinetuneExperiment.jobState.unknown'),
    type: 'warning',
  },
};

const curStatus = computed(() => {
  if (props.data.status?.state) {
    return statusMap[props.data.status?.state] ?? statusMap.unknown;
  }

  return statusMap.unknown;
});

</script>

<template>
  <dao-state-icon :type="curStatus.type">
    {{ curStatus.text }}
  </dao-state-icon>
</template>

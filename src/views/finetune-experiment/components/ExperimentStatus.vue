<script lang="ts" setup>
import { FinetuneExperiment, State as FinetuneExperimentState } from '@/api/finetune-experiment';

import type { StateIconType } from '@dao-style/extend';

const props = defineProps({
  data: {
    type: Object as PropType<FinetuneExperiment>,
    default: () => ({}),
  },
});

const { t } = useI18n();

interface ClusterStatusMap {
  text: string;
  type: StateIconType;
}

const statusMap: Record<string, ClusterStatusMap> = {
  [FinetuneExperimentState.Success]: {
    text: t('views.FinetuneExperiment.taskState.succeeded'),
    type: 'success',
  },
  [FinetuneExperimentState.Failed]: {
    text: t('views.FinetuneExperiment.taskState.failed'),
    type: 'error',
  },
  [FinetuneExperimentState.Processing]: {
    text: t('views.FinetuneExperiment.taskState.processing'),
    type: 'spin',
  },
  [FinetuneExperimentState.Pending]: {
    text: t('views.FinetuneExperiment.taskState.pending'),
    type: 'default',
  },
  unknown: {
    text: t('views.FinetuneExperiment.taskState.unknown'),
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

<script lang="ts" setup>
import { PropType, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { StateIconType } from '@dao-style/extend';
import { Dataset, State as DatasetState } from '@/api/dataset';

const props = defineProps({
  data: {
    type: Object as PropType<Dataset>,
    default: () => ({}),
  },
});

const { t } = useI18n();

interface DatasetStatusMap {
  text: string;
  type: StateIconType;
}

const statusMap: Record<string, DatasetStatusMap> = {
  [DatasetState.Ready]: {
    text: t('views.Dataset.status.ready'),
    type: 'success',
  },
  [DatasetState.Unready]: {
    text: t('views.Dataset.status.unready'),
    type: 'error',
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

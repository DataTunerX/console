<template>
  <dao-dialog
    size="md"
    :model-value="true"
    :header="$t('views.FinetuneExperiment.StopWorkloadDialog.header', {
      name: workload.metadata?.name,
    })"
    @cancel="$emit('reject')"
    @confirm="onConfirm"
  >
    {{ $t('views.FinetuneExperiment.StopWorkloadDialog.content', {
      name: workload.metadata?.name,
    }) }}
  </dao-dialog>
</template>

<script setup lang="ts">
import { FinetuneExperiment, finetuneExperimentClient } from '@/api/finetune-experiment';
import { nError, nSuccess } from '@/utils/useNoty';

const props = defineProps({
  workload: {
    type: Object as PropType<FinetuneExperiment>,
    default: () => ({}),
  },
});

const emits = defineEmits([
  'reject',
  'resolve',
]);

const { t } = useI18n();

const onConfirm = async () => {
  const params = {
    namespace: props.workload.metadata?.namespace,
    name: props.workload.metadata?.name,
  };

  if (!params.namespace || !params.name) {
    throw new Error('Namespace or name is undefined');
  }

  try {
    await finetuneExperimentClient.patch(params.namespace, params.name, [
      {
        op: 'replace',
        path: '/spec/pending',
        value: true,
      },
    ]);
    emits('resolve');

    nSuccess(t('views.FinetuneExperiment.StopWorkloadDialog.stopSuccess', {
      name: props.workload?.metadata?.name,
    }));
  } catch (error) {
    nError(t('views.FinetuneExperiment.StopWorkloadDialog.stopError', {
      name: props.workload?.metadata?.name,
    }), error);
  }
};
</script>

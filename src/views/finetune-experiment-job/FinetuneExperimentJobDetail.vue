<script lang="ts" setup>
import { Theme as datasetTheme } from '@/api/dataset';
import { Theme as llmTheme } from '@/api/large-language-model';
import { useNamespaceStore } from '@/stores/namespace';
import { FinetuneJob, finetuneJobClient, State } from '@/api/finetune-job';
import { useDateFormat, createDialog } from '@dao-style/extend';
import { useRelativeTime } from '@/utils/useRelativeTime';
import { nError } from '@/utils/useNoty';
import isEmpty from 'lodash/isEmpty';

import LearningRateChart from '@/components/charts/LearningRateChart.vue';
import PerformanceEvaluationChart from '@/components/charts/PerformanceEvaluationChart.vue';
import TrainLossChart from '@/components/charts/TrainingLossChart.vue';
import ValidationLossChart from '@/components/charts/ValidationLossChart.vue';

import { getMetrics, processedData, ProcessedMetrics } from '@/api/finetune-metrics';
import ExperimentJobStatus from './components/ExperimentJobStatus.vue';
import HyperparameterWithOverrides from './components/HyperparameterWithOverrides.vue';
import WorkloadLogsDialog from './components/WorkloadLogsDialog.vue';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const name = route.params.name as string;
const jobName = route.params.jobName as string;

const { namespace } = storeToRefs(useNamespaceStore());

const finetuneJob = ref<FinetuneJob>({});

const fetchFinetuneJob = async () => {
  try {
    const { data } = await finetuneJobClient.read(namespace.value, jobName);

    finetuneJob.value = data;
  } catch (error) {
    nError(t('common.fetchFailed'), error);
  }
};

fetchFinetuneJob();

const infos = computed(() => {
  const finetuneSpec = finetuneJob.value.spec?.finetune.finetuneSpec;
  const creationTimestamp = finetuneJob.value?.metadata?.creationTimestamp;

  let to: string | undefined;

  if (finetuneJob.value.status?.state !== State.Init) {
    to = finetuneJob.value.status?.stats;
  }

  const items = [
    {
      label: t('views.Hyperparameter.name'),
      value: jobName,
    },
    {
      label: t('views.FinetuneExperiment.status'),
      slotId: 'status',
    },
    {
      label: t('views.FinetuneExperiment.evaluationMethod'),
      value: finetuneJob.value.spec?.scoringPluginConfig?.name,
    },
    {
      label: t('views.FinetuneExperiment.duration'),
      value: useRelativeTime(creationTimestamp, to),
    },
    {
      label: t('views.FinetuneExperiment.basicLargeModel'),
      value: finetuneSpec?.llm,
      slotId: 'llm',
    },
    {
      label: t('views.FinetuneExperiment.dataSet'),
      value: finetuneSpec?.dataset,
      slotId: 'dataset',
    },
    {
      label: t('views.FinetuneExperiment.parameterGroup'),
      slotId: 'hyperparameter',
    },
    {
      label: t('views.FinetuneExperiment.finetuneStatus'),
      value: finetuneJob.value.status?.finetuneStatus?.state,
    },
    {
      label: t('common.createTime'),
      value: useDateFormat(creationTimestamp),
    },
  ];

  return items;
});

const toList = () => {
  router.push({
    name: 'FinetuneExperimentList',
    params: { ns: namespace.value },
  });
};

watch(namespace, toList);

const viewWorkloadLogs = () => {
  const dialog = createDialog(WorkloadLogsDialog);
  const { status } = finetuneJob.value;

  return dialog.show({
    podName: status?.finetuneStatus?.rayJobInfo?.rayJobPodName,
    container: status?.finetuneStatus?.rayJobInfo?.rayJobPodContainerName,
  });
};

const loaded = ref(false);
const finetuneMetrics = ref<ProcessedMetrics>({
  train_metrics: [],
  eval_metrics: [],
});

const fetchMetrics = async () => {
  loaded.value = false;
  const { data } = await getMetrics(namespace.value, [jobName]);

  finetuneMetrics.value = processedData(data);
  loaded.value = true;
};

try {
  fetchMetrics();
} catch (error) {
  console.log(error);
}
</script>

<template>
  <div class="finetune-experiment-detail console-main-container">
    <dao-header type="3rd">
      <template #breadcrumb>
        <dao-breadcrumb
          icon="icon-engine"
          :list="[
            {
              label: t('views.FinetuneExperiment.finetuneExperimentTitle'),
              value: name,
              to: { name: 'FinetuneExperimentDetail', params: { name } },
            },
            {
              label: t('views.FinetuneExperiment.finetuneJob'),
              value: jobName,
            },
          ]"
          @navigate="router.push"
        />
      </template>

      <template #action>
        <dao-button
          v-if="
            finetuneJob.status?.finetuneStatus?.rayJobInfo?.rayJobPodName &&
              finetuneJob.status?.finetuneStatus?.rayJobInfo?.rayJobPodContainerName
          "
          type="tertiary"
          @click="viewWorkloadLogs"
        >
          {{ t("views.FinetuneExperiment.viewWorkloadLogs") }}
        </dao-button>
      </template>
    </dao-header>

    <dao-empty v-if="isEmpty(finetuneJob)" />

    <dao-card
      v-else
      class="finetuneJob"
      type="simple"
      :title="t('views.Dataset.basicInformation')"
    >
      <dao-card-item>
        <dao-key-value-layout
          direction="vertical"
          :column="4"
          :data="infos"
        >
          <template #kv-status="{ row }">
            <dao-key-value-layout-item :label="row.label">
              <experiment-job-status :data="finetuneJob" />
            </dao-key-value-layout-item>
          </template>
          <template #kv-llm="{ row }">
            <dao-key-value-layout-item :label="row.label">
              <dao-label-extend :color="llmTheme">
                {{ row.value }}
              </dao-label-extend>
            </dao-key-value-layout-item>
          </template>
          <template #kv-dataset="{ row }">
            <dao-key-value-layout-item :label="row.label">
              <dao-label-extend :color="datasetTheme">
                {{ row.value }}
              </dao-label-extend>
            </dao-key-value-layout-item>
          </template>
          <template #kv-hyperparameter="{ row }">
            <dao-key-value-layout-item :label="row.label">
              <hyperparameter-with-overrides
                :data="finetuneJob.spec?.finetune.finetuneSpec.hyperparameter"
              />
            </dao-key-value-layout-item>
          </template>
        </dao-key-value-layout>
      </dao-card-item>
    </dao-card>

    <dao-card
      v-if="loaded"
      title="监控"
      type="simple"
      class="mt-[20px]"
    >
      <dao-card-item class="!basis-6/12 p-[20px]">
        <learning-rate-chart :data="finetuneMetrics.train_metrics" />
      </dao-card-item>

      <dao-card-item class="!basis-6/12 p-[20px]">
        <train-loss-chart :data="finetuneMetrics.train_metrics" />
      </dao-card-item>

      <dao-card-item class="!basis-6/12 p-[20px]">
        <validation-loss-chart :data="finetuneMetrics.eval_metrics" />
      </dao-card-item>

      <dao-card-item class="!basis-6/12 p-[20px]">
        <performance-evaluation-chart :data="finetuneMetrics.eval_metrics" />
      </dao-card-item>
    </dao-card>
  </div>
</template>

<style lang="scss" scoped>
:deep(.dao-card-item-container) {
  flex-wrap: wrap;
}
</style>

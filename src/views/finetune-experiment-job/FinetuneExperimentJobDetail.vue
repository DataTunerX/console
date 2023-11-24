<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, watch } from 'vue';
import { Theme as datasetTheme } from '@/api/dataset';
import { Theme as llmTheme } from '@/api/large-language-model';
import { useNamespaceStore } from '@/stores/namespace';
import { FinetuneJob, finetuneJobClient, State } from '@/api/finetune-job';
import { useDateFormat } from '@dao-style/extend';

import { storeToRefs } from 'pinia';
import { useRelativeTime } from '@/utils/useRelativeTime';
import ExperimentJobStatus from './components/ExperimentJobStatus.vue';
import HyperparameterWithOverrides from './components/HyperparameterWithOverrides.vue';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const name = route.params.name as string;
const jobName = route.params.jobName as string;

const { namespace } = storeToRefs(useNamespaceStore());

const finetuneJob = ref<FinetuneJob>({});

const fetchDataset = () => {
  finetuneJobClient
    .read(namespace.value, jobName)
    .then(({ data }) => {
      finetuneJob.value = data;
    });
};

// 调用接口
fetchDataset();

// 显示基本信息
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
      value: finetuneJob.value.spec?.scoringConfig?.name,
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
      value: finetuneJob.value.status?.finetuneState,
    },
    {
      label: t('common.createTime'),
      value: useDateFormat(creationTimestamp),
    },
  ];

  return items;
});

const toList = () => {
  router.push({ name: 'FinetuneExperimentList' });
};

watch(namespace, toList);

</script>

<template>
  <div class="finetune-experiment-detail console-main-container">
    <dao-header type="3rd">
      <template #breadcrumb>
        <dao-breadcrumb
          icon="icon-engine"
          @navigate="router.push"
        >
          <dao-breadcrumb-item
            :label="t('views.FinetuneExperiment.finetuneExperimentTitle')"
            :value="name"
            :to="{ name: 'FinetuneExperimentDetail', }"
          />
          <dao-breadcrumb-item
            :label="t('views.FinetuneExperiment.finetuneJob')"
          />
          <dao-breadcrumb-item
            :label="jobName"
          />
        </dao-breadcrumb>
      </template>
    </dao-header>
    <dao-card
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
              <hyperparameter-with-overrides :data="finetuneJob.spec?.finetune.finetuneSpec.hyperparameter" />
            </dao-key-value-layout-item>
          </template>
        </dao-key-value-layout>
      </dao-card-item>
    </dao-card>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useNamespaceStore } from '@/stores/namespace';
import { FinetuneExperiment, finetuneExperimentClient } from '@/api/finetune-experiment';
import { useDateFormat } from '@dao-style/extend';
import FinetuneExperimentDetailItem from './components/FinetuneExperimentDetailItem.vue';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const namespaceStore = useNamespaceStore();

const finetuneExperiment = ref<FinetuneExperiment>();

const fetchDataset = () => {
  finetuneExperimentClient.read(namespaceStore.namespace, route.params.name as string).then((res) => {
    finetuneExperiment.value = res.data;
  });
};

fetchDataset();

const name = computed(() => finetuneExperiment.value?.metadata?.name);

const infos = computed(() => {
  const finetuneExperimentData = finetuneExperiment.value?.spec;
  const creationTimestamp = finetuneExperiment.value?.metadata?.creationTimestamp;
  const llms = finetuneExperimentData?.finetuneJobs.map((job) => job.spec?.finetune.finetuneSpec.llm).filter((i) => i);
  const datasets = finetuneExperimentData?.finetuneJobs.map((job) => job.spec?.finetune.finetuneSpec.dataset);
  const hyperparameters = finetuneExperimentData?.finetuneJobs.map((job) => job.spec?.finetune.finetuneSpec.hyperparameter?.hyperparameterRef);

  const items = [
    {
      label: t('views.Hyperparameter.name'),
      value: finetuneExperiment.value?.metadata?.name,
    },
    {
      label: t('views.FinetuneExperiment.status'),
      value: '正常',
    },
    {
      label: t('views.FinetuneExperiment.evaluationMethod'),
      value: finetuneExperiment.value?.spec?.scoringConfig.name,
    },
    {
      label: t('views.FinetuneExperiment.optimalresult'),
      value: '-',
    },
    {
      label: t('common.createTime'),
      value: useDateFormat(creationTimestamp),
    },
    {
      label: t('views.FinetuneExperiment.time'),
      value: '1小时32分',
    },
    {
      label: t('views.FinetuneExperiment.BasicLargeModel'),
      value: llms?.join(','),
      slotId: 'llm',
    },
    {
      label: t('views.Dataset.header'),
      value: datasets?.join(','),
      slotId: 'dataset',

    },
    {
      label: t('views.FinetuneExperiment.parameterGroup'),
      value: hyperparameters?.join(','),
      slotId: 'hyperparameter',
    },
  ];

  return items;
});

const finetuneExperimentsData = computed(() => finetuneExperiment.value?.spec?.finetuneJobs);

</script>
<template>
  <div class="finetune-experiment-detail console-main-container">
    <dao-header type="3rd">
      <template #breadcrumb>
        <dao-breadcrumb
          icon="icon-cluster"
          @navigate="router.push"
        >
          <dao-breadcrumb-item
            :label="t('views.FinetuneExperiment.finetuneExperiment')"
            :to="{ name: 'FinetuneExperimentList' }"
          />
          <dao-breadcrumb-item :label="name" />
        </dao-breadcrumb>
      </template>

      <template #action>
        <!-- <dao-button
          type="tertiary"
          @click="onEdit"
        >
          {{ t('common.edit') }}
        </dao-button> -->
      </template>
    </dao-header>

    <dao-card
      type="simple"
      :title="t('views.Dataset.basicInformation')"
    >
      <dao-card-item>
        <dao-key-value-layout
          direction="vertical"
          :column="4"
          :data="infos"
        >
          <template #kv-llm="{ row }">
            <dao-key-value-layout-item :label="row.label">
              <dao-hover-card :data="row.value?.split(',')" />
            </dao-key-value-layout-item>
          </template>
          <template #kv-dataset="{ row }">
            <dao-key-value-layout-item :label="row.label">
              <dao-hover-card :data="row.value?.split(',')" />
            </dao-key-value-layout-item>
          </template>
          <template #kv-hyperparameter="{ row }">
            <dao-key-value-layout-item :label="row.label">
              <dao-hover-card :data="row.value?.split(',')" />
            </dao-key-value-layout-item>
          </template>
        </dao-key-value-layout>
      </dao-card-item>
    </dao-card>
    <FinetuneExperimentDetailItem
      v-for="experiment in finetuneExperimentsData"
      :key="experiment.spec?.finetune?.finetuneSpec?.hyperparameter?.hyperparameterRef"
      :data="experiment"
    />
    <!-- <dao-card
      type="simple"
      :title="t('views.Dataset.datasetInfoConfig')"
      class="dataset-detail__subset-info"
    >
      <dao-card-item>
        <dao-table
          hide-toolbar
          no-shadow
          :columns="columns"
          :data="subsets"
          :page-layout="[]"
        />
      </dao-card-item>
    </dao-card> -->
  </div>
</template>

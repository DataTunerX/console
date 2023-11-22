<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useNamespaceStore } from '@/stores/namespace';
import {
  FinetuneJobWithName, FinetuneExperiment, finetuneExperimentClient, State as FinetuneExperimentState,
} from '@/api/finetune-experiment';
import { useDateFormat } from '@dao-style/extend';
import { storeToRefs } from 'pinia';
import { useQueryTable } from '@/hooks/useQueryTable';
import { useFinetuneExperiment } from './composition/finetune';
import FinetuneJobItem from './components/FinetuneJobItem.vue';
import ExperimentStatus from './components/ExperimentStatus.vue';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const { namespace } = storeToRefs(useNamespaceStore());
const name = route.params.name as string;

const finetuneExperiment = ref<FinetuneExperiment>({});

const canStop = computed(() => finetuneExperiment.value.status?.state === FinetuneExperimentState.Pending);

// 加载微调实验详情
const fetchDataset = async () => finetuneExperimentClient.read(namespace.value, name).then((res) => {
  finetuneExperiment.value = res.data;

  return {
    data: {
      items: res.data.spec?.finetuneJobs,
    },
  };
});

const infos = computed(() => {
  // const finetuneExperimentData = finetuneExperiment.value?.spec;
  const creationTimestamp = finetuneExperiment.value?.metadata?.creationTimestamp;
  // const llms = finetuneExperimentData?.finetuneJobs
  //   .map((job) => job.spec?.finetune.finetuneSpec.llm)
  //   .filter((i) => i);
  // const datasets = finetuneExperimentData?.finetuneJobs.map(
  //   (job) => job.spec?.finetune.finetuneSpec.dataset,
  // );
  // const hyperparameters = finetuneExperimentData?.finetuneJobs.map(
  //   (job) => job.spec?.finetune.finetuneSpec.hyperparameter?.hyperparameterRef,
  // );

  const items = [
    {
      label: t('views.Hyperparameter.name'),
      value: finetuneExperiment.value?.metadata?.name,
    },
    {
      label: t('views.FinetuneExperiment.status'),
      slotId: 'status',
    },
    {
      label: t('views.FinetuneExperiment.evaluationMethod'),
      value: finetuneExperiment.value?.spec?.scoringConfig.name,
    },
    {
      label: t('views.FinetuneExperiment.highestScore'),
      value: '-',
    },
    {
      label: t('views.FinetuneExperiment.time'),
      value: '1小时32分',
    },
    // {
    //   label: t('views.FinetuneExperiment.basicLargeModel'),
    //   value: llms?.join(','),
    //   slotId: 'llm',
    // },
    // {
    //   label: t('views.Dataset.header'),
    //   value: datasets?.join(','),
    //   slotId: 'dataset',
    // },
    // {
    //   label: t('views.FinetuneExperiment.hyperparameter'),
    //   value: hyperparameters?.join(','),
    //   slotId: 'hyperparameter',
    // },
    {
      label: t('common.createTime'),
      value: useDateFormat(creationTimestamp),
    },
  ];

  return items;
});

const {
  items, page, pageSize, total, search,
} = useQueryTable<FinetuneJobWithName>(fetchDataset);

const { stop } = useFinetuneExperiment();

const onConfirmStop = async () => {
  await stop(finetuneExperiment.value);
  fetchDataset();
};

const curTab = ref('profile');

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
            :label="t('views.FinetuneExperiment.finetuneExperiment')"
            :to="{ name: 'FinetuneExperimentList' }"
          />
          <dao-breadcrumb-item :label="name" />
        </dao-breadcrumb>
      </template>

      <template #action>
        <dao-button
          :disabled="canStop"
          type="tertiary"
          @click="onConfirmStop"
        >
          {{ t("common.stop") }}
        </dao-button>
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
              <experiment-status :data="finetuneExperiment" />
            </dao-key-value-layout-item>
          </template>
          <!-- <template #kv-llm="{ row }">
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
          </template> -->
        </dao-key-value-layout>
      </dao-card-item>
    </dao-card>

    <dao-tabs
      v-model="curTab"
      class="mt-[20px]"
    >
      <dao-tab-item
        value="profile"
        :label="t('views.FinetuneExperiment.taskList')"
      >
        <dao-toolbar
          v-model:search="search.keywords"
          no-rounded
          compact
          :hide-refresh="true"
          :fuzzy="{ key: 'fuzzy', single: true }"
          @refresh="fetchDataset"
        />

        <FinetuneJobItem
          v-for="(experiment, index) in items"
          :key="index"
          :data="experiment"
          :name="name"
        />

        <dao-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          class="mt-[20px]"
          :total="total"
          :no-shadow="true"
        />
      </dao-tab-item>
      <dao-tab-item
        value="detail"
        label="任务对比"
      >
        <p>detail 的内容</p>
      </dao-tab-item>
    </dao-tabs>
  </div>
</template>

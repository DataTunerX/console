<script lang="ts" setup>
import { useNamespaceStore } from '@/stores/namespace';
import {
  FinetuneJobWithName,
  FinetuneExperiment,
  finetuneExperimentClient,
  State as FinetuneExperimentState,
} from '@/api/finetune-experiment';
import { useDateFormat } from '@dao-style/extend';

import { useQueryTable } from '@/hooks/useQueryTable';
import { useRelativeTime } from '@/utils/useRelativeTime';
import { AxiosResponse } from 'axios';
import { List } from '@/plugins/axios/client';
import { useFinetuneExperiment } from './composition/finetune';
import FinetuneJobItem from './components/FinetuneJobItem.vue';
import ExperimentStatus from './components/ExperimentStatus.vue';
import JobComparison from './components/JobComparison.vue';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const { namespace } = storeToRefs(useNamespaceStore());
const name = route.params.name as string;

const finetuneExperiment = ref<FinetuneExperiment>({});

const canStop = computed(
  () => finetuneExperiment.value.status?.state === FinetuneExperimentState.Pending,
);

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

  let to: string | undefined;

  if (finetuneExperiment.value.status?.state !== FinetuneExperimentState.Processing) {
    to = finetuneExperiment.value.status?.stats;
  }

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
      value: finetuneExperiment.value.status?.bestVersion?.score,
    },
    {
      label: t('views.FinetuneExperiment.duration'),
      value: useRelativeTime(creationTimestamp, to),
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
    // }
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

// 加载微调实验详情
const fetchExperiment = async () => finetuneExperimentClient.read(namespace.value, name).then(({ data }) => {
  finetuneExperiment.value = data;

  return {
    data: {
      items: data.spec?.finetuneJobs,
    },
  } as AxiosResponse<List<FinetuneJobWithName>>;
});

const {
  items, page, pageSize, total, search,
} = useQueryTable<FinetuneJobWithName>(fetchExperiment);

const jobsWithStatus = computed(() => items.value?.map((job) => {
  // TODO: 从微调任务中获取状态
  const status = finetuneExperiment.value?.status?.jobsStatus?.find(
    (item) => item.name === job.name,
  );

  return {
    ...job,
    status: status?.status,
  };
}));

const { stop } = useFinetuneExperiment();

const onConfirmStop = async () => {
  await stop(finetuneExperiment.value);
  fetchExperiment();
};

const curTab = ref('profile');
</script>

<template>
  <div class="finetune-experiment-detail console-main-container">
    <dao-header type="3rd">
      <template #breadcrumb>
        <dao-breadcrumb
          icon="icon-engine"
          :list="[
            {
              label: t('views.FinetuneExperiment.finetuneExperiment'),
              to: { name: 'FinetuneExperimentList' },
            },
            {
              value: name,
            },
          ]"
          @navigate="router.push"
        />
      </template>

      <template #action>
        <dao-button
          :disabled="canStop"
          use-font
          type="tertiary"
          icon-left="icon-stopped"
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
      class="mt-[20px] finetune-experiment-detail__tabs"
    >
      <dao-tab-item
        value="profile"
        :label="t('views.FinetuneExperiment.taskList')"
      >
        <dao-toolbar
          v-model:search="search"
          no-rounded
          hide-refresh
          :fuzzy="{ key: 'fuzzy', single: true }"
          @refresh="fetchExperiment"
        />

        <finetune-job-item
          v-for="(experiment, index) in jobsWithStatus"
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
        :label="$t('views.FinetuneExperiment.jobComparison')"
        class="bg-white"
      >
        <job-comparison
          v-if="curTab === 'detail'"
          :jobs="jobsWithStatus"
        />
      </dao-tab-item>
    </dao-tabs>
  </div>
</template>

<style lang="scss" scoped>
.finetune-experiment-detail {
  &__tabs {
    margin-top: 20px;

    :deep(.dao-tabs__body) {
      background: transparent;
    }
  }
}
</style>

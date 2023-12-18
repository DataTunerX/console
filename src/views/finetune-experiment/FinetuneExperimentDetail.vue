<script lang="ts" setup>
import { useNamespaceStore } from '@/stores/namespace';
import {
  State as FinetuneExperimentState,
} from '@/api/finetune-experiment';
import { useDateFormat } from '@dao-style/extend';

import { useRelativeTime } from '@/utils/useRelativeTime';
import DetailTabs from '@/components/DetailTabs.vue';
import { useFinetuneExperiment } from './composition/finetune';
import ExperimentStatus from './components/ExperimentStatus.vue';
import { useFinetuneExperimentStore } from './composition/store';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const { namespace } = storeToRefs(useNamespaceStore());
const name = route.params.name as string;

const tabs = [{
  key: 'job-list',
  routeName: 'JobList',
  display: t('views.FinetuneExperiment.taskList'),
}, {
  key: 'job-comparison',
  routeName: 'JobComparison',
  display: t('views.FinetuneExperiment.jobComparison'),
}];

const { finetuneExperiment } = storeToRefs(useFinetuneExperimentStore());
const finetuneExperimentStore = useFinetuneExperimentStore();

finetuneExperimentStore.fetchExperiment(name);

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

const canStop = computed(
  () => finetuneExperiment.value.status?.state === FinetuneExperimentState.Pending,
);

const { stop } = useFinetuneExperiment();

const onConfirmStop = async () => {
  await stop(finetuneExperiment.value);
  finetuneExperimentStore.fetchExperiment(name);
};

const toList = () => {
  router.push({
    name: 'FinetuneExperimentList',
    params: { ns: namespace.value },
  });
};

watch(namespace, toList);
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

    <detail-tabs
      class="mt-[20px] finetune-experiment-detail__tabs"
      :tabs="tabs"
    />

    <!-- <dao-tabs
      v-model="curTab"
    >
      <dao-tab-item
        value="profile"
        label="1"
      >
        <job-list :jobs="jobsWithStatus" />
      </dao-tab-item>
      <dao-tab-item
        value="detail"
        label="2"
        class="bg-white"
      >
        <job-comparison
          v-if="curTab === 'detail'"
          :jobs="jobsWithStatus"
        />
      </dao-tab-item>
    </dao-tabs> -->
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

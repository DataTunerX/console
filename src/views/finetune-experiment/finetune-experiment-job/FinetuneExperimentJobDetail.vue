<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { computed, ref } from 'vue';

import { useNamespaceStore } from '@/stores/namespace';
import { FinetuneJob, finetuneJobClient } from '@/api/finetune-job';
import { useDateFormat } from '@dao-style/extend';

import ExperimentJobStatus from '../components/ExperimentJobStatus.vue';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const name = route.params.name as string;
const jobname = route.params.jobname as string;

const isShow = ref(false);

const namespaceStore = useNamespaceStore();
const finetuneToShop = ref<string>();

const finetuneJob = ref<FinetuneJob>({});

const fetchDataset = () => {
  finetuneJobClient
    .read(namespaceStore.namespace, jobname)
    .then((res) => {
      finetuneJob.value = res.data;
    });
};

// 调用接口
fetchDataset();

// 显示基本信息
const infos = computed(() => {
  const creationTimestamp = finetuneJob.value?.metadata?.creationTimestamp;
  const items = [
    {
      label: t('views.Hyperparameter.name'),
      value: jobname,
    },
    {
      label: t('views.FinetuneExperiment.status'),
      slotId: 'status',
    },
    {
      label: t('views.FinetuneExperiment.evaluationMethod'),
      value: finetuneJob?.value?.spec?.scoringConfig?.name,
    },
    {
      label: t('components.AnakinHeader.namespace'),
      value: finetuneJob?.value.metadata?.namespace,
    },
    {
      label: t('common.createTime'),
      value: useDateFormat(creationTimestamp),
    },
    {
      label: t('views.FinetuneExperiment.time'),
      value: '-',
    },
    {
      label: t('views.FinetuneExperiment.basicLargeModel'),
      value: '-',
    },
    {
      label: t('views.FinetuneExperiment.dataSet'),
      value: '-',
    },
    {
      label: t('views.FinetuneExperiment.parameterGroup'),
      value: '-',
    },
    {
      label: t('views.FinetuneExperiment.finetuneStatus'),
      value: '-',
    },
    {
      label: t('views.FinetuneExperiment.spreadPolicies'),
      value: '-',
    },
  ];

  return items;
});

// 显示停止对话框
const showDialog = () => {
  isShow.value = true;
  // finetuneToShop.value = finetuneExperiment.value?.metadata?.name;
};
// 隐藏停止对话框
const hideDialog = () => {
  isShow.value = false;
};
// 确认停止微调实验
const confirmShop = () => {
  isShow.value = false;
};

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
          <dao-breadcrumb-item
            :label="name"
            :to="{ name: 'FinetuneExperimentDetail' }"
          />
          <dao-breadcrumb-item
            :label="t('views.FinetuneExperiment.finetuneJob')"
          />
          <dao-breadcrumb-item
            :label="jobname"
          />
        </dao-breadcrumb>
      </template>

      <template #action>
        <dao-button
          type="tertiary"
        >
          {{ t("common.log") }}
        </dao-button>
        <dao-button
          type="tertiary"
          @click="showDialog()"
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
              <experiment-job-status :data="finetuneJob" />
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
  </div>

  <dao-dialog
    :model-value="isShow"
    @cancel="hideDialog"
    @confirm="confirmShop"
  >
    <template #header>
      {{ t("common.prompt") }}
    </template>
    <div class="body">
      <div class="content">
        {{ $t("views.FinetuneExperiment.stopConfirm", { finetuneToShop }) }}
      </div>
    </div>
  </dao-dialog>
</template>

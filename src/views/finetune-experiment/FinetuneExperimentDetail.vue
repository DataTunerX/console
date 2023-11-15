<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { first } from 'lodash';

import { useNamespaceStore } from '@/stores/namespace';
import { FinetuneExperiment, finetuneExperimentClient } from '@/api/finetune-experiment';
import { FinetuneJob } from '@/api/finetune-job';
import { useDateFormat } from '@dao-style/extend';

import { nError } from '@/utils/useNoty';

import FinetuneExperimentDetailItem from './components/FinetuneExperimentDetailItem.vue';

const search = ref<{ fuzzy: string[] }>();
const loading = ref(true);
// 常量定义
const pageSize = ref(10);
const currentPage = ref(1);
const isShow = ref(false);

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const namespaceStore = useNamespaceStore();
const finetuneExperiment = ref<FinetuneExperiment>();
const showData = ref<FinetuneJob[]>();
const finetuneToShop = ref<string>();

const fetchDataset = () => {
  finetuneExperimentClient
    .read(namespaceStore.namespace, route.params.name as string)
    .then((res) => {
      finetuneExperiment.value = res.data;
    });
};
// 初始化查询
const onSearch = () => {
  currentPage.value = 1;
};
// 调用接口

fetchDataset();
// title
const name = computed(() => finetuneExperiment.value?.metadata?.name);
// 显示基本信息
const infos = computed(() => {
  const finetuneExperimentData = finetuneExperiment.value?.spec;
  const creationTimestamp = finetuneExperiment.value?.metadata?.creationTimestamp;
  const llms = finetuneExperimentData?.finetuneJobs
    .map((job) => job.spec?.finetune.finetuneSpec.llm)
    .filter((i) => i);
  const datasets = finetuneExperimentData?.finetuneJobs.map(
    (job) => job.spec?.finetune.finetuneSpec.dataset,
  );
  const hyperparameters = finetuneExperimentData?.finetuneJobs.map(
    (job) => job.spec?.finetune.finetuneSpec.hyperparameter?.hyperparameterRef,
  );

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
// 显示任务列表
const finetuneExperimentDetailData = computed(() => finetuneExperiment.value?.spec?.finetuneJobs.filter((item) => item.spec?.finetune?.finetuneSpec?.dataset.includes(first(search.value?.fuzzy) ?? '')));
// watch

watchEffect(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = currentPage.value * pageSize.value;

  showData.value = finetuneExperimentDetailData.value?.slice(startIndex, endIndex);
});
// 加载微调实验详情
const fetchDatasets = async () => {
  loading.value = true;
  try {
    const res = await finetuneExperimentClient.read(
      namespaceStore.namespace,
      route.params.name as string,
    );

    finetuneExperiment.value = res.data;
    if (finetuneExperimentDetailData.value?.length) {
      currentPage.value = 1;
    }
  } catch (error) {
    nError(t('common.error'), error);
  } finally {
    loading.value = false;
  }
};

// 显示停止对话框
const showDialog = () => {
  isShow.value = true;
  finetuneToShop.value = finetuneExperiment.value?.metadata?.name;
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
    <div class="task-title">
      {{ t("views.FinetuneExperiment.taskList") }}
    </div>
    <dao-toolbar
      v-model:search="search"
      :search-placeholder="t('views.FinetuneExperiment.pleaseEnter')"
      :hide-refresh="true"
      :fuzzy="{ key: 'fuzzy', single: true }"
      class="search-style"
      @refresh="fetchDatasets"
      @search="onSearch"
    />

    <FinetuneExperimentDetailItem
      v-for="experiment in showData"
      :key="experiment.spec?.finetune?.finetuneSpec?.hyperparameter?.hyperparameterRef"
      :data="experiment"
    />
    <dao-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      class="mt-[20px]"
      :total="showData?.length"
    />
  </div>
  <dao-dialog
    :model-value="isShow"
    header="Basic Dialog"
    @cancel="hideDialog"
    @confirm="confirmShop"
  >
    <div class="body">
      <div class="content">
        {{ $t("views.FinetuneExperiment.stopConfirm", { finetuneToShop }) }}
      </div>
    </div>
  </dao-dialog>
</template>
<style lang="scss">
.task-title {
  padding: 25px 0;
  font-weight: bold;
  color: #33363b;
}

.search-style {
  border-radius: 10px;
}
</style>

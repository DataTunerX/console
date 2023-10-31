<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useNamespaceStore } from '@/stores/namespace';
import { Dataset, getDataset } from '@/api/dataset';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const namespaceStore = useNamespaceStore();

const dataset = ref<Dataset>();

const fetchDataset = () => {
  getDataset(namespaceStore.namespace, route.params.name as string).then((res) => {
    dataset.value = res.data;
  });
};

fetchDataset();

const name = computed(() => dataset.value?.metadata.name);

const infos = computed(() => {
  const languages = dataset.value?.spec.datasetMetadata.languages?.map((lang) => t(`views.dataset.${lang}`)).join(', ') ?? '-';

  const items = [
    {
      label: '语言',
      value: languages,
    },
    {
      label: '许可证',
      value: dataset.value?.spec.datasetMetadata.license,
    },
    {
      label: '词条数目',
      value: dataset.value?.spec.datasetMetadata.size,
    },
    {
      label: '任务类型',
      value: dataset.value?.spec.datasetMetadata.task.name,
    },
    {
      label: '标签',
      value: dataset.value?.spec.datasetMetadata.tags?.join(','),
      slotId: 'tag',
    },
    {
      label: '子任务类型',
      value: dataset.value?.spec.datasetMetadata.task.subTasks.map((sub) => sub.name).join(', '),
    },
    {
      label: '数据集文件源',
      value: dataset.value?.spec.datasetFiles?.source,
    },
  ];

  return items;
});

const columns = computed(() => [
  {
    id: 'name',
    header: '子数据集名称',
  },
  {
    id: 'train',
    header: '训练数据集地址',
  },
  {
    id: 'test',
    header: '测试数据集地址',
  },
  {
    id: 'validate',
    header: '验证数据集地址',
  },
]);

const subsets = computed(() => dataset.value?.spec.datasetMetadata.datasetInfo.subsets?.map((subset) => ({
  name: subset.name,
  train: subset.splits?.train.file,
  test: subset.splits?.test.file,
  validate: subset.splits?.validate.file,
})));

</script>

<template>
  <div class="dataset-detail console-main-container">
    <dao-header
      type="3rd"
    >
      <template #breadcrumb>
        <dao-breadcrumb
          icon="icon-cluster"
          @navigate="router.push"
        >
          <dao-breadcrumb-item
            label="数据集"
            :to="{ name: 'DatasetList' }"
          />
          <dao-breadcrumb-item
            :label="name"
          />
        </dao-breadcrumb>
      </template>
    </dao-header>

    <dao-card
      type="simple"
      title="基本信息"
    >
      <dao-card-item>
        <dao-key-value-layout
          direction="vertical"
          :column="4"
          :data="infos"
        >
          <template #kv-tag="{ row }">
            <dao-key-value-layout-item :label="row.label">
              <dao-hover-card :data="row.value?.split(',')" />
            </dao-key-value-layout-item>
          </template>
        </dao-key-value-layout>
      </dao-card-item>
    </dao-card>

    <dao-card
      type="simple"
      title="数据集信息配置"
      class="mt-[16px]"
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
    </dao-card>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useNamespaceStore } from '@/stores/namespace';
import { Dataset, datasetClient } from '@/api/dataset';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const namespaceStore = useNamespaceStore();

const dataset = ref<Dataset>();

const fetchDataset = () => {
  datasetClient.read(namespaceStore.namespace, route.params.name as string).then((res) => {
    dataset.value = res.data;
  });
};

fetchDataset();

const name = computed(() => dataset.value?.metadata?.name);

const infos = computed(() => {
  const languages = dataset.value?.spec?.datasetMetadata.languages?.map((lang) => t(`views.Dataset.${lang}`)).join(', ') ?? '-';

  const items = [
    {
      label: t('views.Dataset.language'),
      value: languages,
    },
    {
      label: t('views.Dataset.license'),
      value: dataset.value?.spec?.datasetMetadata.license,
    },
    {
      label: t('views.Dataset.size'),
      value: dataset.value?.spec?.datasetMetadata.size,
    },
    {
      label: t('views.Dataset.taskType'),
      value: dataset.value?.spec?.datasetMetadata.task?.name,
    },
    {
      label: t('views.Dataset.tag'),
      value: dataset.value?.spec?.datasetMetadata.tags?.join(','),
      slotId: 'tag',
    },
    {
      label: t('views.Dataset.subtaskType'),
      value: dataset.value?.spec?.datasetMetadata.task?.subTasks?.map((sub) => sub.name).join(', '),
    },
    {
      label: t('views.Dataset.datasetFileSource'),
      value: dataset.value?.spec?.datasetFiles?.source,
    },
  ];

  return items;
});

const columns = computed(() => [
  {
    id: 'name',
    header: t('views.Dataset.subsetName'),
  },
  {
    id: 'train',
    header: t('views.Dataset.trainingDataFile'),
  },
  {
    id: 'test',
    header: t('views.Dataset.testingDataFile'),
  },
  {
    id: 'validate',
    header: t('views.Dataset.validationDataFile'),
  },
]);

const subsets = computed(() => dataset.value?.spec?.datasetMetadata.datasetInfo?.subsets?.map((subset) => ({
  name: subset.name,
  train: subset.splits?.train?.file,
  test: subset.splits?.test?.file,
  validate: subset.splits?.validate?.file,
})));

const onEdit = () => {
  router.push({
    name: 'DatasetCreate',
    query: {
      name: name.value,
    },
  });
};
</script>

<template>
  <div class="dataset-detail console-main-container">
    <dao-header type="3rd">
      <template #breadcrumb>
        <dao-breadcrumb
          icon="icon-cluster"
          @navigate="router.push"
        >
          <dao-breadcrumb-item
            :label="t('views.Dataset.header')"
            :to="{ name: 'DatasetList' }"
          />
          <dao-breadcrumb-item :label="name" />
        </dao-breadcrumb>
      </template>

      <template #action>
        <dao-button
          type="tertiary"
          @click="onEdit"
        >
          {{ t('common.edit') }}
        </dao-button>
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
    </dao-card>
  </div>
</template>

<style lang="scss" scoped>
.dataset-detail {
  &__subset-info {
    margin-top: 16px;

    :deep(.dao-card-container) {
      padding: 0;
    }
  }
}
</style>

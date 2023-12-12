<script lang="ts" setup>
import { useNamespaceStore } from '@/stores/namespace';

import { useExperimentStore } from '@/stores/experiment';
import { useDataset, useDeleteDataset } from './composition/dataset';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const { namespace } = storeToRefs(useNamespaceStore());

const name = route.params.name as string;

const { dataset, fetchDataset } = useDataset();

fetchDataset(namespace.value, name);

const { fetchExperiment } = useExperimentStore();
const { datasetWithExperiment } = storeToRefs(useExperimentStore());

const referencedByExperiments = computed(() => datasetWithExperiment.value[name]);
const canDelete = computed(() => {
  if (!referencedByExperiments.value) {
    return true;
  }

  return referencedByExperiments.value?.length === 0;
});

fetchExperiment(namespace.value);

const infos = computed(() => {
  const languages = dataset.value?.spec?.datasetMetadata.languages
    ?.map((lang) => t(`views.Dataset.${lang}`))
    .join(', ') ?? '-';

  const items = [
    {
      label: t('views.Dataset.language'),
      value: languages,
    },
    {
      label: t('views.Dataset.licenseInformation'),
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
    query: { name },
  });
};

const toList = () => {
  router.push({ name: 'DatasetList' });
};

watch(namespace, toList);

const { onConfirmDelete } = useDeleteDataset(namespace.value, toList);
</script>

<template>
  <div class="dataset-detail console-main-container">
    <dao-header type="3rd">
      <template #breadcrumb>
        <dao-breadcrumb
          icon="icon-cluster"
          :list="[
            {
              label: t('views.Dataset.header'),
              to: { name: 'DatasetList' },
            },
            {
              value: name,
            },
          ]"
          @navigate="router.push"
        />
      </template>

      <template #action>
        <dao-dropdown placement="bottom-start">
          <template #default>
            <dao-button
              type="tertiary"
              icon-left="icon-more-horizontal"
              use-font
            />
          </template>
          <template #menu>
            <dao-dropdown-menu>
              <dao-dropdown-item @click="onEdit">
                {{ t("common.edit") }}
              </dao-dropdown-item>
              <dao-dropdown-item type="divider" />

              <dao-popover
                placement="left"
                :disabled="canDelete"
              >
                <dao-dropdown-item
                  :disabled="!canDelete"
                  color="red"
                  @click="onConfirmDelete(dataset?.metadata?.name)"
                >
                  {{ t("common.delete") }}
                </dao-dropdown-item>

                <template #content>
                  <dao-message
                    simple
                    type="error"
                    :content="`该数据集被实验 ${referencedByExperiments} 使用，无法删除`"
                  />
                </template>
              </dao-popover>
            </dao-dropdown-menu>
          </template>
        </dao-dropdown>
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
              <dao-hover-card
                v-if="row.value"
                :data="row.value?.split(',')"
              />
              <template v-else>
                -
              </template>
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

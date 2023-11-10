<script lang="ts" setup>
import { PropType, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDateFormat } from '@dao-style/extend';
import { useI18n } from 'vue-i18n';
import { Dataset } from '@/api/dataset';

const { t } = useI18n();

const props = defineProps({
  data: {
    type: Object as PropType<Dataset>,
    default: () => ({}),
  },
});

const router = useRouter();
const emits = defineEmits(['on-delete']);

const editDataset = () => {
  router.push({
    name: 'DatasetCreate',
    query: {
      name: props.data.metadata?.name,
    },
  });
};

const onDelete = () => {
  emits('on-delete', props.data.metadata?.name);
};

const infos = computed(() => {
  const { metadata, spec } = props.data;

  const creationTimestamp = metadata?.creationTimestamp;

  const datasetMetadata = spec?.datasetMetadata;
  const datasetInfo = datasetMetadata?.datasetInfo;
  const task = datasetMetadata?.task;
  const tags = datasetMetadata?.tags;

  const [firstSubset] = datasetInfo?.subsets ?? [];
  const splits = firstSubset ? firstSubset.splits : null;

  const items = [
    {
      label: t('views.Dataset.taskType'),
      value: task?.name,
    },
    {
      label: t('views.Dataset.trainingData'),
      value: splits?.train?.file,
    },
    {
      label: t('common.createTime'),
      value: useDateFormat(creationTimestamp),
    },
    {
      label: t('views.Dataset.testingData'),
      value: splits?.test?.file,
    },
    {
      label: t('views.Dataset.tag'),
      value: tags?.join(','),
      slotId: 'tag',
    },
    {
      label: t('views.Dataset.validationData'),
      value: splits?.validate?.file,
    },
  ];

  return items;
});

const languages = computed(() => {
  const langs = props.data.spec?.datasetMetadata.languages;

  return langs?.map((lang) => t(`views.Dataset.${lang}`)).join(',') ?? '-';
});
</script>

<template>
  <dao-card
    class="dataset-item"
    icon="icon-mspider"
    divider
    use-font
  >
    <template #title>
      <router-link
        class="dataset-item__header__text active"
        :to="{
          name: 'DatasetDetail',
          params: { name: props.data.metadata?.name },
        }"
      >
        {{ props.data.metadata?.name }}
      </router-link>

      <!-- <dao-state-icon :type="'success'">
        {{ t('views.Dataset.available') }}
      </dao-state-icon>

      <dao-state-icon :type="'error'">
        {{ t('views.Dataset.noAvailable') }}
      </dao-state-icon> -->
    </template>

    <template #action>
      <dao-dropdown placement="bottom-end">
        <dao-button
          type="ghost"
          icon-left="icon-more-horizontal"
          use-font
          size="sm"
        />
        <template #menu>
          <dao-dropdown-menu>
            <dao-dropdown-item @click="editDataset">
              {{ t('common.edit') }}
            </dao-dropdown-item>
            <dao-dropdown-item type="divider" />
            <dao-dropdown-item
              color="red"
              @click="onDelete"
            >
              {{ t('common.delete') }}
            </dao-dropdown-item>
          </dao-dropdown-menu>
        </template>
      </dao-dropdown>
    </template>

    <dao-card-item>
      <dao-key-value-layout
        :column="2"
        :data="infos"
      >
        <template #kv-tag="{ row }">
          <dao-key-value-layout-item :label="row.label">
            <dao-hover-card :data="row.value?.split(',')" />
          </dao-key-value-layout-item>
        </template>
      </dao-key-value-layout>
    </dao-card-item>

    <dao-card-item class="flex">
      <dao-key-value-layout
        :direction="'vertical'"
        class="flex flex-nowrap flex-grow items-center"
      >
        <dao-key-value-layout-item
          :label="t('views.Dataset.licenseInformation')"
          class="text-center"
        >
          <span class="dataset-item__text">
            {{ props.data.spec?.datasetMetadata.license ?? '-' }}
          </span>
        </dao-key-value-layout-item>

        <dao-key-value-layout-item
          class="text-center"
          :label="t('views.Dataset.datasetSize')"
        >
          <span class="dataset-item__text dataset-item__size">
            {{ props.data.spec?.datasetMetadata.size ?? '-' }}
          </span>
        </dao-key-value-layout-item>

        <dao-key-value-layout-item
          class="text-center"
          :label="t('views.Dataset.language')"
        >
          <span class="dataset-item__text">
            {{ languages }}
          </span>
        </dao-key-value-layout-item>
      </dao-key-value-layout>
    </dao-card-item>
  </dao-card>
</template>

<style lang="scss" scoped>
.dataset-item {
  &__header {
    display: flex;
    align-items: center;
    font-weight: 700;
    color: var(--dao-text-pageTitle);

    &__text {
      display: inline-block;
      max-width: 75%;
      margin-right: 30px;
      overflow: hidden;
      color: var(--dao-text-primary);
      text-decoration: none;
      text-overflow: ellipsis;
      white-space: nowrap;

      &.active {
        &:hover,
        &:active {
          color: var(--dao-primary-blue-040);
        }
      }
    }
  }

  &__text {
    font-size: 28px;
    font-weight: bold;
  }

  &__size {
    color: var(--dao-green-030);
  }
}
</style>

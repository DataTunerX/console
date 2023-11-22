<script lang="ts" setup>
import { PropType, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDateFormat } from '@dao-style/extend';
import { useI18n } from 'vue-i18n';
import { Dataset } from '@/api/dataset';
import DatasetStatus from './DatasetStatus.vue';

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
      label: t('views.Dataset.validationData'),
      value: splits?.validate?.file,
    },
    {
      label: t('views.Dataset.tag'),
      value: tags?.join(','),
      slotId: 'tag',
    },
    {
      label: t('views.Dataset.testingData'),
      value: splits?.test?.file,
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
      <div class="dataset-item__header">
        <router-link
          class="dataset-item__header__text dataset-item__header__text--link"
          :to="{
            name: 'DatasetDetail',
            params: { name: props.data.metadata?.name },
          }"
        >
          {{ props.data.metadata?.name }}
        </router-link>

        <dataset-status :data="props.data" />
      </div>
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

    <dao-card-item class="flex">
      <div class="dataset-status__container">
        <div class="dataset-status__card">
          <div class="dataset-status__num">
            <span>
              {{ props.data.spec?.datasetMetadata.license ?? '-' }}
            </span>
            <span class="dataset-status__tip">
              {{ t('views.Dataset.licenseInformation') }}
            </span>
          </div>
        </div>

        <div class="dataset-status__card">
          <div class="dataset-status__num">
            <span class="dataset-status__size">
              {{ props.data.spec?.datasetMetadata.size ?? '-' }}
            </span>
            <span class="dataset-status__tip">
              {{ t('views.Dataset.datasetSize') }}
            </span>
          </div>
        </div>
        <div class="dataset-status__card">
          <div class="dataset-status__num">
            <span>
              {{ languages }}
            </span>
            <span class="dataset-status__tip">
              {{ t('views.Dataset.language') }}
            </span>
          </div>
        </div>
      </div>
    </dao-card-item>
  </dao-card>
</template>

<style lang="scss" scoped>
.dataset-item {
  &__header {
    display: flex;
    align-items: center;
    font-weight: 600;
    color: var(--dao-text-pageTitle);

    &__text {
      display: inline-block;
      max-width: 75%;
      margin-right: 10px;
      overflow: hidden;
      font-weight: 700;
      text-decoration: none;
      text-overflow: ellipsis;
      white-space: nowrap;

      &--link {
        color: var(--dao-text-primary);
        cursor: pointer;

        &:hover,
        &:active {
          color: var(--dao-primary-blue-040);
        }
      }
    }
  }

  .dataset-status {
    width: 100%;

    &__container {
      display: flex;
      width: 100%;
      padding: 0 16px;
      font-size: 20px;
      font-weight: bold;
      line-height: 1;
      color: var(--dao-gray-010);
    }

    &__card {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
    }

    &__num {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    &__size{
      color: var(--dao-green-030);
    }

    &__tip {
      margin-top: 27px;
      font-size: 12px;
      // font-weight: 700;
      line-height: 16px;
      color: var(--dao-gray-070);
    }
  }

}
</style>

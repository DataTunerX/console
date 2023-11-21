<script lang="ts" setup>
import { PropType, computed } from 'vue';
import { FinetuneJob } from '@/api/finetune-job';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  data: {
    type: Object as PropType<FinetuneJob>,
    default: () => ({}),
  },
});
const { t } = useI18n();

const infos = computed(() => {
  const { data: { spec } } = props;
  const llms = spec?.finetune?.finetuneSpec.llm;
  const datasets = spec?.finetune.finetuneSpec.dataset;
  const hyperparameters = spec?.finetune.finetuneSpec.hyperparameter?.hyperparameterRef;

  const items = [
    {
      label: t('views.FinetuneExperiment.basicLargeModel'),
      value: llms,
      slotId: 'llm',
    },
    {
      label: t('views.FinetuneExperiment.dataSet'),
      value: datasets,
      slotId: 'dataset',
    },
    {
      label: t('views.FinetuneExperiment.parameterGroup'),
      value: hyperparameters,
      slotId: 'hyperparameter',
    },
  ];

  return items;
});
const infosTwo = computed(() => {
  const { data: { spec } } = props;

  const items = [
    {
      label: t('views.FinetuneExperiment.results'),
      value: spec?.finetune.finetuneSpec.hyperparameter?.hyperparameterRef,
      slotId: 'hyperparameterRef',
    },
  ];

  return items;
});
</script>

<template>
  <dao-card
    class="finetune-job-item"
    icon="icon-dsp"
    divider
    use-font
  >
    <template #title>
      cfh
      <dao-state-icon :type="'success'">
        {{ t('common.run') }}
      </dao-state-icon>
    </template>

    <dao-card-item class="finetune-experiment-item__base-info">
      <div class="flex">
        <div class="flex-1 w-0">
          <dao-key-value-layout
            :column="1"
            :data="infos"
            direction="horizontal"
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
        </div>
        <div class="flex-1 ml-[20px]">
          <dao-key-value-layout
            :column="1"
            :data="infosTwo"
            direction="horizontal"
          >
            <template #kv-hyperparameterRef="{ row }">
              <dao-key-value-layout-item :label="row.label">
                🐛
              </dao-key-value-layout-item>
            </template>
          </dao-key-value-layout>
        </div>
      </div>
    </dao-card-item>
    <dao-card-item class="flex">
      Working hard on this.
    </dao-card-item>
  </dao-card>
</template>

<style lang="scss">
.finetune-job-item {
  &.finetune-job-item{
    margin-top: 20px;
  }

  // &__base-info.dao-card-item {
  //   flex: 1.25 1 0;
  // }

  &__header {
   display: flex;
    align-items: center;
    font-weight: 700;
    color: var(--dao-text-pageTitle);

    &__text {
      display: inline-block;
      max-width: 75%;
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

.dao-key-value-layout.is-horizontal .dao-key-value-layout-item__label {
  width: 110px;
}
</style>

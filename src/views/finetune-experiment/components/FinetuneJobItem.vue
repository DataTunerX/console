<script lang="ts" setup>
import { FinetuneJobWithName } from '@/api/finetune-experiment';
import { PropType, computed } from 'vue';
import { Theme as datasetTheme } from '@/api/dataset';
import { Theme as llmTheme } from '@/api/large-language-model';
import { useI18n } from 'vue-i18n';
import ExperimentJobStatus from '@/views/finetune-experiment-job/components/ExperimentJobStatus.vue';
import HyperparameterWithOverrides from '@/views/finetune-experiment-job/components/HyperparameterWithOverrides.vue';

const props = defineProps({
  data: {
    type: Object as PropType<FinetuneJobWithName>,
    default: () => ({}),
  },
  name: {
    type: String,
    default: '',
  },
});

const { t } = useI18n();

const infos = computed(() => {
  const { data: { spec, status } } = props;
  const llms = spec?.finetune?.finetuneSpec.llm;
  const datasets = spec?.finetune.finetuneSpec.dataset;

  const items = [
    {
      label: t('views.FinetuneExperiment.results'),
      value: status?.result?.score ?? '0',
      slotId: 'score',
    },
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
      slotId: 'hyperparameter',
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
      <div class="finetune-job-item__header">
        <router-link
          v-if="props.data.name"
          class="finetune-job-item__header__text finetune-job-item__header__text--link"
          :to="{
            name: 'FinetuneExperimentJobDetail',
            params: { name: props.name, jobName: props.data.name },
          }"
        >
          {{ props.data.name }}
        </router-link>

        <experiment-job-status :data="props.data" />
      </div>
    </template>

    <dao-card-item>
      <dao-key-value-layout
        :column="1"
        :data="infos"
      >
        <template #kv-score="{ row }">
          <dao-key-value-layout-item :label="row.label">
            <span class="font-bold">
              {{ row.value }}
            </span>
          </dao-key-value-layout-item>
        </template>

        <template #kv-llm="{ row }">
          <dao-key-value-layout-item :label="row.label">
            <dao-hover-card :data="row.value?.split(',')">
              <template #item="{ text }">
                <dao-label-extend :color="llmTheme">
                  {{ text }}
                </dao-label-extend>
              </template>
            </dao-hover-card>
          </dao-key-value-layout-item>
        </template>

        <template #kv-dataset="{ row }">
          <dao-key-value-layout-item :label="row.label">
            <dao-hover-card :data="row.value?.split(',')">
              <template #item="{ text }">
                <dao-label-extend :color="datasetTheme">
                  {{ text }}
                </dao-label-extend>
              </template>
            </dao-hover-card>
          </dao-key-value-layout-item>
        </template>

        <template #kv-hyperparameter="{ row }">
          <dao-key-value-layout-item :label="row.label">
            <hyperparameter-with-overrides :data="props.data.spec?.finetune.finetuneSpec.hyperparameter" />
          </dao-key-value-layout-item>
        </template>
      </dao-key-value-layout>
    </dao-card-item>

    <dao-card-item class="!grow-[2]">
      Working hard on this.
    </dao-card-item>
  </dao-card>
</template>

<style lang="scss" scoped>
.finetune-job-item {
  margin-top: 20px;
  margin-right: 15px;
  margin-left: 15px;

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
}
</style>

<script lang="ts" setup>
import { PropType, computed } from 'vue';
import { useDateFormat } from '@dao-style/extend';
import { FinetuneExperiment, State as FinetuneExperimentState } from '@/api/finetune-experiment';
import { useI18n } from 'vue-i18n';
import { State as FinetuneJobState } from '@/api/finetune-job';
import ExperimentStatus from './ExperimentStatus.vue';

const props = defineProps({
  data: {
    type: Object as PropType<FinetuneExperiment>,
    default: () => ({}),
  },
});

const emits = defineEmits(['on-delete', 'on-stop']);

const { t } = useI18n();

const stopExperiment = () => {
  emits('on-stop', props.data);
};

const onDelete = () => {
  emits('on-delete', props.data.metadata?.name);
};

const readyJobs = computed(() => {
  const { jobsStatus } = props.data.status ?? {};

  return jobsStatus?.filter((job) => job.state === FinetuneJobState.Successful).length ?? 0;
});

const infos = computed(() => {
  const {
    data: { metadata, spec },
  } = props;
  const creationTimestamp = metadata?.creationTimestamp;
  const llms = spec?.finetuneJobs
    .map((job) => job.spec?.finetune.finetuneSpec.llm)
    .filter((i) => i);
  const datasets = spec?.finetuneJobs.map((job) => job.spec?.finetune.finetuneSpec.dataset);
  const hyperparameters = spec?.finetuneJobs.map(
    (job) => job.spec?.finetune.finetuneSpec.hyperparameter?.hyperparameterRef,
  );

  const items = [
    {
      label: t('views.FinetuneExperiment.basicLargeModel'),
      value: llms?.join(','),
      slotId: 'llm',
    },
    {
      label: t('views.FinetuneExperiment.evaluationMethod'),
      value: spec?.scoringConfig.name,
    },
    {
      label: t('views.FinetuneExperiment.dataSet'),
      value: datasets?.join(','),
      slotId: 'dataset',
    },
    {
      label: t('common.createTime'),
      value: useDateFormat(creationTimestamp),
    },
    {
      label: t('views.FinetuneExperiment.parameterGroup'),
      value: hyperparameters?.join(','),
      slotId: 'hyperparameter',
    },
  ];

  return items;
});
</script>

<template>
  <dao-card
    class="finetune-experiment-item"
    icon="icon-engine"
    divider
    use-font
  >
    <template #title>
      <div class="finetune-experiment-item__header">
        <router-link
          class="finetune-experiment-item__header__text finetune-experiment-item__header__text--link"
          :to="{
            name: 'FinetuneExperimentDetail',
            params: { name: props.data.metadata?.name },
          }"
        >
          {{ props.data.metadata?.name }}
        </router-link>

        <experiment-status :data="props.data" />
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
            <dao-dropdown-item
              :disabled="props.data.status?.state === FinetuneExperimentState.Pending"
              @click="stopExperiment"
            >
              {{ $t('common.stop') }}
            </dao-dropdown-item>
            <dao-dropdown-item type="divider" />
            <dao-dropdown-item
              color="red"
              @click="onDelete"
            >
              {{ $t('common.delete') }}
            </dao-dropdown-item>
          </dao-dropdown-menu>
        </template>
      </dao-dropdown>
    </template>

    <dao-card-item class="finetune-experiment-item__base-info">
      <dao-key-value-layout
        :column="2"
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

    <dao-card-item class="flex">
      <div class="finetune-status__container">
        <div class="finetune-status__card">
          <div class="finetune-status__num">
            <div class="finetune-status__duration">
              😊
            </div>
            <div class="finetune-status__tip">
              {{ $t('views.FinetuneExperiment.duration') }}
            </div>
          </div>
        </div>

        <div class="finetune-status__card">
          <div class="finetune-status__num">
            <div class="finetune-status__point">
              {{ props.data.status?.bestVersion?.score??'-' }}
            </div>
            <div class="finetune-status__tip">
              {{ $t('views.FinetuneExperiment.highestScore') }}
            </div>
          </div>
        </div>
        <div class="finetune-status__card">
          <div class="finetune-status__num">
            <div>
              <span class="finetune-status__num-ready">
                {{ readyJobs }}
              </span>
              <span class="finetune-status__num-total">
                / {{ props.data.spec?.finetuneJobs.length }}
              </span>
            </div>
            <div class="finetune-status__tip">
              {{ $t('views.FinetuneExperiment.taskStatus') }}
            </div>
          </div>
        </div>
      </div>
    </dao-card-item>
  </dao-card>
</template>

<style lang="scss">
.finetune-experiment-item {
  & + & {
    margin-top: 20px;
  }

  .dao-card-header .dao-card-header-icon.icon-engine {
    color: var(--dao-text-primary);
  }

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

  .finetune-status {
    width: 100%;

    &__container {
      display: flex;
      width: 100%;
      padding: 0 16px;
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

    &__title {
      font-weight: 500;
    }

    &__duration{
      font-size: 32px;
      font-weight: 600;
      line-height: 1;
      color: var(--dao-gray-010);
    }

    &__point{
      font-size: 32px;
      font-weight: 600;
      line-height: 1;
      color: var(--dao-gray-010);
    }

    &__num-ready {
      font-size: 32px;
      font-weight: 700;
      line-height: 1;
      color: var(--dao-green-030);
    }

    &__num-total {
      margin-left: 4px;
      font-size: 13px;
      font-weight: 700;
      line-height: 18px;
      color: var(--dao-gray-010);
    }

    &__tip {
      margin-top: 27px;
      font-size: 12px;
      font-weight: 700;
      line-height: 16px;
      color: var(--dao-gray-070);
    }
  }
}

.dao-key-value-layout.is-horizontal .dao-key-value-layout-item__label {
  width: 110px;
}
</style>

<!-- eslint-disable @typescript-eslint/no-shadow -->
<script lang="ts" setup>
import { PropType, computed } from 'vue';
import { FinetuneJob } from '@/api/finetune-job';

const props = defineProps({
  data: {
    type: Array as PropType<FinetuneJob>,
    default: () => ([]),
  },
});

const infos = computed(() => {
  const { data: { spec } } = props;
  const llms = spec?.finetune?.finetuneSpec.llm;
  const datasets = spec?.finetune.finetuneSpec.dataset;
  const hyperparameters = spec?.finetune.finetuneSpec.hyperparameter?.hyperparameterRef;

  const items = [
    {
      label: '基础大模型',
      value: llms,
      slotId: 'llm',
    },
    // {
    //   label: '评估方式',
    //   value: spec?.scoringConfig.name,
    // },
    {
      label: '数据集',
      value: datasets,
      slotId: 'dataset',
    },
    // {
    //   label: '创建时间',
    //   value: useDateFormat(creationTimestamp),
    // },
    {
      label: '超参组',
      value: hyperparameters,
      slotId: 'hyperparameter',
    },
  ];

  return items;
});

</script>

<template>
  <dao-card
    class="finetune-experiment-item"
    icon="icon-mspider"
    divider
    use-font
  >
    <template #title>
      <router-link
        class="finetune-experiment-item__header__text active"
        :to="{
          name: 'FinetuneExperimentDetail',
          params: { name: props.data.metadata?.name },
        }"
      >
        {{ props.data.metadata?.name }}
      </router-link>

      <dao-state-icon :type="'success'">
        运行中
      </dao-state-icon>

      <dao-state-icon :type="'error'">
        运行中
      </dao-state-icon>
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
  </dao-card>
</template>

<style lang="scss">
.finetune-experiment-item {
  &.finetune-experiment-item{
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

.dao-key-value-layout.is-horizontal .dao-key-value-layout-item__label {
  width: 110px;
}
</style>

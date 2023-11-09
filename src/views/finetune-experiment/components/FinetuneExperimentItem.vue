<!-- eslint-disable @typescript-eslint/no-shadow -->
<script lang="ts" setup>
import { PropType, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDateFormat } from '@dao-style/extend';
import { FinetuneExperiment } from '@/api/finetune-experiment';

const props = defineProps({
  data: {
    type: Object as PropType<FinetuneExperiment>,
    default: () => ({}),
  },
});

const router = useRouter();
const emits = defineEmits(['on-delete']);

const editFineTuneExperiment = () => {
  router.push({
    name: 'FinetuneExperimentCreate',
    query: {
      name: props.data.metadata?.name,
    },
  });
};

const onDelete = () => {
  emits('on-delete', props.data.metadata?.name);
};

const infos = computed(() => {
  const { data: { metadata, spec } } = props;
  const creationTimestamp = metadata?.creationTimestamp;
  const llms = spec?.finetuneJobs.map((job) => job.spec?.finetune.finetuneSpec.llm).filter((i) => i);
  const datasets = spec?.finetuneJobs.map((job) => job.spec?.finetune.finetuneSpec.dataset);
  const hyperparameters = spec?.finetuneJobs.map((job) => job.spec?.finetune.finetuneSpec.hyperparameter);

  const items = [
    {
      label: '基础大模型',
      value: llms?.join(','),
      slotId: 'llm',
    },
    {
      label: '评估方式',
      value: spec?.scoringConfig.name,
    },
    {
      label: '数据集',
      value: datasets?.join(','),
      slotId: 'dataset',
    },
    {
      label: '创建时间',
      value: useDateFormat(creationTimestamp),
    },
    {
      label: '超参组',
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
            <dao-dropdown-item @click="editFineTuneExperiment">
              编辑
            </dao-dropdown-item>
            <dao-dropdown-item @click="editFineTuneExperiment">
              停止
            </dao-dropdown-item>
            <dao-dropdown-item type="divider" />
            <dao-dropdown-item
              color="red"
              @click="onDelete"
            >
              删除
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
      <dao-key-value-layout
        :direction="'vertical'"
        class="flex flex-nowrap flex-grow items-center"
      >
        <dao-key-value-layout-item
          label="已持续时间"
          class="text-center"
        >
          <span class="finetune-experiment-item__text">
            1小时32分
          </span>
        </dao-key-value-layout-item>

        <dao-key-value-layout-item
          class="text-center"
          label="最高评分"
        >
          <span class="finetune-experiment-item__text finetune-experiment-item__size">
            86
          </span>
        </dao-key-value-layout-item>

        <dao-key-value-layout-item
          class="text-center"
          label="任务状态"
        >
          <span class="finetune-experiment-item__text" />
        </dao-key-value-layout-item>
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

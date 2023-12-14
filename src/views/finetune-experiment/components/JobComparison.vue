<script lang="ts" setup>
import { TransferActionDirection } from '@dao-style/core';
import { FinetuneJobWithName } from '@/api/finetune-experiment';
import JobChart from './JobChart.vue';

const props = defineProps({
  jobs: {
    type: Array as PropType<FinetuneJobWithName[]>,
    default: () => ([]),
  },
});

const selectedKeys = ref<string[]>([]);

type Row = {
  key: string;
  label?: string;
  desc?: string;
};

const data = computed(() => props.jobs.map((job) => ({
  key: job.name,
  label: job.name,
  desc: job.spec?.finetune.finetuneSpec.llm,
})));

const onChange = ({ direction, row }: { direction: TransferActionDirection; row: Row }) => {
  const { key } = row;
  const index = selectedKeys.value.indexOf(key);

  switch (direction) {
    case 'left':
      if (index > -1) {
        selectedKeys.value.splice(index, 1);
      }
      break;

    case 'right':
      if (index > -1) {
        selectedKeys.value.push(key);
      }
      break;

    default:
      // eslint-disable-next-line no-console
      console.warn(`${direction} callback is not defined`);
      break;
  }
};

const onCheckAll = ({ checked, checkableList }: { checked: boolean; checkableList: string[] }) => {
  if (checked) {
    // 去除重复的key
    selectedKeys.value = [...new Set(selectedKeys.value.concat(checkableList))];
  } else {
    selectedKeys.value = selectedKeys.value.filter((key) => !checkableList.includes(key));
  }
};
</script>

<template>
  <div class="job-comparison">
    <div class="job-list">
      <dao-transfer-panel
        type="source"
        :data="data"
        :checked-keys="selectedKeys"
        filterable
        @selected-change="onChange"
        @check-all="onCheckAll"
      >
        <template #check-all />
      </dao-transfer-panel>
    </div>
    <job-chart class="flex-1" />
  </div>
</template>

<style lang="scss" scoped>
.job-comparison {
  display: flex;
  height: 600px;

  .job-list {
    display: flex;
    flex-direction: column;
    width: 248px;
    background: #fff;

    :deep(.dao-transfer-panel) {
      padding: 0;
      padding-right: 5px;
      border-radius: 0;
    }

    :deep(.dao-transfer-panel__head) {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }

}
</style>

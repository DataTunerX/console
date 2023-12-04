<script lang="ts" setup>
import { FinetuneJobWithName } from '@/api/finetune-experiment';

defineProps({
  jobs: {
    type: Array as PropType<FinetuneJobWithName[]>,
    required: true,
  },
});

const modelArr = ref([]);
</script>

<template>
  <div class="job-comparison">
    <div class="job-list">
      <div class="job-name-search">
        <dao-input
          block
          type="search"
        />
      </div>

      <dao-checkbox-group
        v-model="modelArr"
        class="job-name-list"
      >
        <dao-checkbox
          v-for="job in jobs"
          :key="job.name"
          class="job-name"
          :value="job.name"
        >
          {{ job.name }}
        </dao-checkbox>
      </dao-checkbox-group>
    </div>
    <div class="job-chart">
      <dao-select>
        <dao-option
          label="you will get me by this"
          value="hhhhh"
        >
          我是中文但是你搜索不到我
        </dao-option>
      </dao-select>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$dao-gray-160: var(--dao-gray-160);
$box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
$border-radius: 10px;

.job-comparison {
  display: flex;
  height: 600px;
  padding: 20px;

  .job-list, .job-chart {
    border-radius: $border-radius;
    box-shadow: $box-shadow;
  }

  .job-name-search, .job-name {
    padding: 10px 12px;
    border-bottom: 1px solid $dao-gray-160;
  }

  .job-list {
    display: flex;
    flex-direction: column;
    width: 240px;
    background: #fff;
  }

  .job-name-list{
    flex-grow: 1;
    width: 100%;
    overflow: scroll;
  }

  .job-name {
    width: 100%;
    padding: 15px;
    margin: 0;
  }

  .job-chart {
    flex-grow: 1;
    padding: 20px;
    margin-left: 20px;
  }
}
</style>

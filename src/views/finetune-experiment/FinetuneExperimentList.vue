<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useNamespaceStore } from '@/stores/namespace';
import { useFinetuneExperiment } from './composition/finetune';
import FinetuneExperimentItem from './components/FinetuneExperimentItem.vue';

const { namespace } = storeToRefs(useNamespaceStore());

const router = useRouter();

const searchOptions = reactive([
  {
    key: 'cluster',
    label: '集群',
    single: false,
  },
  {
    key: 'status',
    label: '状态',
    values: [
      {
        value: 'healthy',
        label: '健康',
      },
      {
        value: 'unhealthy',
        label: '异常',
      },
    ],
    enum: true,
  },
]);

const search = ref({});

const onCreate = () => {
  router.push({
    name: 'FinetuneExperimentCreate',
  });
};

const { finetuneExperiments, fetchFinetuneExperiments } = useFinetuneExperiment();

onMounted(() => {
  fetchFinetuneExperiments(namespace.value);
});
</script>

<template>
  <div class="finetune-experiment-list console-main-container">
    <dao-header
      type="2nd"
      title="微调实验"
    />
    <dao-toolbar
      v-model:search="search"
      class="mt-[20px]"
      :search-options="searchOptions"
      :fuzzy="{ key: 'fuzzy', single: true }"
    >
      <template #action>
        <dao-button
          type="primary"
          @click="onCreate"
        >
          创建微调实验
        </dao-button>
      </template>
    </dao-toolbar>

    <FinetuneExperimentItem
      v-for="experiment in finetuneExperiments"
      :key="experiment.metadata?.name"
      :data="experiment"
    />
  </div>
</template>

<style lang="scss" scoped>
.finetune-experiment-list {
  .dao-toolbar-container {
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
  }

}
</style>

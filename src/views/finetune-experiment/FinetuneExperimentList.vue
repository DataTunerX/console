<script setup lang="ts">
import {
  reactive, ref, onMounted, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useNamespaceStore } from '@/stores/namespace';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog.vue';
import { finetuneExperimentClient } from '@/api/finetune-experiment';
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

const refresh = () => fetchFinetuneExperiments(namespace.value);

onMounted(() => {
  refresh();
});

const experimentToDelete = ref('');
const dialogVisible = ref(false);

const deleteFn = (name:string) => finetuneExperimentClient.delete(namespace.value, name);

const confirmProps = computed(() => ({
  header: '删除微调实验',
  content: `确定删除微调实验 ${experimentToDelete.value} 吗？移除后对应的数据将会全部丢失且无法恢复，请谨慎操作。`,
  name: experimentToDelete.value,
  deleteFn,
}));

const onConfirmDelete = (name:string) => {
  experimentToDelete.value = name;
  dialogVisible.value = true;
};
const closeDialog = () => {
  dialogVisible.value = false;
};

const onDeleteSuccess = () => {
  refresh();
  closeDialog();
};
</script>

<template>
  <div class="finetune-experiment-list console-main-container">
    <dao-header
      type="2nd"
      title="微调实验"
    />
    <dao-toolbar
      v-model:search="search"
      :search-options="searchOptions"
      :fuzzy="{ key: 'fuzzy', single: true }"
      @refresh="refresh"
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
      @on-delete="onConfirmDelete"
    />
  </div>

  <ConfirmDeleteDialog
    v-model="dialogVisible"
    v-bind="confirmProps"
    @reject="closeDialog"
    @resolve="onDeleteSuccess"
  />
</template>

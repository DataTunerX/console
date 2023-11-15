<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useNamespaceStore } from '@/stores/namespace';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog.vue';
import { FinetuneExperiment, finetuneExperimentClient } from '@/api/finetune-experiment';
import { useQueryTable } from '@/hooks/useQueryTable';
import FinetuneExperimentItem from './components/FinetuneExperimentItem.vue';

const { namespace } = storeToRefs(useNamespaceStore());
const router = useRouter();

const {
  isLoading, pagedData, page, pageSize, total, handleRefresh, search,
} = useQueryTable<FinetuneExperiment>(async () => finetuneExperimentClient.list(namespace.value));

watch(namespace, handleRefresh);

const experimentToDelete = ref('');
const dialogVisible = ref(false);

const onCreate = () => {
  router.push({
    name: 'FinetuneExperimentCreate',
  });
};

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
  handleRefresh();
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
      v-model:search="search.keywords"
      :fuzzy="{ key: 'fuzzy', single: true }"
      @refresh="handleRefresh"
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

    <div v-loading="isLoading">
      <dao-empty v-if="!pagedData.length" />

      <FinetuneExperimentItem
        v-for="experiment in pagedData"
        v-else
        :key="experiment.metadata?.name"
        :data="experiment"
        @on-delete="onConfirmDelete"
      />

      <dao-pagination
        v-if="total"
        v-model:current-page="page"
        v-model:page-size="pageSize"
        class="mt-[20px]"
        :total="total"
      />
    </div>

    <ConfirmDeleteDialog
      v-model="dialogVisible"
      v-bind="confirmProps"
      @reject="closeDialog"
      @resolve="onDeleteSuccess"
    />
  </div>
</template>

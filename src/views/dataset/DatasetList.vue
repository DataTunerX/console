<script lang="ts" setup>
import { useNamespaceStore } from '@/stores/namespace';
import { datasetClient } from '@/api/dataset';
import { useQueryTable } from '@/hooks/useQueryTable';
import { useExperimentStore } from '@/stores/experiment';
import DatasetItem from './components/DatasetItem.vue';
import { useDeleteDataset } from './composition/dataset';

const router = useRouter();
const { namespace } = storeToRefs(useNamespaceStore());

const {
  isLoading, pagedData, page, pageSize, total, handleRefresh, search,
} = useQueryTable(() => datasetClient.list(namespace.value));

const { fetchExperiment } = useExperimentStore();
const { datasetWithExperiment } = storeToRefs(useExperimentStore());

fetchExperiment(namespace.value);

const { onConfirmDelete } = useDeleteDataset(namespace.value, handleRefresh);

watch(namespace, handleRefresh);

const onCreate = () => router.push({ name: 'DatasetCreate' });
</script>

<template>
  <div class="dataset-list console-main-container">
    <dao-header
      type="2nd"
      :title="$t('views.Dataset.header')"
    />

    <dao-toolbar
      v-model:search="search"
      :fuzzy="{ key: 'fuzzy', single: true }"
      @refresh="handleRefresh"
    >
      <template #action>
        <dao-button @click="onCreate">
          {{ $t("views.Dataset.create") }}
        </dao-button>
      </template>
    </dao-toolbar>

    <div v-loading="isLoading">
      <dao-empty v-if="!pagedData.length" />
      <dataset-item
        v-for="dataset in pagedData"
        v-else
        :key="dataset.metadata?.name"
        class="mt-[20px]"
        :data="dataset"
        :referenced-by-experiments="datasetWithExperiment[dataset.metadata?.name as string]"
        @on-delete="onConfirmDelete(dataset.metadata?.name)"
      />
      <dao-pagination
        v-if="pagedData.length"
        v-model:current-page="page"
        v-model:page-size="pageSize"
        class="mt-[20px]"
        :total="total"
      />
    </div>
  </div>
</template>

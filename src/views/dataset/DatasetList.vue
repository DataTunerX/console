<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useNamespaceStore } from '@/stores/namespace';
import { Dataset, listDatasets, deleteDataset } from '@/api/dataset';
import { chunk, get, first } from 'lodash';
import { nSuccess, nError } from '@/utils/useNoty';
import DatasetItem from './components/DatasetItem.vue';

const router = useRouter();
const namespaceStore = useNamespaceStore();

const search = ref<{fuzzy?: string[]}>({});

const onCreate = () => {
  router.push({
    name: 'DatasetCreate',
  });
};

const currentPage = ref(1);
const currentPageSize = ref(10);

const datasets = ref<Dataset[]>([]);
const loading = ref(true);
const fetchDatasets = async () => {
  loading.value = true;
  try {
    const res = await listDatasets(namespaceStore.namespace);

    loading.value = false;
    datasets.value = res.data.items;
  } catch (error) {
    nError('出错了', error);
  }
};

fetchDatasets();

const currentDatasets = computed(() => {
  const filteredData = datasets.value.filter((item) => item.metadata.name?.includes(first(search.value.fuzzy) ?? ''));

  return get(chunk(filteredData, currentPageSize.value), currentPage.value - 1) ?? [];
});

const datasetToDelete = ref<string>('');

const isShow = ref(false);
const hideDialog = () => {
  isShow.value = !isShow.value;
};
const showDialog = (dataset:string) => {
  isShow.value = true;
  datasetToDelete.value = dataset;
};

const confirmDelete = () => {
  deleteDataset(namespaceStore.namespace, datasetToDelete.value).then(() => {
    hideDialog();
    fetchDatasets();
    nSuccess('删除成功');
  }).catch((err) => {
    nError('删除失败', err);
  });
};
</script>

<template>
  <div class="dataset-list console-main-container">
    <dao-header
      type="2nd"
      :title="$t('views.dataset.title')"
    />

    <dao-toolbar
      v-model:search="search"
      :search-placeholder="' '"
      :fuzzy="{ key: 'fuzzy', single: true }"
      @refresh="fetchDatasets"
    >
      <template #action>
        <dao-button @click="onCreate">
          创建数据集
        </dao-button>
      </template>
    </dao-toolbar>

    <div v-loading="loading">
      <dataset-item
        v-for="dataset in currentDatasets"
        :key="dataset.metadata.name"
        class="mt-[20px]"
        :data="dataset"
        @on-delete="(dataset) => showDialog(dataset)"
      />
      <dao-pagination
        v-model:current-page="currentPage"
        v-model:page-size="currentPageSize"
        class="mt-[20px]"
        :total="datasets.length"
      />
    </div>
  </div>

  <dao-dialog
    :model-value="isShow"
    header="Basic Dialog"
    @cancel="hideDialog"
    @confirm="confirmDelete"
  >
    <div class="body">
      <div class="content">
        确认删除数据集 {{ datasetToDelete }} 吗？
      </div>
    </div>
    <template #footer>
      <dao-confirm-dialog-footer
        :text="datasetToDelete"
        confirm-text="delete"
      />
    </template>
  </dao-dialog>
</template>

<style lang="scss" scoped>
.dataset-list {
  flex: auto;
  overflow: auto;

}
</style>

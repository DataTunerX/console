<script lang="ts" setup>
import {
  ref, watch, watchEffect, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { first } from 'lodash';
import { useI18n } from 'vue-i18n';
import { useNamespaceStore } from '@/stores/namespace';
import { Dataset, datasetClient } from '@/api/dataset';
import { nSuccess, nError } from '@/utils/useNoty';
import DatasetItem from './components/DatasetItem.vue';

const { t } = useI18n();

const pageSize = ref(10);

const router = useRouter();
const namespaceStore = useNamespaceStore();
const { namespace } = storeToRefs(namespaceStore);

const search = ref<{ fuzzy: string[] }>();
const currentPage = ref(1);
const datasets = ref<Dataset[]>([]);
const loading = ref(true);
const showData = ref<Dataset[]>([]);
const datasetToDelete = ref<string>('');
const isShow = ref(false);

// 加载数据集列表
const loadDatasets = async () => {
  loading.value = true;
  try {
    const res = await datasetClient.list(namespace.value);

    datasets.value = res.data.items;

    if (datasets.value.length) {
      currentPage.value = 1;
    }
  } catch (error) {
    nError(t('common.error'), error);
  } finally {
    loading.value = false;
  }
};

// 显示删除对话框
const showDialog = (dataset: string) => {
  isShow.value = true;
  datasetToDelete.value = dataset;
};

// 隐藏删除对话框
const hideDialog = () => {
  isShow.value = false;
};

const deleteDataset = async () => {
  try {
    await datasetClient.delete(namespace.value, datasetToDelete.value);
    hideDialog();
    loadDatasets();
    nSuccess(t('common.notySuccess', { name: t('common.delete') }));
  } catch (err) {
    nError(t('common.notyError', { name: t('common.delete') }), err);
  }
};

const onCreate = () => router.push({ name: 'DatasetCreate' });
const onSearch = () => {
  currentPage.value = 1;
};

// 显示数据集列表
const filteredData = computed(() => datasets.value.filter((item) => item.metadata?.name?.includes(first(search.value?.fuzzy) ?? '')));

watchEffect(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = currentPage.value * pageSize.value;

  showData.value = filteredData.value.slice(startIndex, endIndex);
});

// 监听命名空间变化，重新加载数据集
watch(
  () => namespaceStore.namespace,
  loadDatasets,
  { immediate: true },
);
</script>

<template>
  <div class="dataset-list console-main-container">
    <dao-header
      type="2nd"
      :title="$t('views.Dataset.header')"
    />

    <dao-toolbar
      v-model:search="search"
      :search-placeholder="' '"
      :fuzzy="{ key: 'fuzzy', single: true }"
      @refresh="loadDatasets"
      @search="onSearch"
    >
      <template #action>
        <dao-button @click="onCreate">
          {{ $t('views.Dataset.create') }}
        </dao-button>
      </template>
    </dao-toolbar>

    <div v-loading="loading">
      <dataset-item
        v-for="dataset in showData"
        :key="dataset.metadata?.name"
        class="mt-[20px]"
        :data="dataset"
        @on-delete="(dataset) => showDialog(dataset)"
      />
      <dao-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        class="mt-[20px]"
        :total="filteredData.length"
      />
    </div>
  </div>

  <dao-dialog
    :model-value="isShow"
    header="Basic Dialog"
    @cancel="hideDialog"
    @confirm="deleteDataset"
  >
    <div class="body">
      <div class="content">
        {{ $t('views.Dataset.deleteConfirm', { datasetToDelete }) }}
      </div>
    </div>
    <template #footer>
      <dao-confirm-dialog-footer
        :text="datasetToDelete"
        :confirm-text="$t('common.delete')"
      />
    </template>
  </dao-dialog>
</template>

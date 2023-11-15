<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useNamespaceStore } from '@/stores/namespace';
import { Dataset, datasetClient } from '@/api/dataset';
import { nSuccess, nError } from '@/utils/useNoty';
import { useQueryTable } from '@/hooks/useQueryTable';
import DatasetItem from './components/DatasetItem.vue';

const { t } = useI18n();
const router = useRouter();
const { namespace } = storeToRefs(useNamespaceStore());

const datasetToDelete = ref<string>('');

const {
  isLoading, pagedData, page, pageSize, total, handleRefresh, search,
} = useQueryTable<Dataset>(async () => datasetClient.list(namespace.value));

watch(namespace, handleRefresh);

const isShow = ref(false);

const showDialog = (dataset: string) => {
  isShow.value = true;
  datasetToDelete.value = dataset;
};

const hideDialog = () => {
  isShow.value = false;
};

const deleteDataset = async () => {
  try {
    await datasetClient.delete(namespace.value, datasetToDelete.value);
    hideDialog();
    nSuccess(t('common.notySuccess', { name: t('common.delete') }));
    handleRefresh();
  } catch (err) {
    nError(t('common.notyError', { name: t('common.delete') }), err);
  }
};

const onCreate = () => router.push({ name: 'DatasetCreate' });
</script>

<template>
  <div class="dataset-list console-main-container">
    <dao-header
      type="2nd"
      :title="$t('views.Dataset.header')"
    />

    <dao-toolbar
      v-model:search="search.keywords"
      :fuzzy="{ key: 'fuzzy', single: true }"
      @refresh="handleRefresh"
    >
      <template #action>
        <dao-button @click="onCreate">
          {{ $t('views.Dataset.create') }}
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
        @on-delete="(dataset) => showDialog(dataset)"
      />
      <dao-pagination
        v-if="pagedData.length"
        v-model:current-page="page"
        v-model:page-size="pageSize"
        class="mt-[20px]"
        :total="total"
      />
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
  </div>
</template>

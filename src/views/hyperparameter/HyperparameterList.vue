<script setup lang="tsx">
import {
  ref, watchEffect, computed, watch,
} from 'vue';
import { useRouter } from 'vue-router';
import { defineColumns } from '@dao-style/core';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useDateFormat } from '@dao-style/extend';
import { first } from 'lodash';
import { nError, nSuccess } from '@/utils/useNoty';
import { useNamespaceStore } from '@/stores/namespace';
import { type Hyperparameter, hyperparameterClient } from '@/api/hyperparameter';
import { generateQueryString } from '@/utils/queryString';
import { useHyperparameter } from './composition/hyperparameter';

const router = useRouter();
const namespaceStore = useNamespaceStore();
const { namespace } = storeToRefs(namespaceStore);
const { t } = useI18n();

const showData = ref<Hyperparameter[]>([]);
const pageSize = ref(10);
const currentPage = ref(1);
const search = ref<{ fuzzy?: string[] }>({});

const columns = defineColumns([
  {
    id: 'name',
    header: t('views.hyperparameter.name'),
    sortable: true,
  },
  {
    id: 'fineTuningType',
    header: t('views.hyperparameter.fineTuningType'),
  },
  {
    id: 'parameters',
    header: t('views.hyperparameter.parameters'),
  },
  {
    id: 'createAt',
    header: t('common.createTime'),
  },
  {
    id: 'action',
    header: '',
    defaultWidth: '60px',
  },
]);

const { hyperparameters, fetchHyperparameters, loading } = useHyperparameter();

const refresh = () => fetchHyperparameters(namespace.value);

// 监听命名空间变化，重新加载数据集
watch(
  () => namespaceStore.namespace,
  () => {
    refresh();
  },
  {
    immediate: true,
  },
);

const onSearch = () => {
  currentPage.value = 1;
};

const filteredData = computed(() => hyperparameters.value.filter((item) => item.metadata.name?.includes(first(search.value.fuzzy) ?? '')));

watchEffect(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = currentPage.value * pageSize.value;

  showData.value = filteredData.value.slice(startIndex, endIndex);
});

const onUpdate = (name: string) => {
  router.push({
    name: 'HyperparameterCreate',
    query: {
      name,
    },
  });
};

const onCreate = () => {
  router.push({
    name: 'HyperparameterCreate',
  });
};

let hyperparameterToDelete: string;
const isShow = ref(false);

const hideDialog = () => {
  isShow.value = false;
};

const showDialog = (hyperparameter: string) => {
  isShow.value = true;
  hyperparameterToDelete = hyperparameter;
};

const confirmDelete = () => {
  hyperparameterClient
    .delete(namespace.value, hyperparameterToDelete)
    .then(() => {
      hideDialog();
      refresh();
      nSuccess(t('common.notySuccess', { name: t('common.delete') }));
    })
    .catch((err) => {
      nError(t('common.notyError', { name: t('common.delete') }), err);
    });
};
</script>

<template>
  <div class="hyperparameter-list console-main-container">
    <dao-header
      type="2nd"
      :title="t('views.hyperparameter.hyperparameterGroup')"
    />

    <dao-table
      id="demo"
      v-model:page-size="pageSize"
      v-model:current-page="currentPage"
      v-model:search="search"
      :loading="loading"
      :fuzzy="{ key: 'fuzzy', single: true }"
      :columns="columns"
      :data="showData"
      :total="filteredData.length"
      @refresh="refresh"
      @search="onSearch"
    >
      <template #th-action="{ column }">
        <div>{{ column.header }}</div>
      </template>

      <template #td-name="{ row }">
        <router-link
          class="list-name-link"
          :to="{
            name: 'HyperparameterDetail',
            params: {
              name: row.metadata.name,
            },
          }"
        >
          {{ row.metadata.name }}
        </router-link>
      </template>

      <template #td-createAt="{ row }">
        {{ useDateFormat(row.metadata.creationTimestamp) }}
      </template>

      <template #td-fineTuningType="{ row }">
        {{ row.spec.objective.type }}
      </template>

      <template #td-parameters="{ row }">
        <dao-hover-card :data="generateQueryString(row.spec.parameters)" />
      </template>

      <template #td-action-menu="{ row }">
        <dao-dropdown-item @click="onUpdate(row.metadata.name as string)">
          {{ t('common.edit') }}
        </dao-dropdown-item>
        <dao-dropdown-item
          color="red"
          @click="showDialog(row.metadata.name as string)"
        >
          {{ t('common.delete') }}
        </dao-dropdown-item>
      </template>

      <template #action>
        <dao-button @click="onCreate">
          {{ t('common.create') }}
        </dao-button>
      </template>
    </dao-table>
  </div>

  <dao-dialog
    :model-value="isShow"
    header="Basic Dialog"
    @cancel="hideDialog"
    @confirm="confirmDelete"
  >
    <div class="body">
      <div class="content">
        {{ $t('views.hyperparameter.deleteConfirm', { hyperparameterToDelete }) }}
      </div>
    </div>
    <template #footer>
      <dao-confirm-dialog-footer
        :text="hyperparameterToDelete"
        :confirm-text="t('common.delete')"
      />
    </template>
  </dao-dialog>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { defineColumns } from '@dao-style/core';
import {
  type Hyperparameter, Theme, hyperparameterClient, Parameters,
} from '@/api/hyperparameter';
import { useNamespaceStore } from '@/stores/namespace';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useDateFormat } from '@dao-style/extend';
import omit from 'lodash/omit';
import { generateQueryString } from '@/utils/queryString';
import { useQueryTable } from '@/hooks/useQueryTable';
import { retrieveQuantization, useDeleteHyperparameter } from './composition/hyperparameter';

const { t } = useI18n();
const router = useRouter();
const { namespace } = storeToRefs(useNamespaceStore());

const columns = defineColumns([
  {
    id: 'name',
    header: t('views.Hyperparameter.name'),
    sortable: true,
  },
  {
    id: 'fineTuningType',
    header: t('views.Hyperparameter.fineTuningType'),
  },
  {
    id: 'parameters',
    header: t('views.Hyperparameter.parameters'),
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

const {
  isLoading, pagedData, page, pageSize, total, handleRefresh, search,
} = useQueryTable<Hyperparameter>(async () => hyperparameterClient.list(namespace.value));

const { onConfirmDelete } = useDeleteHyperparameter(namespace.value, handleRefresh);

// 监听命名空间变化，重新加载数据集
watch(namespace, handleRefresh);

const regroupParameters = (parameters: Parameters) => {
  const params = {
    ...omit(parameters, ['int4', 'int8', 'PEFT']),
    'int4/8': retrieveQuantization(parameters),
  };

  return generateQueryString(params);
};

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
</script>

<template>
  <div class="hyperparameter-list console-main-container">
    <dao-header
      type="2nd"
      :title="t('views.Hyperparameter.hyperparameterGroup')"
    />

    <dao-table
      id="demo"
      v-model:page-size="pageSize"
      v-model:current-page="page"
      v-model:search="search.keywords"
      :loading="isLoading"
      :fuzzy="{ key: 'fuzzy', single: true }"
      :columns="columns"
      :data="pagedData"
      :total="total"
      @refresh="handleRefresh"
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
        <dao-hover-card :data="regroupParameters(row.spec.parameters)">
          <template #item="{ text }">
            <dao-label-extend :color="Theme">
              {{ text }}
            </dao-label-extend>
          </template>
        </dao-hover-card>
      </template>

      <template #td-action-menu="{ row }">
        <dao-dropdown-item @click="onUpdate(row.metadata.name as string)">
          {{ t("common.edit") }}
        </dao-dropdown-item>
        <dao-dropdown-item
          color="red"
          @click="onConfirmDelete(row.metadata.name as string)"
        >
          {{ t("common.delete") }}
        </dao-dropdown-item>
      </template>

      <template #action>
        <dao-button @click="onCreate">
          {{ t("common.create") }}
        </dao-button>
      </template>
    </dao-table>
  </div>
</template>

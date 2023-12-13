<script lang="ts" setup>
import { RayService, rayServiceClient } from '@/api/ray-service';
import { useNamespaceStore } from '@/stores/namespace';
import { useQueryTable } from '@/hooks/useQueryTable';
import { defineColumns } from '@dao-style/core';
import ApplicationStatus from './components/application-status.vue';

const { namespace } = storeToRefs(useNamespaceStore());
const { t } = useI18n();

const columns = defineColumns([
  {
    id: 'name',
    header: t('views.Inference.list.table.header.name'),
  },
  {
    id: 'checkpoint',
    header: t('views.Inference.list.table.header.checkpoint'),
  },
  {
    id: 'llm',
    header: t('views.Inference.list.table.header.llm'),
  },
  {
    id: 'hyperparameter',
    header: t('views.Inference.list.table.header.hyperparameter'),
  },
  {
    id: 'status',
    header: t('views.Inference.list.table.header.status'),
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
} = useQueryTable(async () => rayServiceClient.list(namespace.value));

const selectedRows = ref<RayService[]>([]);

</script>

<template>
  <div class="inference-list console-main-container">
    <dao-header
      type="2nd"
      :title="$t('views.Inference.list.header')"
    />

    <dao-table
      v-model:page-size="pageSize"
      v-model:current-page="page"
      v-model:search="search.keywords"
      selectable
      :selected-rows="selectedRows"
      :loading="isLoading"
      :fuzzy="{ key: 'fuzzy', single: true }"
      :columns="columns"
      :data="pagedData"
      :total="total"
      @refresh="handleRefresh"
    >
      <template #batch-action>
        <dao-button>
          对比
        </dao-button>
      </template>

      <template #td-name="{ row }">
        <router-link
          class="list-name-link"
          :to="{
            name: 'HyperparameterDetail',
            params: {
              name: row.metadata?.name,
            },
          }"
        >
          {{ row.metadata?.name }}
        </router-link>
      </template>

      <template #td-status="{ row }">
        <template
          v-for="(value, key) in row.status?.activeServiceStatus?.applicationStatuses"
          :key="key"
        >
          {{ key }}
          <application-status
            :application-status="value"
          />
        </template>
      </template>
    </dao-table>
  </div>
</template>

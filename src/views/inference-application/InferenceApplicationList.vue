<script lang="ts" setup>
import {
  ApplicationStatus, RayService, ServiceStatus, listInferenceApplications,
} from '@/api/ray-service';
import { useNamespaceStore } from '@/stores/namespace';
import { useQueryTable } from '@/hooks/useQueryTable';
import { defineColumns } from '@dao-style/core';
import { useDateFormat } from '@dao-style/extend';

import ApplicationStatusComponent from './components/application-status.vue';
import { useDeleteInferenceApplication } from './composition/inference-application';

const { namespace } = storeToRefs(useNamespaceStore());
const { t } = useI18n();
const router = useRouter();

const columns = defineColumns([
  {
    id: 'name',
    header: t('views.InferenceApplication.list.table.header.name'),
  },
  {
    id: 'checkpoint',
    header: t('views.InferenceApplication.list.table.header.checkpoint'),
  },
  {
    id: 'llm',
    header: t('views.InferenceApplication.list.table.header.llm'),
  },
  {
    id: 'hyperparameter',
    header: t('views.InferenceApplication.list.table.header.hyperparameter'),
  },
  {
    id: 'status',
    header: t('views.InferenceApplication.list.table.header.status'),
  },
  {
    id: 'createAt',
    header: t('common.createTime'),
    sortable: true,
  },
  {
    id: 'action',
    header: '',
    defaultWidth: '60px',
  },
]);

const {
  isLoading, pagedData, page, pageSize, total, handleRefresh, search, sort,
} = useQueryTable(() => listInferenceApplications(namespace.value), { keys: ['status'] });

watch(namespace, handleRefresh);

const { onConfirmDelete } = useDeleteInferenceApplication(namespace, handleRefresh);

const selectedRows = ref<RayService[]>([]);

/**
 * Determines if a row is selectable based on its status and application statuses.
 * @param {RayService} row - The row object representing a service.
 * @returns {boolean} - True if the row is selectable, false otherwise.
 */
const selectable = (row: RayService) => {
  const serviceStatus = row.status?.serviceStatus;

  if (serviceStatus === ServiceStatus.Running && row.status?.activeServiceStatus?.applicationStatuses) {
    return Object.values(row.status.activeServiceStatus.applicationStatuses).every((appStatus) => appStatus.status === ApplicationStatus.RUNNING);
  }

  return false;
};

const onCompare = () => {
  const queryList = selectedRows.value?.map(({ metadata }) => metadata?.name);

  router.push({
    name: 'InferenceApplicationModelCompare',
    query: { servicename: queryList },
  });
};

</script>

<template>
  <div class="inference-list console-main-container">
    <dao-header
      type="2nd"
      :title="$t('views.InferenceApplication.list.header')"
    />

    <dao-table
      v-model:page-size="pageSize"
      v-model:current-page="page"
      v-model:search="search"
      :selectable="selectable"
      :selected-rows="selectedRows"
      :sort="sort"
      :loading="isLoading"
      :fuzzy="{ key: 'fuzzy', single: true }"
      :columns="columns"
      :data="pagedData"
      :total="total"
      @refresh="handleRefresh"
    >
      <template #batch-action>
        <dao-message
          v-if="selectedRows.length > 3"
          type="warning"
          :content="$t('views.InferenceApplication.list.compareLimit')"
          simple
        />
        <dao-button
          v-else
          @click="onCompare"
        >
          {{ t("views.InferenceApplication.list.compare") }}
        </dao-button>
      </template>

      <template #td-action-menu="{ row }">
        <dao-dropdown-item
          color="red"
          @click="onConfirmDelete(row)"
        >
          {{ t("common.delete") }}
        </dao-dropdown-item>
      </template>

      <template #td-name="{ row }">
        <span class="font-bold">
          {{ row.metadata?.name }}
        </span>
      </template>

      <template #td-status="{ row }">
        <application-status-component :ray-service-status="row.status" />
      </template>

      <template #td-createAt="{ row }">
        {{ useDateFormat(row.metadata?.creationTimestamp) }}
      </template>
    </dao-table>
  </div>
</template>

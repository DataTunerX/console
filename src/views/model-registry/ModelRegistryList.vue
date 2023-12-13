<script setup lang="ts">
import { useNamespaceStore } from '@/stores/namespace';
import { llmCheckpointClient } from '@/api/checkpoint';
import { useQueryTable } from '@/hooks/useQueryTable';

import { createDialog } from '@dao-style/extend';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog.vue';
import CardLayoutContainer from '@/components/CardLayoutContainer.vue';

import ModelCard from './components/ModelCard.vue';

const { namespace } = storeToRefs(useNamespaceStore());
const { t } = useI18n();

const {
  isLoading, pagedData, page, pageSize, total, handleRefresh, search,
} = useQueryTable(
  async () => llmCheckpointClient.list(namespace.value),
);

watch(namespace, handleRefresh);

const deleteFn = (name: string) => llmCheckpointClient.delete(namespace.value, name).then(() => {
  handleRefresh();
});

const onConfirmDelete = (name: string) => {
  const dialog = createDialog(ConfirmDeleteDialog);

  return dialog.show({
    header: t('views.ModelRegistry.deleteModelRegistry'),
    content: t('views.ModelRegistry.deleteModelRegistryContent'),
    name,
    deleteFn,
  });
};
</script>

<template>
  <div class="model-registry-list console-main-container">
    <dao-header
      type="2nd"
      :title="$t('views.ModelRegistry.modelRegistry')"
    />
    <dao-toolbar
      v-model:search="search.keywords"
      :fuzzy="{ key: 'fuzzy', single: true }"
      @refresh="handleRefresh"
    />

    <div v-loading="isLoading">
      <card-layout-container :cards="total">
        <model-card
          v-for="registry in pagedData"
          :key="registry.metadata?.name"
          :data="registry"
          @on-delete="onConfirmDelete"
        />
      </card-layout-container>

      <dao-pagination
        v-if="total"
        v-model:current-page="page"
        v-model:page-size="pageSize"
        class="mt-[20px]"
        :total="total"
      />

      <dao-empty
        v-else
        class="mt-[20px]"
      />
    </div>
  </div>
</template>

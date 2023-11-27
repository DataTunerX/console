<script setup lang="ts">
import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useNamespaceStore } from '@/stores/namespace';
import { llmCheckpointClient } from '@/api/checkpoint';
import { useQueryTable } from '@/hooks/useQueryTable';
import { useI18n } from 'vue-i18n';
import { createDialog } from '@dao-style/extend';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog.vue';

import FinetuneRegistryItem from './components/FinetuneRegistryItem.vue';

const { namespace } = storeToRefs(useNamespaceStore());
const { t } = useI18n();

const {
  isLoading, pagedData, page, pageSize, total, handleRefresh, search,
} = useQueryTable(async () => llmCheckpointClient.list(namespace.value));

watch(namespace, handleRefresh);

const deleteFn = (name: string) => llmCheckpointClient.delete(namespace.value, name).then(() => {
  handleRefresh();
});

const onConfirmDelete = (name: string) => {
  const dialog = createDialog(ConfirmDeleteDialog);

  return dialog.show({
    header: t('views.FinetuneRegistry.deleteFinetuneRegistry'),
    content: t('views.FinetuneRegistry.deleteFinetuneRegistryContent'),
    name,
    deleteFn,
  });
};

</script>

<template>
  <div class="finetune-registry-list console-main-container">
    <dao-header
      type="2nd"
      :title="$t('views.FinetuneRegistry.finetuneRegistry')"
    />
    <dao-toolbar
      v-model:search="search.keywords"
      :fuzzy="{ key: 'fuzzy', single: true }"
      @refresh="handleRefresh"
    />

    <dao-empty v-if="!pagedData.length" />

    <div
      v-else
      v-loading="isLoading"
      class="mt-[20px]"
    >
      <div class="registry-content">
        <FinetuneRegistryItem
          v-for="registry in pagedData"
          :key="registry.metadata?.name"
          :data="registry"
          @on-delete="onConfirmDelete"
        />
      </div>

      <dao-pagination
        v-if="total"
        v-model:current-page="page"
        v-model:page-size="pageSize"
        class="mt-[20px]"
        :total="total"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.registry-content {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px 30px;
}
</style>

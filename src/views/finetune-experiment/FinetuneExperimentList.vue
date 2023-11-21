<script setup lang="ts">
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useNamespaceStore } from '@/stores/namespace';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog.vue';
import { FinetuneExperiment, finetuneExperimentClient } from '@/api/finetune-experiment';
import { useQueryTable } from '@/hooks/useQueryTable';
import { createDialog } from '@dao-style/extend';
import { useI18n } from 'vue-i18n';
import FinetuneExperimentItem from './components/FinetuneExperimentItem.vue';
import { useFinetuneExperiment } from './composition/finetune';

const { namespace } = storeToRefs(useNamespaceStore());
const router = useRouter();
const { t } = useI18n();

const {
  isLoading, pagedData, page, pageSize, total, handleRefresh, search,
} = useQueryTable<FinetuneExperiment>(async () => finetuneExperimentClient.list(namespace.value));

watch(namespace, handleRefresh);

const onCreate = () => {
  router.push({
    name: 'FinetuneExperimentCreate',
  });
};

const deleteFn = (name: string) => finetuneExperimentClient.delete(namespace.value, name).then(() => {
  handleRefresh();
});

const onConfirmDelete = (name: string) => {
  const dialog = createDialog(ConfirmDeleteDialog);

  return dialog.show({
    header: t('views.FinetuneExperiment.deleteFineTuningExperiment'),
    content: t('views.FinetuneExperiment.deleteFineTuningExperimentContent'),
    name,
    deleteFn,
  });
};

const { stop } = useFinetuneExperiment();

const onConfirmStop = (workload: FinetuneExperiment) => {
  stop(workload).then(() => {
    handleRefresh();
  });
};
</script>

<template>
  <div class="finetune-experiment-list console-main-container">
    <dao-header
      type="2nd"
      :title="$t('views.FinetuneExperiment.finetuneExperiment')"
    />
    <dao-toolbar
      v-model:search="search.keywords"
      :fuzzy="{ key: 'fuzzy', single: true }"
      @refresh="handleRefresh"
    >
      <template #action>
        <dao-button
          type="primary"
          @click="onCreate"
        >
          {{ $t("views.FinetuneExperiment.createFineTuningExperiment") }}
        </dao-button>
      </template>
    </dao-toolbar>

    <dao-empty v-if="!pagedData.length" />

    <div
      v-else
      v-loading="isLoading"
      class="mt-[20px]"
    >
      <FinetuneExperimentItem
        v-for="experiment in pagedData"
        :key="experiment.metadata?.name"
        :data="experiment"
        @on-delete="onConfirmDelete"
        @on-stop="onConfirmStop"
      />

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

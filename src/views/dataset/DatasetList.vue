<template>
  <div class="dataset-list">
    <dao-header
      type="2nd"
      :title="$t('views.dataset.title')"
    />

    <dao-toolbar
      id="mspider-xpath-toolbar-btn__mesh-list-refresh"
      v-model:search="search"
      :search-options="searchOptions"
      :search-placeholder="' '"
      :fuzzy="{ key: '' }"
    >
      <template #action>
        <dao-button @click="onCreate">
          上传数据集
        </dao-button>
      </template>
    </dao-toolbar>

    <div
      class="mt-[20px]"
    >
      <dataset-item />
      <dao-pagination
        class="dataset-list__page"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import DatasetItem from './components/DatasetItem.vue';

const { t } = useI18n();
const router = useRouter();

const search = ref({});
const searchOptions = reactive([
  {
    key: 'name',
    label: t('common.name'),
    single: true,
  },
]);
const searchStr = computed(() => Object.entries(search.value)
  .map(([key, value]) => {
    if (key) {
      return key === 'mode' || key === 'status'
        ? `${key}="${(value as Array<string>)?.[0]}"`
        : `${key}=${(value as Array<string>)?.[0]}`;
    }

    return (value as Array<string>).join(';');
  })
  .join(';'));

const defaultQuery = reactive({
  page: {
    search: searchStr,
    sort: 'createdAt desc',
  },
});

const onCreate = () => {
  router.push({
    name: 'DatasetCreate',
  });
};

</script>
<style lang="scss" scoped>
.dataset-list {
  flex: auto;
  padding: 0 12% 30px;
  overflow: auto;

  &__page {
    margin-top: 20px;
  }

  &-btn--create {
    margin-left: 10px;

    :deep .dao-icon {
      transform: rotate(90deg);
    }
  }
}
</style>

<template>
  <div class="dataset-detail console-main-container">
    <dao-header
      type="3rd"
    >
      <template #breadcrumb>
        <dao-breadcrumb
          icon="icon-cluster"
          @navigate="router.push"
        >
          <dao-breadcrumb-item
            label="数据集"
            :to="{ name: 'DatasetList' }"
          />
          <dao-breadcrumb-item
            :label="'数据集1'"
          />
        </dao-breadcrumb>
      </template>
    </dao-header>

    <div class="flex flex-nowrap justify-between">
      <dao-card
        class="flex-1 w-0"
        type="simple"
        title="基本信息"
      >
        <dao-card-item>
          <dao-key-value-layout
            direction="vertical"
            :column="3"
            :data="infos"
          />
        </dao-card-item>
      </dao-card>

      <dao-card
        type="simple"
        title="插件信息"
        class="flex-1 ml-[20px]"
      >
        <dao-card-item>
          <dao-key-value-layout
            direction="vertical"
            :column="3"
            :data="infos"
          />
        </dao-card-item>
      </dao-card>
    </div>

    <dao-card
      type="simple"
      title="数据集文件源"
      class="mt-[16px]"
    >
      <dao-card-item>
        数据集文件源：http://xxxxx.file
      </dao-card-item>
    </dao-card>

    <dao-card
      type="simple"
      title="数据集信息配置"
      class="mt-[16px]"
    >
      <dao-card-item class="my-[-10px]">
        <dao-table
          hide-toolbar
          compact
          :columns="columns"
          :data="data"
          :page-layout="[]"
          no-shadow
        />
      </dao-card-item>
    </dao-card>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const infos = computed(() => {
  const items = [
    {
      label: 'Language',
      value: 'Chinese',
    },
    {
      label: 'License',
      value: 'XX BY',
    },
    {
      label: 'Task',
      value: 'sss',
    },
    {
      label: '文本处理',
      value: 'Chinese',
    },
    {
      label: 'Size',
      value: '10 K',
    },
  ];

  return items;
});

const columns = computed(() => [
  {
    id: 'name',
    header: '子数据集名称',
  },
]);

const data = ref([
  {
    name: 'DateTest123',
  },
  {
    name: 'DateTest123',
  },
  {
    name: 'DateTest123',
  },
]);
</script>

<style lang="scss" scoped>
.dataset-detail {
  &__tabs {
    margin-top: 20px;
  }

  .action-icon {
    margin-right: 10px;
  }

  .action-button {
    margin-left: 10px;
  }
}
</style>

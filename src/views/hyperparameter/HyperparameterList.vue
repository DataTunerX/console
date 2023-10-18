<script setup lang="tsx">
import { ref, watchEffect } from 'vue';
import {
  type DaoTableSort, defineColumns, TableEmits,
} from '@dao-style/core';
import { useRouter } from 'vue-router';

const router = useRouter();

interface DataItem {
  id: string,
  name: string,
  gender: string,
  age: number,
  company: string,
}

const data = ref<DataItem[]>([]);
const showData = ref<DataItem[]>([]);
const compact = ref(false);
const selectable = ref(false);
const expandable = ref(false);
const hideSetting = ref(false);
const hideToolbar = ref(false);
const hideBatchBar = ref(false);
const pageSize = ref(10);
const currentPage = ref(1);
const eventLog = ref<(string | number | boolean)[]>([]);
const search = ref({});

const selectedRows = ref([]);

for (let i = 1; i < 101; i += 1) {
  const item = {
    id: `id${i}`,
    name: `name${i}`,
    gender: 'male',
    longText: 'longTextjwwjwwjwwjwwjwwjwwjwwjwwjwwjwwjwwjwwjww',
    age: 20,
    company: 'DaoCloud',
  };

  data.value.push(item);
}

const columns = defineColumns([
  {
    id: 'name',
    header: 'Name',
    sortable: true,
    defaultWidth: '100px',
    minWidth: 200,
    maxWidth: 500,
    className: 'name',
  },
  {
    id: 'gender',
    header: 'Gender',
    defaultWidth: '200px',
    minWidth: 100,
    sortable: true,
  },
  {
    id: 'longText',
    header: 'LongText',
    minWidth: 100,
  },
  {
    id: 'age',
    header: 'Age',
  },
  {
    id: 'action',
    header: 'Action',
  },
] as const);

watchEffect(() => {
  showData.value = data.value.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value,
  );
});

const sortChangeEvent = (params: DaoTableSort) => {
  eventLog.value.push('-- sort change --', JSON.stringify(params));
};

const nextPage = (val: number) => {
  eventLog.value.push('-- next --', val);
};

const prevPage: TableEmits['prev'] = async (val: number) => {
  await new Promise((resolve) => {
    resolve(1);
  });
  eventLog.value.push('-- prev --', val);
};

const pageChange = (val: number) => {
  eventLog.value.push('-- page change --', val);
};

const sizeChange = (val: number) => {
  eventLog.value.push('-- size change --', val);
};

const onDelete = (row: Record<string, unknown>, rowIndex: number) => {
  data.value.splice(rowIndex, 1);
  eventLog.value.push('-- row-delete --', JSON.stringify(row), rowIndex);
};

const searchChange = () => {
  eventLog.value.push('-- search --');
};

const refresh = () => {
  eventLog.value.push('-- refresh --');
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
      :title="'参数组'"
    />

    <dao-table
      id="demo"
      v-model:page-size="pageSize"
      v-model:current-page="currentPage"
      v-model:selected-rows="selectedRows"
      v-model:search="search"
      :fuzzy="{ key: 'fuzzy' }"
      :columns="columns"
      :data="showData"
      :compact="compact"
      :selectable="selectable"
      :expandable="expandable"
      :total="100"
      :hide-toolbar="hideToolbar"
      :hide-batch-bar="hideBatchBar"
      :hide-setting="hideSetting"
      :page-size-options="[10, 15, 20]"
      @sort-change="sortChangeEvent"
      @next="nextPage"
      @prev="prevPage"
      @page-change="pageChange"
      @size-change="sizeChange"
      @search="searchChange"
      @refresh="refresh"
    >
      <template #th-action="{column}">
        <div>{{ column.header }}</div>
      </template>

      <template #td-action-menu="{row,rowIndex}">
        <dao-dropdown-item>Edit</dao-dropdown-item>
        <dao-dropdown-item
          color="red"
          @click="onDelete(row,rowIndex)"
        >
          Delete
        </dao-dropdown-item>
      </template>

      <template #action>
        <dao-button @click="onCreate">
          Create
        </dao-button>
      </template>
    </dao-table>
  </div>
</template>

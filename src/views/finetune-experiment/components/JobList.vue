<script lang="ts" setup>
import { FinetuneJobWithName } from '@/api/finetune-experiment';
import { useQueryTable } from '@/hooks/useQueryTable';
import { AxiosResponse } from 'axios';
import { List } from '@/plugins/axios/client';
import FinetuneJobItem from './FinetuneJobItem.vue';

const props = defineProps({
  jobs: {
    type: Array as PropType<FinetuneJobWithName[]>,
    default: () => ([]),
  },
});

const route = useRoute();

const name = route.params.name as string;

const fakeFetchJobs = () => Promise.resolve({
  data: {
    items: props.jobs,
  },
} as AxiosResponse<List<FinetuneJobWithName>>);

const {
  items, page, pageSize, total, search, fetchList,
} = useQueryTable<FinetuneJobWithName>(fakeFetchJobs);

watch(() => props.jobs, () => {
  fetchList();
});

</script>

<template>
  <dao-toolbar
    v-model:search="search"
    no-rounded
    hide-refresh
    :fuzzy="{ key: 'fuzzy', single: true }"
  />

  <finetune-job-item
    v-for="(experiment, index) in items"
    :key="index"
    :data="experiment"
    :name="name"
  />

  <dao-pagination
    v-model:current-page="page"
    v-model:page-size="pageSize"
    class="mt-[20px]"
    :total="total"
    :no-shadow="true"
  />
</template>

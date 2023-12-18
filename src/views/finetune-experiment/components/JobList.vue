<script lang="ts" setup>
import { FinetuneJobWithMetrics } from '@/api/finetune-experiment';
import { useQueryTable } from '@/hooks/useQueryTable';
import { AxiosResponse } from 'axios';
import { List } from '@/plugins/axios/client';
import FinetuneJobItem from './FinetuneJobItem.vue';
import { useFinetuneExperimentStore } from '../composition/store';

const route = useRoute();
const name = route.params.name as string;

const { jobs } = storeToRefs(useFinetuneExperimentStore());

const fetchJobs = () => Promise.resolve({
  data: {
    items: jobs.value ?? [],
  },
} as AxiosResponse<List<FinetuneJobWithMetrics>>);

const {
  items, page, pageSize, total, search, fetchList,
} = useQueryTable<FinetuneJobWithMetrics>(fetchJobs);

watch(jobs, () => {
  console.log('jobsWithStatus changed');
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
    v-for="job in items"
    :key="job.name"
    :data="job"
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

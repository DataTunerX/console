<script lang="ts" setup>
import { ProcessedEvalMetrics } from '@/api/finetune-metrics';
import LineChart from './LineChart.vue';

defineProps({
  data: {
    type: Array as PropType<ProcessedEvalMetrics[]>,
    required: true,
  },
  hideTitle: {
    type: Boolean,
    default: false,
  },
});

const container = 'container-performance-evaluation';

</script>

<template>
  <line-chart
    :container="container"
    :data="data"
    y="eval_perplexity"
    :hide-title="hideTitle"
    title="Eval Perplexity"
  />
</template>
